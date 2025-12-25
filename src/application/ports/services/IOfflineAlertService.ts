export interface IOfflineAlertService {
    queueAlert(alertData: any): Promise<void>;
    syncPendingAlerts(): Promise<void>;
}
