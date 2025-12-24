import * as Location from 'expo-location';
import api from '../http/client';

class LocationService {

    async requestPermissions() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            throw new Error('Permiso de ubicación denegado');
        }
    }

    async getCurrentLocation() {
        try {
            // Verificar permisos primero
            await this.requestPermissions();

            const location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            return location.coords;
        } catch (error) {
            console.error('Error obteniendo ubicación:', error);
            throw error;
        }
    }

    // Seguir ubicación en tiempo real
    async watchLocation(callback: (location: Location.LocationObjectCoords) => void) {
        await this.requestPermissions();

        const subscriber = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.BestForNavigation,
                timeInterval: 2000, // Actualizar cada 2 segundos
                distanceInterval: 5, // O cada 5 metros
            },
            (newLocation) => {
                callback(newLocation.coords);
            }
        );

        return subscriber; // Retornar para poder hacer .remove()
    }


    // Iniciar sincronización de ubicación con el backend
    async startLocationSync(userId: string) {
        await this.requestPermissions();

        // Configurar seguimiento
        const subscriber = await Location.watchPositionAsync(
            {
                accuracy: Location.Accuracy.High,
                timeInterval: 60000, // Cada 60 segundos para no saturar SQL
                distanceInterval: 100, // Cada 100 metros
            },
            async (newLocation) => {
                try {
                    // Enviar al backend
                    // Esto crea un registro en SQL (historial) y actualiza MongoDB (posición actual)
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

        return subscriber;
    }
}

export default new LocationService();
