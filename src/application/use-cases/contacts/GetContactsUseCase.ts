import { Contact } from '../../../domain/entities/Contact';
import { IContactRepository } from '../../ports/repositories/IContactRepository';

export class GetContactsUseCase {
    constructor(private contactRepository: IContactRepository) { }

    async execute(userId: string): Promise<Contact[]> {
        return this.contactRepository.getContacts(userId);
    }
}
