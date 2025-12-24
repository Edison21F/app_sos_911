import { IAlertRepository } from '../../application/ports/repositories/IAlertRepository';
import { Alert, AlertLocation } from '../../domain/entities/Alert';
import client from '../http/client';

export class AlertRepositoryApi implements IAlertRepository {
    async sendAlert(type: Alert['type'], location: AlertLocation, groupId?: string): Promise<void> {
        const payload = {
            tipo: type,
            ubicacion: {
                latitud: location.latitude,
                longitud: location.longitude,
                direccion: location.address
            },
            grupo_id: groupId
        };

        await client.post('/alertas/enviar', payload);
    }

    async getActiveAlerts(): Promise<Alert[]> {
        const response = await client.get('/alertas/activas');
        return response.data.map(this.mapToAlert);
    }

    async getAlertHistory(): Promise<Alert[]> {
        const response = await client.get('/alertas/historial');
        return response.data.map(this.mapToAlert);
    }

    async cancelAlert(alertId: string): Promise<void> {
        await client.post(`/alertas/cancelar/${alertId}`);
    }

    private mapToAlert(data: any): Alert {
        // Basic mapping, adjust fields as necessary based on API response
        return {
            id: data.id,
            title: data.titulo || `Alerta ${data.tipo}`, // Fallback title
            type: data.tipo,
            location: {
                latitude: data.ubicacion?.latitud,
                longitude: data.ubicacion?.longitud,
                address: data.ubicacion?.direccion
            },
            status: data.estado,
            time: new Date(data.fecha_creacion),
            senderId: data.usuario_id || data.idUsuarioSql
        };
    }
}
