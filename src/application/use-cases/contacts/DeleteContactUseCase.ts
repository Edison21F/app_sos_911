import { IContactRepository } from '../../ports/repositories/IContactRepository';

export class DeleteContactUseCase {
    constructor(private contactRepository: IContactRepository) { }

    async execute(contactId: string): Promise<void> {
        await this.contactRepository.deleteContact(contactId);
    }
}
