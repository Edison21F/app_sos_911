/**
 * Información del estado del dispositivo para monitoreo
 */
export interface DeviceStatusInfo {
    batteryLevel: number;
    isConnected: boolean;
    isGpsEnabled: boolean;
}

/**
 * CAPA DE APLICACIÓN: Puerto (Interface)
 * 
 * RESPONSABILIDAD:
 * Definir el contrato para los servicios de monitoreo de dispositivo.
 * Abstrae las APIs de Batería, Red y Ubicación siguiendo Clean Architecture.
 * La implementación real estará en la Capa de Infraestructura.
 */
export interface IDeviceStatusService {
    /**
     * Obtener nivel de batería actual (0-100)
     */
    getBatteryLevel(): Promise<number>;

    /**
     * Suscribirse a cambios en el nivel de batería
     * @returns Función para cancelar la suscripción
     */
    subscribeToBatteryChanges(callback: (level: number) => void): () => void;

    /**
     * Verificar si hay conexión a internet
     */
    isNetworkConnected(): Promise<boolean>;

    /**
     * Suscribirse a cambios de conexión
     * @returns Función para cancelar la suscripción
     */
    subscribeToNetworkChanges(callback: (isConnected: boolean) => void): () => void;

    /**
     * Verificar si los servicios de ubicación (GPS) están activos
     */
    isGpsEnabled(): Promise<boolean>;

    /**
     * Obtener el estado completo del dispositivo
     */
    getDeviceStatus(): Promise<DeviceStatusInfo>;
}
