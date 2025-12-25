import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class LeaveGroupUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(groupId: string, userId: string): Promise<void> {
        await this.groupRepository.leaveGroup(groupId, userId);
    }
}
