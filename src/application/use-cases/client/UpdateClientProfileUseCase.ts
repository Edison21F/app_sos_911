import { IClientRepository, UpdateClientData } from '../../ports/repositories/IClientRepository';

export class UpdateClientProfileUseCase {
    constructor(private clientRepository: IClientRepository) { }

    async execute(clientId: string, data: UpdateClientData): Promise<void> {
        await this.clientRepository.updateClientProfile(clientId, data);
    }
}
