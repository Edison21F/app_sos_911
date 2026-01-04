import * as Battery from 'expo-battery';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import * as Location from 'expo-location';
import { IDeviceStatusService, DeviceStatusInfo } from '../../application/ports/services/IDeviceStatusService';

/**
 * Implementation of IDeviceStatusService using Expo and React Native APIs
 */
/**
 * CAPA DE INFRAESTRUCTURA: Servicio
 * 
 * RESPONSABILIDAD:
 * Implementación concreta del servicio de estado del dispositivo.
 * Utiliza librerías externas (Expo, NetInfo) para interactuar con el hardware.
 */
export class DeviceStatusService implements IDeviceStatusService {
    async getBatteryLevel(): Promise<number> {
        try {
            const level = await Battery.getBatteryLevelAsync();
            return Math.round(level * 100);
        } catch (error) {
            console.error('[DeviceStatusService] Error obteniendo nivel de batería:', error);
            return 0;
        }
    }

    subscribeToBatteryChanges(callback: (level: number) => void): () => void {
        const subscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            callback(Math.round(batteryLevel * 100));
        });

        return () => {
            subscription.remove();
        };
    }

    async isNetworkConnected(): Promise<boolean> {
        try {
            const state = await NetInfo.fetch();
            return state.isConnected ?? false;
        } catch (error) {
            console.error('[DeviceStatusService] Error verificando red:', error);
            return false;
        }
    }

    subscribeToNetworkChanges(callback: (isConnected: boolean) => void): () => void {
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            callback(state.isConnected ?? false);
        });

        return unsubscribe;
    }

    async isGpsEnabled(): Promise<boolean> {
        try {
            const providerStatus = await Location.getProviderStatusAsync();
            return providerStatus.locationServicesEnabled;
        } catch (error) {
            console.error('[DeviceStatusService] Error verificando GPS:', error);
            return false;
        }
    }

    async getDeviceStatus(): Promise<DeviceStatusInfo> {
        const [batteryLevel, isConnected, isGpsEnabled] = await Promise.all([
            this.getBatteryLevel(),
            this.isNetworkConnected(),
            this.isGpsEnabled()
        ]);

        return {
            batteryLevel,
            isConnected,
            isGpsEnabled
        };
    }
}
