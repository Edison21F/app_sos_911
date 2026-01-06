import { Alert, AlertLocation } from '../../../domain/entities/Alert';

export interface IAlertRepository {
    sendAlert(type: Alert['type'], location: AlertLocation, groupId?: string): Promise<Alert>;
    getActiveAlerts(): Promise<Alert[]>;
    getAlertHistory(userId?: string): Promise<Alert[]>;
    getNotifications(userId: string, timestamp?: number): Promise<any[]>; // TODO: Define Notification Entity
    getNearbyAlerts(lat: number, lng: number, radius: number): Promise<any[]>;
    cancelAlert(alertId: string): Promise<void>;
    updateLocation(alertId: string, location: AlertLocation): Promise<void>;
    updateAlertStatus(alertId: string, status: string, comment?: string): Promise<void>;
}
