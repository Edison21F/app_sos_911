import { IAlertRepository } from '../../ports/repositories/IAlertRepository';

export class UpdateAlertStatusUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(alertId: string, status: string, comment?: string): Promise<void> {
        return this.alertRepository.updateAlertStatus(alertId, status, comment);
    }
}
