import { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import * as Battery from 'expo-battery';
import NetInfo from '@react-native-community/netinfo';
import * as Location from 'expo-location';
// import AsyncStorage removed
import { Client } from '../../domain/entities/Client';
import { API_URL } from '../../config/constants';

export const useDashboardViewModel = () => {
    const [user, setUser] = useState<Client | null>(null);
    const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
    const [isConnected, setIsConnected] = useState<boolean | null>(null);
    const [isGpsEnabled, setIsGpsEnabled] = useState<boolean | null>(null);

    useEffect(() => {
        // Battery
        const sub = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(Math.round(batteryLevel * 100));
        });
        Battery.getBatteryLevelAsync().then((level) => {
            setBatteryLevel(Math.round(level * 100));
        });

        // Network
        const unsubscribeNet = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected);
        });

        // GPS
        const checkLocation = async () => {
            const providerStatus = await Location.getProviderStatusAsync();
            setIsGpsEnabled(providerStatus.locationServicesEnabled);
        };
        checkLocation();

        // User Data
        const loadUser = async () => {
            try {
                const currentUser = await container.getCurrentUserUseCase.execute();
                if (currentUser) {
                    const client = await container.getClientProfileUseCase.execute(currentUser.id.toString());
                    setUser(client);
                }
            } catch (error) {
                console.error('Error loading user profile:', error);
            }
        };
        loadUser();

        return () => {
            sub.remove();
            unsubscribeNet();
        };
    }, []);

    const getProfileImageUrl = () => {
        if (!user?.profileImage) return null;
        if (user.profileImage.startsWith('http')) return user.profileImage;
        return `${API_URL}/uploads/profiles/${user.profileImage}`;
    };

    return {
        user,
        batteryLevel,
        isConnected,
        isGpsEnabled,
        getProfileImageUrl
    };
};
