import { useState, useCallback, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Notification } from '../screens/Notifications/types'; // Import from types file

export const useNotificationsViewModel = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchNotifications = useCallback(async () => {
        try {
            const clienteId = await AsyncStorage.getItem('clienteId');
            if (!clienteId) return;

            // Add timestamp to prevent caching
            const data = await container.getNotificationsUseCase.execute(clienteId, Date.now());

            const mappedData: Notification[] = data.map((alerta: any) => ({
                id: alerta._id,
                title: `Alerta: ${alerta.tipo || 'GENERAL'}`,
                description: alerta.detalles || 'Sin detalles adicionales',
                time: alerta.fecha_creacion ? format(new Date(alerta.fecha_creacion), "d MMMM, h:mm a", { locale: es }) : 'Reciente',
                type: 'clientes',
                status: 'pending',
                location: {
                    latitude: alerta.ubicacion?.latitud || 0,
                    longitude: alerta.ubicacion?.longitud || 0
                },
                responseComment: ''
            }));

            setNotifications(mappedData);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        try {
            container.liveTrackingService.onNewAlert((newAlert: any) => {
                try {
                    console.log('New notification received:', newAlert);
                    const notification: Notification = {
                        id: newAlert._id || Math.random().toString(),
                        title: `Alerta: ${newAlert.tipo || 'GENERAL'}`,
                        description: newAlert.detalles || 'Sin detalles adicionales',
                        time: newAlert.fecha_creacion ? format(new Date(newAlert.fecha_creacion), "d MMMM, h:mm a", { locale: es }) : 'Reciente',
                        type: 'clientes',
                        status: 'pending',
                        location: {
                            latitude: newAlert.ubicacion?.latitud || 0,
                            longitude: newAlert.ubicacion?.longitud || 0
                        },
                        responseComment: ''
                    };
                    setNotifications(prev => [notification, ...prev]);
                } catch (error) {
                    console.error('Error processing new notification:', error);
                }
            });
        } catch (error) {
            console.error('Error setting up notification listener:', error);
        }

        return () => {
            // Note: socket off might need to be handled differently
        };
    }, []);

    const refresh = useCallback(() => {
        setRefreshing(true);
        fetchNotifications();
    }, [fetchNotifications]);

    return {
        notifications,
        loading,
        refreshing,
        fetchNotifications,
        refresh,
        setNotifications // Exposed for optimistic updates
    };
};
