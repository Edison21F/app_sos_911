import { Contact } from '../../../domain/entities/Contact';

export interface IContactRepository {
    getContacts(userId: string): Promise<Contact[]>;
    getPendingRequests(userId: string): Promise<any[]>; // TODO: Define Request entity
    sendContactRequest(userId: string, criteria: string): Promise<void>;
    respondToRequest(requestId: number, response: 'ACEPTAR' | 'RECHAZAR'): Promise<void>;
    addContact(contact: Contact, userId: string): Promise<Contact>;
    updateContact(contact: Contact): Promise<void>;
    deleteContact(contactId: string): Promise<void>;
    getContactDetails(contactId: string): Promise<Contact>;
}
