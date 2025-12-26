import { Client, ClientPhone } from '../../../domain/entities/Client';

export interface UpdateClientData {
    name?: string;
    email?: string;
    address?: string;
    idNumber?: string;
    birthDate?: string;
    password?: string;
    medicalRecord?: {
        bloodType?: string;
        allergies?: string;
        conditions?: string;
        medications?: string;
    };
}

export interface IClientRepository {
    getClientProfile(clientId: string): Promise<Client>;
    updateClientProfile(clientId: string, data: UpdateClientData): Promise<void>;
    uploadProfileImage(clientId: string, imageUri: string): Promise<string>;
    getClientPhones(clientId: string): Promise<ClientPhone[]>;
    addClientPhone(clientId: string, detail: string, number: string): Promise<ClientPhone>;
    updateClientPhone(phoneId: string | number, detail: string, number: string): Promise<void>;
    deleteClientPhone(phoneId: string | number): Promise<void>;
}
