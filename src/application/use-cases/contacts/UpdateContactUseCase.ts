import { Contact } from '../../../domain/entities/Contact';
import { IContactRepository } from '../../ports/repositories/IContactRepository';

export class UpdateContactUseCase {
    constructor(private contactRepository: IContactRepository) { }

    async execute(contact: Contact): Promise<void> {
        await this.contactRepository.updateContact(contact);
    }
}
