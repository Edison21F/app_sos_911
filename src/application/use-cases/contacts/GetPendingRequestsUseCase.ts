import { IContactRepository } from '../../ports/repositories/IContactRepository';

export class GetPendingRequestsUseCase {
    constructor(private contactRepository: IContactRepository) { }

    async execute(userId: string): Promise<any[]> {
        return this.contactRepository.getPendingRequests(userId);
    }
}
