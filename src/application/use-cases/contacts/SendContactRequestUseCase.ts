import { IContactRepository } from '../../ports/repositories/IContactRepository';

export class SendContactRequestUseCase {
    constructor(private contactRepository: IContactRepository) { }

    async execute(userId: string, criteria: string): Promise<void> {
        return this.contactRepository.sendContactRequest(userId, criteria);
    }
}
