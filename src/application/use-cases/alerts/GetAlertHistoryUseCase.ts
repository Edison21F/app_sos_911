import { IAlertRepository } from '../../ports/repositories/IAlertRepository';
import { Alert } from '../../../domain/entities/Alert';

export class GetAlertHistoryUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(userId?: string): Promise<Alert[]> {
        return this.alertRepository.getAlertHistory(userId);
    }
}
