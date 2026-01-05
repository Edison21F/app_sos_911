import { IAlertRepository } from '../../application/ports/repositories/IAlertRepository';
import { Alert, AlertLocation } from '../../domain/entities/Alert';
import client from '../http/client';

import { OfflineAlertService } from '../services/offlineAlert.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

export class AlertRepositoryApi implements IAlertRepository {
    private offlineService = new OfflineAlertService();

    async sendAlert(type: Alert['type'], location: AlertLocation, groupId?: string): Promise<Alert> {
        const payload = {
            tipo: type,
            ubicacion: {
                latitud: location.latitude,
                longitud: location.longitude,
                direccion: location.address
            },
            grupo_id: groupId,
            // Add metadata for offline
            idUsuarioSql: await AsyncStorage.getItem('clienteId'),
            prioridad: 'ALTA', // Default, should ideally be passed or inferred
            fecha_creacion: Date.now(),
            emitida_offline: false,
            id_local: Math.random().toString(36).substring(7)
        };

        // Check network connectivity
        const netInfo = await NetInfo.fetch();
        const isConnected = netInfo.isConnected;

        try {
            // Validate payload minimal requires before sending?
            if (!payload.idUsuarioSql) throw new Error('Usuario no identificado');

            if (!isConnected) {
                throw new Error('No internet connection');
            }

            const response = await client.post('/alertas', payload);
            return this.mapToAlert(response.data.data || response.data.alerta || response.data);
        } catch (error) {
            console.log('Sending alert failed:', (error as Error).message);
            if (!isConnected) {
                console.log('No connection, queuing offline...');
                payload.emitida_offline = true;
                // Adapting payload to AlertData interface for OfflineService
                await this.offlineService.queueAlert(payload as any);

                // Return a temporary local Alert object so UI updates immediately
                return {
                    id: payload.id_local,
                    type: type,
                    title: `Alerta ${type} (Offline)`,
                    location: location,
                    status: 'CREADA',
                    time: new Date(),
                    senderId: payload.idUsuarioSql || 'unknown',
                    isOffline: true // Add this property to Entity if needed, or infer from status
                };
            } else {
                // Connected but API failed, rethrow error
                throw error;
            }
        }
    }

    async getActiveAlerts(): Promise<Alert[]> {
        const response = await client.get('/alertas/activas');
        return response.data.map((d: any) => this.mapToAlert(d));
    }

    async getAlertHistory(userId?: string): Promise<Alert[]> {
        const url = userId ? `/alertas/historial/${userId}` : '/alertas/historial';
        const response = await client.get(url);
        // Handle response wrapper { success: true, data: [...] } if present
        const data = response.data.data || response.data;
        return Array.isArray(data) ? data.map((d: any) => this.mapToAlert(d)) : [];
    }

    async getNotifications(userId: string): Promise<any[]> {
        const response = await client.get(`/alertas/notificaciones/${userId}`);
        if (response.data.success) {
            return response.data.data;
        }
        return [];
    }

    async getNearbyAlerts(lat: number, lng: number, radius: number): Promise<any[]> {
        const response = await client.get('/alertas/cercanas', {
            params: { lat, lng, radio: radius }
        });
        return response.data.data;
    }

    async cancelAlert(alertId: string): Promise<void> {
        // If alertId looks like a local id (contains letters), skip API call
        if (alertId && /^[a-zA-Z]/.test(alertId)) {
            console.log('Skipping cancel for local alert id:', alertId);
            return;
        }
        await client.post(`/alertas/cancelar/${alertId}`);
    }

    async updateLocation(alertId: string, location: AlertLocation): Promise<void> {
        await client.put(`/alertas/${alertId}/ubicacion`, {
            latitud: location.latitude,
            longitud: location.longitude,
            direccion: location.address
        });
    }

    async updateAlertStatus(alertId: string, status: string, comment?: string): Promise<void> {
        await client.post(`/alertas/${alertId}/estado`, {
            estado: status,
            comentario: comment
        });
    }

    private mapToAlert(data: any): Alert {
        // Basic mapping, adjust fields as necessary based on API response
        return {
            id: data.id || data._id, // Map _id from history to id
            title: data.titulo || `Alerta ${data.tipo}`, // Fallback title
            type: data.tipo,
            location: {
                latitude: data.ubicacion?.latitud || data.latitud,
                longitude: data.ubicacion?.longitud || data.longitud,
                address: data.ubicacion?.direccion || data.direccion
            },
            status: data.estado,
            time: new Date(data.fecha_creacion || data.createdAt),
            senderId: data.usuario_id || data.idUsuarioSql
        };
    }
}
