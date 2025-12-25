import { Group } from '../../../domain/entities/Group';
import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class GetGroupDetailsUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(groupId: string): Promise<Group> {
        return this.groupRepository.getGroupDetails(groupId);
    }
}
