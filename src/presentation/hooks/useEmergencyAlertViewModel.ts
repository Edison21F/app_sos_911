import { useState, useEffect } from 'react';
import { Alert, Vibration } from 'react-native';
import { container } from '../../infrastructure/di/container';
import { useNavigation } from '@react-navigation/native';

export const useEmergencyAlertViewModel = (alertId: string) => {
    const navigation = useNavigation<any>();
    const [senderLocation, setSenderLocation] = useState<any>(null);
    const [status, setStatus] = useState('CREADA');

    useEffect(() => {
        Vibration.vibrate([1000, 1000, 1000]); // Vibración intensa

        // Connect and Subscribe
        // Note: Ideally container.liveTrackingService should be used
        // Since we registered it as 'liveTrackingService' with lowerCamelCase in container
        const socketService = container.liveTrackingService;

        socketService.connect();
        socketService.subscribeToAlert(alertId, (data: any) => {
            if (data.location) {
                setSenderLocation(data.location);
            }
            if (data.estado) {
                setStatus(data.estado);
                if (data.estado === 'CERRADA' || data.estado === 'CANCELADA') {
                    Alert.alert('Alerta Finalizada', 'La emergencia ha sido cerrada.');
                    navigation.goBack();
                }
            }
        });

        return () => {
            socketService.unsubscribeFromAlert(alertId);
        };
    }, [alertId, navigation]);

    const notifyImOnIt = () => {
        // Here we would call a UseCase: RespondToAlertUseCase
        // For now simulating the action as per original file
        Alert.alert('Respondido', 'Se ha notificado al usuario que estás en camino.');
    };

    return {
        senderLocation,
        status,
        notifyImOnIt
    };
};
