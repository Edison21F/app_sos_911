import api from '../api/api';
import OfflineAlertService, { AlertData } from './offlineAlert.service';
import DeviceBehaviorService from './deviceBehavior.service';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { v4 as uuidv4 } from 'uuid'; // Removed to avoid extra dependency issues

// Generador simple de UUID para no depender de libreria externa si no está instalada
const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

export const ALERTA_TYPES = {
    MEDICAL: 'MEDICA',
    DANGER: 'PELIGRO',
    FIRE: 'INCENDIO',
    TRAFFIC: 'TRANSITO',
    PREVENTIVE: 'PREVENTIVA'
};

export const ALERTA_PRIORITIES = {
    CRITICA: 'CRITICA',
    ALTA: 'ALTA',
    MEDIA: 'MEDIA',
    BAJA: 'BAJA',
    INFO: 'INFORMÁTIVA'
};

class AlertService {

    // Crear Alerta (Punto de entrada principal)
    async createEmergencyAlert(type: string, priority: string, location: { latitud: number, longitud: number }, detalles?: string) {

        // 1. Activar comportamiento del dispositivo inmediatamente
        /// Mapear tipo de alerta interna a tipo de comportamiento
        let behaviorType: 'MEDICAL' | 'DANGER' | 'FIRE' | 'TRAFFIC' | 'PREVENTIVE' = 'DANGER';

        // Mapeo simple: ajusta según tus ENUMS
        if (type === ALERTA_TYPES.MEDICAL) behaviorType = 'MEDICAL';
        if (type === ALERTA_TYPES.FIRE) behaviorType = 'FIRE';
        if (type === ALERTA_TYPES.TRAFFIC) behaviorType = 'TRAFFIC';
        if (type === ALERTA_TYPES.PREVENTIVE) behaviorType = 'PREVENTIVE';

        DeviceBehaviorService.triggerBehavior(behaviorType);

        // 2. Preparar payload
        const clienteId = await AsyncStorage.getItem('clienteId'); // Asumiendo que guardaste esto en Login
        if (!clienteId) throw new Error('Usuario no identificado');

        const alertPayload = {
            idUsuarioSql: clienteId,
            tipo: type,
            prioridad: priority,
            ubicacion: location,
            detalles: detalles || '',
            fecha_creacion: Date.now(),
            emitida_offline: false,
            id_local: generateId()
        };

        // 3. Verificar conexión
        const netState = await NetInfo.fetch();

        if (!netState.isConnected) {
            // OFFLINE: Guardar localmente
            alertPayload.emitida_offline = true;
            await OfflineAlertService.queueAlert(alertPayload);
            return { success: true, offline: true, data: alertPayload };
        } else {
            // ONLINE: Enviar a API
            try {
                const response = await api.post('/alertas', alertPayload);
                return { success: true, offline: false, data: response.data.data };
            } catch (error) {
                console.error('Error sending alert online, fallback to offline', error);
                // Si falla el POST (por ej timeout), hacemos fallback a offline
                alertPayload.emitida_offline = true;
                await OfflineAlertService.queueAlert(alertPayload);
                return { success: true, offline: true, fallback: true, data: alertPayload };
            }
        }
    }

    // Cancelar/Resolver Alerta (Detiene comportamientos)
    async stopEmergency() {
        DeviceBehaviorService.stopBehaviors();
        // Aquí podrías llamar al endpoint de updateStatus a 'CERRADA' si tienes el ID de la alerta activa
    }
}

export default new AlertService();
