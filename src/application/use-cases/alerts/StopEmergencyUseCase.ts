import { IAlertRepository } from '../../ports/repositories/IAlertRepository';
import { IDeviceService } from '../../ports/services/IDeviceService';

export class StopEmergencyUseCase {
    constructor(
        private alertRepository: IAlertRepository,
        private deviceService: IDeviceService
    ) { }

    async execute(alertId: string): Promise<void> {
        // 1. Stop Device Behavior (Sound/Vibration)
        await this.deviceService.stopBehaviors();

        // 2. Update Alert Status in Backend
        if (alertId) {
            await this.alertRepository.updateAlertStatus(alertId, 'CERRADA', 'Usuario indica estar a salvo (Estoy a Salvo)');
        }
    }
}
