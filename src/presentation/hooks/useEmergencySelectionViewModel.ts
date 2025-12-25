import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import { container } from '../../infrastructure/di/container';
import { Alert as AlertEntity, AlertLocation } from '../../domain/entities/Alert';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/Navigator';

export const useEmergencySelectionViewModel = () => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [loading, setLoading] = useState(false);
    const [location, setLocation] = useState<AlertLocation | null>(null);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permiso denegado', 'Se necesita ubicación para emergencias.');
                return;
            }

            let loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude
            });
        })();
    }, []);

    const startEmergency = async (type: AlertEntity['type'], priority: string) => {
        if (!location) {
            Alert.alert('Esperando ubicación...', 'Por favor espera a que obtengamos tu ubicación.');
            return;
        }

        setLoading(true);
        try {
            // Note: priority passed for analytics/metadata, but UC signature might need update if we want to save it
            // For now, UseCase only takes type, location, groupId
            const result = await container.sendAlertUseCase.execute(type, location);

            setLoading(false);

            navigation.navigate('ActiveEmergency', {
                type: type,
                alertData: result,
                isOffline: !!result.isOffline
            });

        } catch (error) {
            setLoading(false);
            console.error(error);
            Alert.alert('Error', 'No se pudo activar la alerta');
        }
    };

    return {
        loading,
        location,
        startEmergency
    };
};
