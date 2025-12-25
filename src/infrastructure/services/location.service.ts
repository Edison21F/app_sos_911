import * as Location from 'expo-location';
import api from '../http/client';
import { ILocationService, LocationData } from '../../application/ports/services/ILocationService';

export class LocationService implements ILocationService {
    private subscriber: Location.LocationSubscription | null = null;

    async requestPermissions() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permiso de ubicación denegado');
        }
    }

    async getCurrentLocation(): Promise<LocationData> {
        try {
            await this.requestPermissions();
            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            return {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                heading: location.coords.heading,
                speed: location.coords.speed
            };
        } catch (error) {
            console.error('Error obteniendo ubicación:', error);
            throw error;
        }
    }

    async stopLocationSync(): Promise<void> {
        if (this.subscriber) {
            this.subscriber.remove();
            this.subscriber = null;
        }
    }

    async startLocationSync(userId: string): Promise<void> {
        await this.requestPermissions();

        if (this.subscriber) {
            return;
        }

        this.subscriber = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 60000,
                distanceInterval: 100,
            },
            async (newLocation) => {
                try {
                    await api.post('/ubicaciones_clientes/crear', {
                        clienteId: userId,
                        latitud: newLocation.coords.latitude,
                        longitud: newLocation.coords.longitude,
                        estado: 'activo'
                    });
                    console.log('[LocationService] Ubicación sincronizada con backend');
                } catch (error) {
                    console.error('[LocationService] Error enviando ubicación al backend:', error);
                }
            }
        );
    }
}

