import { User } from './User';

export interface MedicalRecord {
    bloodType?: string;
    allergies?: string;
    conditions?: string;
    medications?: string;
}

export interface ClientPhone {
    id: number | string;
    detail: string;
    number: string;
}

export interface Client extends User {
    medicalRecord?: MedicalRecord;
    phones?: ClientPhone[];
}
