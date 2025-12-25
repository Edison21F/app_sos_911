export interface Contact {
    id: string;
    name: string;
    phone: string;
    relationship: string;
    isEmergency: boolean;
    image?: string;
    status?: 'PENDIENTE' | 'VINCULADO' | 'RECHAZADO';
}
