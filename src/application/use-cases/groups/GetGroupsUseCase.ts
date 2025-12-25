import { Group } from '../../../domain/entities/Group';
import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class GetGroupsUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(userId: string): Promise<Group[]> {
        return this.groupRepository.getGroups(userId);
    }
}
