import { useState } from 'react';
import { container } from '../../infrastructure/di/container';
import { Alert, AlertLocation } from '../../domain/entities/Alert';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigator';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useActiveEmergencyViewModel = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [currentAlert, setCurrentAlert] = useState<Alert | null>(null);

    const startEmergency = async (type: Alert['type'], location: AlertLocation) => {
        try {
            const alert = await container.sendAlertUseCase.execute(type, location);
            setCurrentAlert(alert);
            return alert;
        } catch (error) {
            console.error('Failed to start emergency', error);
            return null;
        }
    };

    const cancelEmergency = async (id?: string) => {
        const targetId = id || currentAlert?.id;
        // Always stop behaviors first
        await container.stopEmergencyUseCase.execute(targetId || '');

        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }],
        });
    };

    const getMedicalData = async () => {
        try {
            const id = await AsyncStorage.getItem('clienteId');
            if (id) {
                const client = await container.getClientProfileUseCase.execute(id);
                if (client && client.medicalRecord) {
                    return client.medicalRecord;
                }
            }
            return null;
        } catch (error) {
            console.error(error);
            return null;
        }
    };

    return {
        startEmergency,
        cancelEmergency,
        currentAlert,
        getMedicalData
    };
};
