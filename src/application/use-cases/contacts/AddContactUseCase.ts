import { Contact } from '../../../domain/entities/Contact';
import { IContactRepository } from '../../ports/repositories/IContactRepository';

export class AddContactUseCase {
    constructor(private contactRepository: IContactRepository) { }

    async execute(contact: Contact, userId: string): Promise<Contact> {
        return this.contactRepository.addContact(contact, userId);
    }
}
