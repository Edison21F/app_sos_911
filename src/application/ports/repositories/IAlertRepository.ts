import { Alert, AlertLocation } from '../../domain/entities/Alert';

export interface IAlertRepository {
    sendAlert(type: Alert['type'], location: AlertLocation, groupId?: string): Promise<void>;
    getActiveAlerts(): Promise<Alert[]>;
    getAlertHistory(): Promise<Alert[]>;
    cancelAlert(alertId: string): Promise<void>;
}
