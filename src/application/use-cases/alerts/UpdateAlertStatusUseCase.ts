import { IAlertRepository } from '../../ports/repositories/IAlertRepository';

export class UpdateAlertStatusUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(alertId: string, status: string, reason?: string): Promise<void> {
        if (!alertId) throw new Error('Alert ID is required');

        // We can pass the reason to the repository if supported, for now we just handle the status transition
        if (status === 'CERRADA' || status === 'CANCELADA') {
            await this.alertRepository.cancelAlert(alertId);
        }
    }
}
