import { useState } from 'react';
import { AlertRepositoryApi } from '../../../infrastructure/repositories/AlertRepositoryApi';
import { SendAlertUseCase } from '../../../application/use-cases/alerts/SendAlertUseCase';
import { Alert, AlertLocation } from '../../../domain/entities/Alert';

// Composition Root
const alertRepository = new AlertRepositoryApi();
const sendAlertUseCase = new SendAlertUseCase(alertRepository);

export const useAlertViewModel = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const sendAlert = async (type: Alert['type'], location: AlertLocation, groupId?: string) => {
        setIsLoading(true);
        setError(null);
        try {
            await sendAlertUseCase.execute(type, location, groupId);
        } catch (e: any) {
            setError(e.message || 'Error sending alert');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        sendAlert,
        isLoading,
        error
    };
};
