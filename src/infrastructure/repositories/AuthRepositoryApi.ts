import { IAuthRepository, LoginCredentials, RegisterData } from '../../application/ports/repositories/IAuthRepository';
import { User } from '../../domain/entities/User';
import client from '../http/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class AuthRepositoryApi implements IAuthRepository {
    async login(credentials: LoginCredentials): Promise<User> {
        const response = await client.post('/clientes/login', {
            correo_electronico: credentials.email,
            contrasena: credentials.password
        });

        const userId = response.data.user?.id || response.data.userId;

        if (!userId) {
            throw new Error('Login failed: No user ID returned');
        }

        await AsyncStorage.setItem('clienteId', userId.toString());

        if (response.data.csrfToken) {
            await AsyncStorage.setItem('csrfToken', response.data.csrfToken);
        }

        // Fetch full user details to ensure we return a complete User entity
        const user = await this.getCurrentUser();
        if (!user) {
            throw new Error('Failed to fetch user details after login');
        }
        return user;
    }

    async register(data: RegisterData): Promise<User> {
        const response = await client.post('/clientes/registro', data);
        return this.mapToUser(response.data);
    }

    async logout(): Promise<void> {
        await AsyncStorage.removeItem('clienteId');
        await AsyncStorage.removeItem('csrfToken');
    }

    async getCurrentUser(): Promise<User | null> {
        const id = await AsyncStorage.getItem('clienteId');
        if (!id) return null;

        try {
            const response = await client.get(`/clientes/detalle/${id}`);
            return this.mapToUser(response.data);
        } catch (e) {
            return null;
        }
    }

    async isAuthenticated(): Promise<boolean> {
        const user = await this.getCurrentUser();
        return !!user;
    }

    async getCsrfToken(): Promise<string | null> {
        try {
            await AsyncStorage.removeItem('csrfToken');
            await AsyncStorage.removeItem('sessionCookie');
            const response = await client.get('/csrf-token');
            const token = response.data.csrfToken;
            if (token) {
                await AsyncStorage.setItem('csrfToken', token);

                // Process cookie if present
                const setCookieHeader = response.headers['set-cookie'];
                if (setCookieHeader) {
                    let cookieValue = Array.isArray(setCookieHeader) ? setCookieHeader.join('; ') : setCookieHeader;
                    if (cookieValue) {
                        cookieValue = cookieValue.split(';')[0];
                    }
                    await AsyncStorage.setItem('sessionCookie', cookieValue as string);
                }
                return token;
            }
            return null;
        } catch (error) {
            console.error('Error fetching CSRF token:', error);
            return null;
        }
    }

    private mapToUser(data: any): User {
        return {
            id: data.id,
            name: data.nombre,
            email: data.correo_electronico,
            identityCard: data.cedula_identidad,
            address: data.direccion,
            birthDate: data.fecha_nacimiento,
            status: data.estado,
            helpCount: data.numero_ayudas,
        };
    }
}
