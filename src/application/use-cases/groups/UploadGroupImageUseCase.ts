import { IGroupRepository } from '../../ports/repositories/IGroupRepository';

export class UploadGroupImageUseCase {
    constructor(private groupRepository: IGroupRepository) { }

    async execute(groupId: string, formData: FormData): Promise<void> {
        await this.groupRepository.uploadGroupImage(groupId, formData);
    }
}
