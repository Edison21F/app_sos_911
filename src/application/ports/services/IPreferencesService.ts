/**
 * CAPA DE APLICACIÓN: Puerto (Interface)
 * 
 * RESPONSABILIDAD:
 * Definir el contrato para el almacenamiento de preferencias del usuario.
 * Abstrae el acceso a AsyncStorage siguiendo Clean Architecture.
 */
export interface IPreferencesService {
    /**
     * Obtener preferencia de auto-login
     */
    getAutoLoginEnabled(): Promise<boolean>;

    /**
     * Establecer preferencia de auto-login
     */
    setAutoLoginEnabled(value: boolean): Promise<void>;

    /**
     * Obtener ID de cliente almacenado
     */
    getClientId(): Promise<string | null>;

    /**
     * Guardar ID de cliente
     */
    setClientId(clientId: string): Promise<void>;

    /**
     * Limpiar todas las preferencias (logout)
     */
    clearAll(): Promise<void>;
}
