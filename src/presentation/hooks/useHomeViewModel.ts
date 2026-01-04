import { useState, useCallback } from 'react';
import { container } from '../../infrastructure/di/container';
import { User } from '../../domain/entities/User';

/**
 * CAPA DE PRESENTACIÓN: ViewModel (Hook)
 * 
 * RESPONSABILIDAD:
 * Gestionar el estado de la pantalla Home.
 * Orquesta los casos de uso para:
 * - Obtener y sincronizar datos del usuario
 * - Gestionar preferencias de auto-login
 * - Manejar cierre de sesión
 * 
 * PRINCIPIO CLEAN ARCHITECTURE:
 * Este ViewModel SOLO interactúa con Casos de Uso, nunca directamente
 * con Repositorios o Servicios de Infraestructura.
 */
export const useHomeViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [autoLoginEnabled, setAutoLoginEnabled] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    /**
     * Inicializa la pantalla Home obteniendo datos del usuario.
     * Usa exclusivamente Casos de Uso para todas las operaciones.
     */
    const initHome = useCallback(async () => {
        try {
            // Obtener preferencia de Auto-Login via Caso de Uso
            const setting = await container.getAutoLoginSettingUseCase.execute();
            setAutoLoginEnabled(setting);

            // Obtener Usuario Actual via Caso de Uso
            const currentUser = await container.getCurrentUserUseCase.execute();
            if (currentUser) {
                setUser(currentUser);

                // Iniciar Sincronización de Ubicación via Caso de Uso
                await container.startLocationSyncUseCase.execute(currentUser.id.toString());

                // Obtener URL de imagen de perfil via Caso de Uso
                if (currentUser.profileImage) {
                    const url = container.getProfileImageUrlUseCase.execute(currentUser.profileImage);
                    setProfileImageUrl(url);
                }
            }
        } catch (error) {
            console.error('[useHomeViewModel] Error initializing Home:', error);
        }
    }, []);

    /**
     * Alterna el estado de auto-login.
     * Usa el caso de uso ToggleAutoLoginSettingUseCase.
     */
    const toggleAutoLogin = async (): Promise<boolean> => {
        try {
            const newValue = await container.toggleAutoLoginSettingUseCase.execute(autoLoginEnabled);
            setAutoLoginEnabled(newValue);
            return newValue;
        } catch (error) {
            console.error('[useHomeViewModel] Error toggling auto login:', error);
            throw error;
        }
    };

    /**
     * Cierra la sesión del usuario.
     * Ejecuta logout y detiene sincronización de ubicación.
     */
    const logout = async (): Promise<void> => {
        try {
            await container.logoutUseCase.execute();
            await container.stopLocationSyncUseCase.execute();
        } catch (error) {
            console.error('[useHomeViewModel] Error during logout:', error);
            throw error;
        }
    };

    return {
        user,
        autoLoginEnabled,
        profileImageUrl,
        initHome,
        toggleAutoLogin,
        logout
    };
};
