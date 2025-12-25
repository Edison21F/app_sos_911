import { useState, useEffect, useCallback } from 'react';
import { container } from '../../infrastructure/di/container';

export const useNearbyAlertsViewModel = () => {
    const [alerts, setAlerts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [myLocation, setMyLocation] = useState<{ lat: number, lng: number } | null>(null);

    const { getNearbyAlertsUseCase, getCurrentLocationUseCase } = container;

    const fetchNearbyAlerts = useCallback(async () => {
        setIsLoading(true);
        try {
            const location = await getCurrentLocationUseCase.execute();
            if (location) {
                setMyLocation({ lat: location.latitude, lng: location.longitude });
                const data = await getNearbyAlertsUseCase.execute(location.latitude, location.longitude);
                setAlerts(data);
            }
        } catch (error) {
            console.error('Error fetching nearby alerts:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        alerts,
        isLoading,
        myLocation,
        fetchNearbyAlerts
    };
};
