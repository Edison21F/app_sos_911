import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class GetGroupMembersUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(groupId: string): Promise<any[]> {
        return this.groupRepository.getGroupMembers(groupId);
    }
}
