import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class GetGroupMessagesUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(groupId: string): Promise<any[]> {
        return this.groupRepository.getGroupMessages(groupId);
    }
}
