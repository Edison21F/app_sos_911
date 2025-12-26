import { User } from '../../../domain/entities/User';

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterData extends Omit<User, 'id'> {
    password: string;
}

export interface IAuthRepository {
    login(credentials: LoginCredentials): Promise<User>;
    register(data: RegisterData): Promise<User>;
    logout(): Promise<void>;
    getCurrentUser(): Promise<User | null>;
    getCsrfToken(): Promise<string | null>;
    isAuthenticated(): Promise<boolean>;
}
