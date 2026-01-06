import { IClientRepository, UpdateClientData, DashboardStats } from '../../application/ports/repositories/IClientRepository';
import { Client, ClientPhone } from '../../domain/entities/Client';
import client from '../http/client';
import { Platform } from 'react-native';

const API_BASE_URL = client.defaults.baseURL ? client.defaults.baseURL.replace('/api', '') : '';

/**
 * CAPA DE INFRAESTRUCTURA: Repositorio
 * 
 * RESPONSABILIDAD:
 * Implementación concreta del acceso a datos del cliente.
 * Realiza peticiones HTTP al backend y mapea las respuestas a entidades del dominio.
 */
export class ClientRepositoryApi implements IClientRepository {
    async getClientProfile(clientId: string): Promise<Client> {
        const response = await client.get(`/clientes/detalle/${clientId}`);
        const data = response.data;

        // Build full profile image URL if foto_perfil exists
        const profileImageUrl = data.foto_perfil 
            ? `${API_BASE_URL}/uploads/profiles/${data.foto_perfil}`
            : undefined;

        return {
            id: data.id,
            name: data.nombre,
            email: data.correo_electronico,
            identityCard: data.cedula_identidad,
            address: data.direccion,
            birthDate: data.fecha_nacimiento,
            profileImage: profileImageUrl,
            medicalRecord: data.ficha_medica ? {
                bloodType: data.ficha_medica.tipo_sangre,
                allergies: data.ficha_medica.alergias,
                conditions: data.ficha_medica.padecimiento,
                medications: data.ficha_medica.medicamentos
            } : undefined
        };
    }

    async updateClientProfile(clientId: string, data: UpdateClientData): Promise<void> {
        const payload: any = {
            nombre: data.name,
            correo_electronico: data.email,
            cedula_identidad: data.idNumber,
            direccion: data.address,
            fecha_nacimiento: data.birthDate,
            ficha_medica: data.medicalRecord ? {
                tipo_sangre: data.medicalRecord.bloodType,
                alergias: data.medicalRecord.allergies,
                padecimiento: data.medicalRecord.conditions,
                medicamentos: data.medicalRecord.medications
            } : undefined
        };

        if (data.password) {
            payload.contrasena = data.password;
        }

        await client.put(`/clientes/actualizar/${clientId}`, payload);
    }

    async uploadProfileImage(clientId: string, imageUri: string): Promise<string> {
        console.log('ClientRepositoryApi.uploadProfileImage: starting for clientId:', clientId);
        console.log('ClientRepositoryApi.uploadProfileImage: imageUri:', imageUri);
        
        const formData = new FormData();
        // @ts-ignore
        formData.append('foto_perfil', {
            uri: Platform.OS === 'android' ? imageUri : imageUri.replace('file://', ''),
            name: `profile_${clientId}.jpg`,
            type: 'image/jpeg',
        });

        const API_URL = `${API_BASE_URL}/clientes/upload-profile/${clientId}`;
        console.log('ClientRepositoryApi.uploadProfileImage: fetching:', API_URL);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });
            
            console.log('ClientRepositoryApi.uploadProfileImage: response status:', response.status);
            
            const data = await response.json();
            console.log('ClientRepositoryApi.uploadProfileImage: response data:', JSON.stringify(data));
            
            if (response.ok && data.foto_perfil) {
                const result = `${API_BASE_URL}/uploads/profiles/${data.foto_perfil}`;
                console.log('ClientRepositoryApi.uploadProfileImage: success, returning:', result);
                return result;
            }
            throw new Error('Failed to upload image: ' + (data.message || 'Unknown error'));
        } catch (error) {
            console.error('ClientRepositoryApi.uploadProfileImage: error:', error);
            throw error;
        }
    }

    async getClientPhones(clientId: string): Promise<ClientPhone[]> {
        const response = await client.get(`/clientes_numeros/listar/por-cliente/${clientId}`);
        return response.data.map((p: any) => ({
            id: p.id,
            detail: p.nombre,
            number: p.numero
        }));
    }

    async addClientPhone(clientId: string, detail: string, number: string): Promise<ClientPhone> {
        const response = await client.post('/clientes_numeros/crear', {
            clienteId: clientId,
            nombre: detail,
            numero: number
        });
        return {
            id: response.data.clienteNumero.id,
            detail: detail,
            number: number
        };
    }

    async updateClientPhone(phoneId: string | number, detail: string, number: string): Promise<void> {
        await client.put(`/clientes_numeros/actualizar/${phoneId}`, {
            nombre: detail,
            numero: number,
            estado: 'activo'
        });
    }

    async deleteClientPhone(phoneId: string | number): Promise<void> {
        await client.delete(`/clientes_numeros/eliminar/${phoneId}`);
    }

    async getDashboardStats(clientId: string): Promise<DashboardStats> {
        const response = await client.get(`/clientes/stats/${clientId}`);
        return response.data.stats;
    }

    getProfileImageUrl(imagePath: string): string {
        if (!imagePath) return '';
        if (imagePath.startsWith('http')) return imagePath;
        return `${API_BASE_URL}/uploads/profiles/${imagePath}`;
    }
}
