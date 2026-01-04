import AsyncStorage from '@react-native-async-storage/async-storage';
import { IPreferencesService } from '../../application/ports/services/IPreferencesService';

const KEYS = {
    AUTO_LOGIN_ENABLED: 'autoLoginEnabled',
    CLIENT_ID: 'clienteId',
};

/**
 * Implementation of IPreferencesService using AsyncStorage
 */
/**
 * CAPA DE INFRAESTRUCTURA: Servicio
 * 
 * RESPONSABILIDAD:
 * Implementación concreta del almacenamiento de preferencias.
 * Utiliza `AsyncStorage` para persistir datos localmente.
 */
export class PreferencesService implements IPreferencesService {
    async getAutoLoginEnabled(): Promise<boolean> {
        try {
            const value = await AsyncStorage.getItem(KEYS.AUTO_LOGIN_ENABLED);
            return value === 'true';
        } catch (error) {
            console.error('[PreferencesService] Error obteniendo autoLoginEnabled:', error);
            return true; // Por defecto true
        }
    }

    async setAutoLoginEnabled(value: boolean): Promise<void> {
        try {
            await AsyncStorage.setItem(KEYS.AUTO_LOGIN_ENABLED, value.toString());
        } catch (error) {
            console.error('[PreferencesService] Error guardando autoLoginEnabled:', error);
            throw error;
        }
    }

    async getClientId(): Promise<string | null> {
        try {
            return await AsyncStorage.getItem(KEYS.CLIENT_ID);
        } catch (error) {
            console.error('[PreferencesService] Error obteniendo clientId:', error);
            return null;
        }
    }

    async setClientId(clientId: string): Promise<void> {
        try {
            await AsyncStorage.setItem(KEYS.CLIENT_ID, clientId);
        } catch (error) {
            console.error('[PreferencesService] Error guardando clientId:', error);
            throw error;
        }
    }

    async clearAll(): Promise<void> {
        try {
            await AsyncStorage.multiRemove([KEYS.AUTO_LOGIN_ENABLED, KEYS.CLIENT_ID]);
        } catch (error) {
            console.error('[PreferencesService] Error limpiando preferencias:', error);
            throw error;
        }
    }
}
