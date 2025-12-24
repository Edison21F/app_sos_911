import { IAlertRepository } from '../../ports/repositories/IAlertRepository';
import { Alert, AlertLocation } from '../../../domain/entities/Alert';

export class SendAlertUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(type: Alert['type'], location: AlertLocation, groupId?: string): Promise<void> {
        // Validate location
        if (!location.latitude || !location.longitude) {
            throw new Error('Invalid location');
        }

        await this.alertRepository.sendAlert(type, location, groupId);
    }
}
