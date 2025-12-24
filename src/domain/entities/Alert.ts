// Based on ALERTA_TYPES from legacy service
export type AlertType = 'MEDICA' | 'PELIGRO' | 'INCENDIO' | 'TRANSITO' | 'PREVENTIVA' | 'SOS' | '911';
export type AlertStatus = 'CREADA' | 'EN_PROCESO' | 'CERRADA' | 'CANCELADA';

export interface AlertLocation {
    latitude: number;
    longitude: number;
    address?: string;
}

export interface Alert {
    id: string;
    title: string;
    description?: string;
    time: Date;
    type: AlertType;
    status: AlertStatus;
    location: AlertLocation;
    senderId?: string;
    senderName?: string;
    groupId?: string;
    groupName?: string;
    responseComment?: string;
}
