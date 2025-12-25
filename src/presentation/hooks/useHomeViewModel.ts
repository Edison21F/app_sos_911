import { useState, useCallback } from 'react';
import { container } from '../../infrastructure/di/container';
import { User } from '../../domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';
import client from '../../infrastructure/http/client'; // Need to construct URL

export const useHomeViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [autoLoginEnabled, setAutoLoginEnabled] = useState(true);
    const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

    const initHome = useCallback(async () => {
        try {
            // AutoLogin Setting
            const setting = await AsyncStorage.getItem('autoLoginEnabled');
            if (setting !== null) setAutoLoginEnabled(setting === 'true');

            // Get Current User (includes profile image now)
            const currentUser = await container.getCurrentUserUseCase.execute();
            if (currentUser) {
                setUser(currentUser);

                // Start Location Sync
                await container.startLocationSyncUseCase.execute(currentUser.id.toString());

                // Construct Profile Image URL
                if (currentUser.profileImage) {
                    // @ts-ignore
                    const API_BASE_URL = client.defaults.baseURL ? client.defaults.baseURL.replace('/api', '') : '';
                    setProfileImageUrl(`${API_BASE_URL}/uploads/profiles/${currentUser.profileImage}`);
                }
            }
        } catch (error) {
            console.error('Error initializing Home:', error);
        }
    }, []);

    const toggleAutoLogin = async () => {
        try {
            const newValue = !autoLoginEnabled;
            setAutoLoginEnabled(newValue);
            await AsyncStorage.setItem('autoLoginEnabled', newValue.toString());
            return newValue;
        } catch (error) {
            console.error('Error toggling auto login:', error);
            throw error;
        }
    };

    const logout = async () => {
        await container.logoutUseCase.execute();
        // Also stop location sync?
        await container.locationService.stopLocationSync();
    };

    return {
        user,
        autoLoginEnabled,
        profileImageUrl,
        initHome,
        toggleAutoLogin,
        logout
    };
};
