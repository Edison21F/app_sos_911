import { IAlertRepository } from '../../ports/repositories/IAlertRepository';

export class GetNearbyAlertsUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(lat: number, lng: number, radius: number = 10000): Promise<any[]> {
        return await this.alertRepository.getNearbyAlerts(lat, lng, radius);
    }
}
