import { useState, useCallback } from 'react';
import { container } from '../../infrastructure/di/container';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from '../../domain/entities/Alert';

export const useAlertHistoryViewModel = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchHistory = useCallback(async () => {
        try {
            const clienteId = await AsyncStorage.getItem('clienteId');
            if (clienteId) {
                const data = await container.getAlertHistoryUseCase.execute(clienteId);
                setAlerts(data);
            }
        } catch (error) {
            console.error('Error fetching alert history:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    const refresh = useCallback(() => {
        setRefreshing(true);
        fetchHistory();
    }, [fetchHistory]);

    const finalizeAlert = async (alertId: string) => {
        try {
            await container.updateAlertStatusUseCase.execute(alertId, 'CERRADA', 'Finalizada por el usuario desde historial');
            fetchHistory(); // Refresh list
            return true;
        } catch (error) {
            console.error('Error finalizando alerta', error);
            return false;
        }
    };

    return {
        alerts,
        loading,
        refreshing,
        fetchHistory,
        refresh,
        finalizeAlert
    };
};
