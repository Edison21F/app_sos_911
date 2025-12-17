import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../api/api';
import NetInfo from '@react-native-community/netinfo';
import { Alert } from 'react-native';

const OFFLINE_QUEUE_KEY = 'offline_alerts_queue';

export interface AlertData {
    id_local: string; // UUID generado en cliente
    tipo: string;
    prioridad: string;
    ubicacion: { latitud: number; longitud: number };
    detalles?: string;
    fecha_creacion: number;
}

class OfflineAlertService {

    // Guardar alerta en cola local
    async queueAlert(alertData: AlertData) {
        try {
            const currentQueue = await this.getQueue();
            currentQueue.push(alertData);
            await AsyncStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(currentQueue));
            console.log(`[OfflineService] Alerta guardada localmente. Total en cola: ${currentQueue.length}`);
            Alert.alert('Modo Offline', 'Alerta guardada. Se enviará automáticamente cuando recuperes conexión.');
        } catch (error) {
            console.error('Error queueing alert', error);
        }
    }

    // Obtener cola actual
    async getQueue(): Promise<AlertData[]> {
        try {
            const json = await AsyncStorage.getItem(OFFLINE_QUEUE_KEY);
            return json ? JSON.parse(json) : [];
        } catch (error) {
            return [];
        }
    }

    // Limpiar cola
    async clearQueue() {
        await AsyncStorage.removeItem(OFFLINE_QUEUE_KEY);
    }

    // Intentar sincronizar (Llamar cuando NetInfo detecte conexión)
    async syncPendingAlerts() {
        const state = await NetInfo.fetch();
        if (!state.isConnected) return;

        const queue = await this.getQueue();
        if (queue.length === 0) return;

        console.log(`[OfflineService] Sincronizando ${queue.length} alertas...`);

        try {
            // Usar el nuevo endpoint de batch sync
            const response = await api.post('/alertas/sync-offline', { alertas: queue });

            if (response.data.success) {
                console.log('[OfflineService] Sincronización exitosa.');
                await this.clearQueue();

                // Opcional: Notificar al usuario que sus alertas se enviaron
                /*
                Alert.alert('Sincronización Completa', 'Tus alertas pendientes han sido enviadas.');
                */
            }
        } catch (error) {
            console.error('[OfflineService] Error en sincronización:', error);
            // No borramos la cola si falla, reintentará luego
        }
    }
}

export default new OfflineAlertService();
