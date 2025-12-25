import { IAlertRepository } from '../../ports/repositories/IAlertRepository';

export class GetNotificationsUseCase {
    constructor(private alertRepository: IAlertRepository) { }

    async execute(userId: string): Promise<any[]> {
        return this.alertRepository.getNotifications(userId);
    }
}
