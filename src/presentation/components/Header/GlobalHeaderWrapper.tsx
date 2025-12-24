import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import api from '../../api/api';
import ModernHeader from './ModernHeader';

const GlobalHeaderWrapper = (props: any) => {
    const navigation = useNavigation<any>();
    const [userName, setUserName] = useState("Usuario");
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [notificationCount, setNotificationCount] = useState(0);

    const fetchData = async () => {
        try {
            // Fetch User Name
            const storedName = await AsyncStorage.getItem('nombreUsuario');
            if (storedName) setUserName(storedName.split(' ')[0]);

            // Fetch Profile for updated Image/Name
            const storedClienteId = await AsyncStorage.getItem('clienteId');
            if (storedClienteId) {
                const response = await api.get(`/clientes/detalle/${storedClienteId}`);
                if (response.data) {
                    if (response.data.nombre) setUserName(response.data.nombre.split(' ')[0]);
                    if (response.data.foto_perfil) {
                        const API_BASE_URL = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : '';
                        setProfileImage(`${API_BASE_URL}/uploads/profiles/${response.data.foto_perfil}`);
                    }
                }
                // Mock notification count or fetch
                setNotificationCount(2);
            }
        } catch (e) { console.log('Error fetching header data', e); }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData();
        }, [])
    );

    const handleLogout = () => {
        // Implement logic or navigate to a logout handler? 
        // Best to copy the alert logic here or import it if it was a utility.
        // For now, access the logic via simple navigation reset if confirmed, but we need the Alert.
        // Let's copy the Alert logic from Home or similar.
        const { Alert } = require('react-native');
        Alert.alert(
            "Cerrar Sesión",
            "¿Estás seguro que deseas salir?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Salir",
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.multiRemove(['token', 'clienteId', 'idUsuarioSql', 'autoLoginEnabled']);
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Login' }],
                            });
                        } catch (e) {
                            console.error("Error logging out", e);
                        }
                    }
                }
            ]
        );
    };

    return (
        <ModernHeader
            userName={userName}
            notificationCount={notificationCount}
            onLogout={handleLogout}
            onNotificationPress={() => navigation.navigate('Notifications')}
            onProfilePress={() => navigation.navigate('Profile')}
            profileImage={profileImage}
            showBackButton={props.showBackButton}
            onBackPress={() => navigation.goBack()}
        />
    );
};

export default GlobalHeaderWrapper;
