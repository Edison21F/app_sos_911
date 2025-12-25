import { IAlertRepository } from '../../ports/repositories/IAlertRepository';
import { IDeviceService } from '../../ports/services/IDeviceService';
import { Alert, AlertLocation } from '../../../domain/entities/Alert';

export class SendAlertUseCase {
    constructor(
        private alertRepository: IAlertRepository,
        private deviceService: IDeviceService
    ) { }

    async execute(type: Alert['type'], location: AlertLocation, groupId?: string): Promise<Alert> {
        // 1. Trigger Device Behavior (Vibration/Sound)
        // Map alert type to behavior type if necessary, or use same enum string
        await this.deviceService.triggerBehavior(type as any);

        // 2. Validate location
        if (!location.latitude || !location.longitude) {
            throw new Error('Invalid location');
        }

        // 3. Send Alert (Repository handles Online/Offline logic)
        return this.alertRepository.sendAlert(type, location, groupId);
    }
}
