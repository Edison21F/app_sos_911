import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class JoinGroupUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(code: string, userId: string): Promise<void> {
        await this.groupRepository.joinGroup(code, userId);
    }
}
