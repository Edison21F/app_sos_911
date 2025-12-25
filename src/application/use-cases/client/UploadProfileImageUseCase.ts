import { IClientRepository } from '../../ports/repositories/IClientRepository';

export class UploadProfileImageUseCase {
    constructor(private clientRepository: IClientRepository) { }

    async execute(clientId: string, imageUri: string): Promise<string> {
        return await this.clientRepository.uploadProfileImage(clientId, imageUri);
    }
}
