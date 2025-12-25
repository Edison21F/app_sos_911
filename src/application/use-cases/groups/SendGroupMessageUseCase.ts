import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class SendGroupMessageUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(groupId: string, userId: string, message: string): Promise<void> {
        await this.groupRepository.sendGroupMessage(groupId, userId, message);
    }
}
