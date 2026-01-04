import { IGroupRepository } from '../../application/ports/repositories/IGroupRepository';
import { Group } from '../../domain/entities/Group';
import client from '../http/client';

export class GroupRepositoryApi implements IGroupRepository {
    async getGroups(userId: string): Promise<Group[]> {
        const response = await client.get('/grupos/listar', {
            params: { clienteId: userId }
        });
        return response.data.map(this.mapToGroup);
    }

    async createGroup(groupData: { name: string; description: string; userId: string }): Promise<Group> {
        const response = await client.post('/grupos/crear', {
            nombre: groupData.name,
            descripcion: groupData.description,
            adminId: groupData.userId
        });
        return this.mapToGroup(response.data);
    }

    async joinGroup(code: string, userId: string): Promise<void> {
        await client.post('/grupos/unirse', {
            codigo: code,
            usuarioId: userId
        });
    }

    async leaveGroup(groupId: string, userId: string): Promise<void> {
        await client.post('/grupos/salir', {
            grupoId: groupId,
            usuarioId: userId
        });
    }

    async getGroupDetails(groupId: string): Promise<Group> {
        const response = await client.get(`/grupos/detalle/${groupId}`);
        return this.mapToGroup(response.data);
    }

    async getGroupMembers(groupId: string): Promise<any[]> {
        const response = await client.get(`/grupos/miembros/${groupId}`);
        return response.data;
    }

    async uploadGroupImage(groupId: string, formData: FormData): Promise<void> {
        await client.post(`/grupos/foto/${groupId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    }

    async getGroupMessages(groupId: string): Promise<any[]> {
        const response = await client.get(`/mensajes_grupo/listar/por-grupo/${groupId}`);
        return response.data.map((msg: any) => ({
            id: msg.id,
            text: msg.mensaje,
            sender: msg.cliente_info?.nombre || 'Desconocido',
            senderId: msg.clienteId.toString(),
            timestamp: new Date(msg.fecha_envio),
            isMine: false // Logic handled in ViewModel or checking user ID
        }));
    }

    async sendGroupMessage(groupId: string, userId: string, message: string): Promise<void> {
        await client.post('/mensajes_grupo/crear', {
            grupoId: groupId,
            clienteId: userId,
            mensaje: message,
            tipo_mensaje: 'texto'
        });
    }

    private mapToGroup(data: any): Group {
        return {
            id: data.id?.toString() || data._id,
            name: data.nombre,
            description: data.descripcion,
            image: data.imagen,
            members: Array.isArray(data.miembros) ? data.miembros.map((m: any) => ({
                id: m.id,
                name: m.nombre,
                isAdmin: m.es_admin
            })) : [],
            memberCount: typeof data.miembros === 'number' ? data.miembros : (data.miembros?.length || data.cantidad_miembros || 0),
            code: data.codigo,
            createdAt: new Date(data.fecha_creacion || new Date())
        };
    }
}
