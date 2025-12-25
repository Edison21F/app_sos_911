import { IClientRepository } from '../../ports/repositories/IClientRepository';
import { ClientPhone } from '../../../domain/entities/Client';

export class ManageClientPhonesUseCase {
    constructor(private clientRepository: IClientRepository) { }

    async getPhones(clientId: string): Promise<ClientPhone[]> {
        return await this.clientRepository.getClientPhones(clientId);
    }

    async addPhone(clientId: string, detail: string, number: string): Promise<ClientPhone> {
        return await this.clientRepository.addClientPhone(clientId, detail, number);
    }

    async updatePhone(phoneId: string | number, detail: string, number: string): Promise<void> {
        await this.clientRepository.updateClientPhone(phoneId, detail, number);
    }

    async deletePhone(phoneId: string | number): Promise<void> {
        await this.clientRepository.deleteClientPhone(phoneId);
    }
}
