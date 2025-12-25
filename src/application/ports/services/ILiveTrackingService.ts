export interface ILiveTrackingService {
    connect(): void;
    disconnect(): void;
    subscribeToAlert(alertId: string, callback: (data: any) => void): void;
    unsubscribeFromAlert(alertId: string): void;
}
