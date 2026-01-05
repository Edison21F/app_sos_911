import { IContactRepository } from '../../application/ports/repositories/IContactRepository';
import { Contact } from '../../domain/entities/Contact';
import client from '../http/client';

export class ContactRepositoryApi implements IContactRepository {
    async getContacts(userId: string): Promise<Contact[]> {
        const response = await client.get(`/contactos_emergencias/listar/por-cliente/${userId}`);
        return response.data.map(this.mapToContact);
    }

    async getPendingRequests(userId: string): Promise<any[]> {
        const response = await client.get(`/contactos_emergencias/solicitudes/${userId}`);
        return response.data;
    }

    async sendContactRequest(userId: string, criteria: string): Promise<void> {
        await client.post('/contactos_emergencias/solicitar', {
            clienteId: userId,
            criterio: criteria
        });
    }

    async respondToRequest(requestId: number, response: 'ACEPTAR' | 'RECHAZAR'): Promise<void> {
        await client.patch('/contactos_emergencias/responder', {
            id: requestId,
            respuesta: response
        });
    }

    async addContact(contact: Contact, userId: string): Promise<Contact> {
        // Assuming add uses similar endpoint structure, or maybe it invites via email/phone?
        // EmergencyContacts usually involves inviting someone. Use existing /crear if appropriate or check logic.
        // For now using the previous /contactos/crear as placeholder or if it's the same system.
        // If it's emergency contacts, often they are linked users.
        const response = await client.post('/contactos_emergencias/crear', {
            clienteId: userId,
            nombre: contact.name,
            telefono: contact.phone,
            descripcion: contact.relationship, // Backend maps 'relacion' or 'descripcion', usually description is safer for broader use
            estado: 'activo' // Default status
        });
        return this.mapToContact(response.data);
    }

    async updateContact(contact: Contact): Promise<void> {
        await client.put(`/contactos_emergencias/actualizar/${contact.id}`, {
            nombre: contact.name,
            telefono: contact.phone,
            relacion: contact.relationship,
            es_emergencia: contact.isEmergency
        });
    }

    async deleteContact(contactId: string): Promise<void> {
        await client.delete(`/contactos_emergencias/eliminar/${contactId}`);
    }

    async getContactDetails(contactId: string): Promise<Contact> {
        const response = await client.get(`/contactos_emergencias/${contactId}`);
        return this.mapToContact(response.data);
    }

    private mapToContact(data: any): Contact {
        return {
            id: data.id?.toString() || data._id,
            name: data.nombre,
            phone: data.telefono,
            relationship: data.descripcion || data.relacion || 'Sin relación',
            isEmergency: data.es_emergencia || true, // Default true for emergency contacts context?
            image: data.imagen || undefined,
            // @ts-ignore
            status: data.estado // For badge
        };
    }
}

