import { IAlertRepository } from '../../ports/repositories/IAlertRepository';
import { AlertLocation } from '../../../domain/entities/Alert';

export class UpdateAlertLocationUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(alertId: string, location: AlertLocation): Promise<void> {
        if (!alertId) throw new Error('Alert ID is required');
        if (!location.latitude || !location.longitude) throw new Error('Invalid location');

        await this.alertRepository.updateLocation(alertId, location);
    }
}
