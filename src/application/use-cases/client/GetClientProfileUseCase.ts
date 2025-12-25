import { IClientRepository } from '../../ports/repositories/IClientRepository';
import { Client } from '../../../domain/entities/Client';

export class GetClientProfileUseCase {
    constructor(private clientRepository: IClientRepository) { }

    async execute(clientId: string): Promise<Client> {
        return await this.clientRepository.getClientProfile(clientId);
    }
}
