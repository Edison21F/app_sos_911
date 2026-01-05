import { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { Client } from '../../domain/entities/Client';
import { DashboardStats } from '../../application/ports/repositories/IClientRepository';

/**
 * CAPA DE PRESENTACIÓN: ViewModel (Hook)
 * 
 * RESPONSABILIDAD:
 * Gestionar el estado de la pantalla Dashboard.
 * Conecta la Vista (UI) con la Lógica de Negocio (Casos de Uso).
 * NO realiza lógica de negocio directa, solo delega y formatea datos para la vista.
 */
export const useDashboardViewModel = () => {
    const [user, setUser] = useState<Client | null>(null);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isGpsEnabled, setIsGpsEnabled] = useState<boolean | null>(null);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const deviceService = container.deviceStatusService;

        // Estado inicial del dispositivo
        const loadDeviceStatus = async () => {
            const status = await deviceService.getDeviceStatus();
            setBatteryLevel(status.batteryLevel);
            setIsConnected(status.isConnected);
            setIsGpsEnabled(status.isGpsEnabled);
        };
        loadDeviceStatus();

        // Suscripciones a eventos
        const unsubscribeBattery = deviceService.subscribeToBatteryChanges((level) => {
            setBatteryLevel(level);
        });

        const unsubscribeNetwork = deviceService.subscribeToNetworkChanges((connected) => {
            setIsConnected(connected);
        });

        // Verificación de GPS (Intervalo o chequeo único)
        // El código original lo verificaba una vez. Se mantiene así por ahora.

        // Cargar Usuario y Estadísticas
        const loadUserAndStats = async () => {
            try {
                setLoading(true);
                const currentUser = await container.getCurrentUserUseCase.execute();
                if (currentUser) {
                    // Cargar perfil
                    const client = await container.getClientProfileUseCase.execute(currentUser.id.toString());
                    setUser(client);

                    // Cargar estadísticas
                    try {
                        const dashboardStats = await container.getDashboardStatsUseCase.execute(currentUser.id.toString());
                        setStats(dashboardStats);
                    } catch (statsError) {
                        console.error('Error loading dashboard stats:', statsError);
                        // Datos por defecto si falla la API
                        setStats({
                            alertasActivas: 0,
                            alertasResueltas: 0,
                            contactos: 0,
                            tiempoRespuestaPromedio: 0
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            } finally {
                setLoading(false);
            }
        };
        loadUserAndStats();

        return () => {
            unsubscribeBattery();
            unsubscribeNetwork();
        };
    }, []);

    const getProfileImageUrl = () => {
        if (!user?.profileImage) return null;
        // Usar helper del repositorio via container
        return container.clientRepository.getProfileImageUrl(user.profileImage);
    };

    const refreshStats = async () => {
        if (!user) return;
        try {
            const currentUser = await container.getCurrentUserUseCase.execute();
            if (currentUser) {
                const dashboardStats = await container.getDashboardStatsUseCase.execute(currentUser.id.toString());
                setStats(dashboardStats);

                // Tambien refrescar estado del dispositivo
                const status = await container.deviceStatusService.getDeviceStatus();
                setBatteryLevel(status.batteryLevel);
                setIsConnected(status.isConnected);
                setIsGpsEnabled(status.isGpsEnabled);
            }
        } catch (error) {
            console.error('Error refreshing stats:', error);
        }
    };

    return {
        user,
        batteryLevel,
        isConnected,
        isGpsEnabled,
        stats,
        loading,
        getProfileImageUrl,
        refreshStats
    };
};
