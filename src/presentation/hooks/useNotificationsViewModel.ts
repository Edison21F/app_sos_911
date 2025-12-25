import { useState, useCallback } from 'react';
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

            const data = await container.getNotificationsUseCase.execute(clienteId);

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
