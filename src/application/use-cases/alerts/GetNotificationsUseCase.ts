import { IAlertRepository } from '../../ports/repositories/IAlertRepository';

export class GetNotificationsUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(userId: string, timestamp?: number): Promise<any[]> {
        return this.alertRepository.getNotifications(userId, timestamp);
    }
}
