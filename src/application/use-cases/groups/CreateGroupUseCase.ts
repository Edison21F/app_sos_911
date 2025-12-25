import { Group } from '../../../domain/entities/Group';
import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class CreateGroupUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(data: { name: string; description: string; userId: string }): Promise<Group> {
        return this.groupRepository.createGroup(data);
    }
}
