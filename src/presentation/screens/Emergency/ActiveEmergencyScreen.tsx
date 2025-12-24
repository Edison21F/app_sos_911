import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { Lock, Navigation, Phone, ShieldCheck } from 'lucide-react-native';
import socketService from '../../services/socket.service';
import locationService from '../../services/location.service';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { normalize } from '../../utils/dimensions';

const ActiveEmergencyScreen = ({ route, navigation }: any) => {
    const { type } = route.params;
    const [countdown, setCountdown] = useState(3);
    const [isActive, setIsActive] = useState(false);
    const [location, setLocation] = useState<any>(null);
    const [alertData, setAlertData] = useState<any>(null);
    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Countdown Logic
    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else if (countdown === 0 && !isActive) {
            startEmergency();
        }
    }, [countdown, isActive]);

    // Pulse Animation
    useEffect(() => {
        if (isActive) {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
                ])
            ).start();
        }
    }, [isActive]);

    const startEmergency = async () => {
        setIsActive(true);
        Vibration.vibrate([500, 500, 500]); // Vibración fuerte

        try {
            // 1. Obtener ubicación
            const loc = await locationService.getCurrentLocation();
            setLocation(loc);

            // 2. Crear Alerta en Backend
            const storedId = await AsyncStorage.getItem('clienteId');
            const userId = storedId || 'GUEST';

            console.log('Iniciando alerta para UserID:', userId);

            const response = await api.post('/alertas', {
                idUsuarioSql: userId, // ID real
                tipo: type.id,
                prioridad: type.priority,
                ubicacion: {
                    latitud: loc.latitude,
                    longitud: loc.longitude
                },
                detalles: `Emergencia iniciada: ${type.label}`
            });

            const newAlert = response.data.data;
            setAlertData(newAlert);

            // 3. Conectar al Socket y emitir
            socketService.connect(userId);
            socketService.emitLocation(newAlert._id, { latitude: loc.latitude, longitude: loc.longitude });

            // 4. Iniciar tracking constante
            locationService.watchLocation((newLoc) => {
                setLocation(newLoc);
                socketService.emitLocation(newAlert._id, { latitude: newLoc.latitude, longitude: newLoc.longitude });
            });

        } catch (error) {
            console.error('Error creando alerta:', error);
            Alert.alert('Error', 'No se pudo activar la alerta en el servidor. Intentando modo local.');
        }
    };

    const cancelEmergency = () => {
        Alert.alert(
            'Cancelar Emergencia',
            '¿Estás seguro? Se notificará que estás a salvo.',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, estoy a salvo',
                    onPress: async () => {
                        // Notificar cierre
                        if (alertData?._id) {
                            await api.patch(`/alertas/${alertData._id}/estado`, { estado: 'CERRADA' });
                        }
                        navigation.navigate('Home');
                    }
                }
            ]
        );
    };

    if (countdown > 0) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.countdownText}>{countdown}</Text>
                <Text style={styles.preparingText}>Activando {type.label}...</Text>
                <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                    <Text style={styles.cancelText}>Cancelar ahora</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header Crítico */}
            <View style={[styles.header, { backgroundColor: type.color }]}>
                <Text style={styles.alertTitle}>{type.label.toUpperCase()}</Text>
                <Text style={styles.statusText}>EN PROGRESO - COMPARTIENDO UBICACIÓN</Text>
            </View>

            {/* Mapa */}
            <View style={styles.mapContainer}>
                {location ? (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005,
                        }}
                    >
                        <Marker coordinate={location} title="Tu ubicación">
                            <Animated.View style={[styles.markerRing, { transform: [{ scale: pulseAnim }] }]} />
                        </Marker>
                    </MapView>
                ) : (
                    <Text style={styles.loadingText}>Obteniendo ubicación...</Text>
                )}
            </View>

            {/* Controles de Acción */}
            <View style={styles.controls}>
                <TouchableOpacity style={styles.actionButton}>
                    <Phone color="#FFF" />
                    <Text style={styles.actionText}>Llamar 911</Text>
                </TouchableOpacity>

                {/* Botón "Estoy a salvo" gigante */}
                <TouchableOpacity style={styles.safeButton} onPress={cancelEmergency}>
                    <ShieldCheck size={32} color="#FFF" />
                    <Text style={styles.safeButtonText}>ESTOY A SALVO</Text>
                    <Text style={styles.safeSubText}>Presiona para finalizar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centered: { justifyContent: 'center', alignItems: 'center' },
    countdownText: { fontSize: 100, color: '#FFF', fontWeight: 'bold' },
    preparingText: { color: '#AAA', fontSize: 18, marginBottom: 50 },

    header: { padding: 20, paddingTop: 50, alignItems: 'center' },
    alertTitle: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
    statusText: { color: '#FFF', fontSize: 12, marginTop: 5 },

    mapContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
    map: { width: '100%', height: '100%' },

    markerRing: { width: 30, height: 30, borderRadius: 15, backgroundColor: 'rgba(255, 0, 0, 0.5)', borderWidth: 2, borderColor: 'red' },

    controls: { padding: 20, backgroundColor: '#111' },
    loadingText: { color: '#FFF' },

    cancelButton: { backgroundColor: '#333', padding: 15, borderRadius: 10, width: '80%', alignItems: 'center' },
    cancelText: { color: '#FFF' },

    safeButton: { backgroundColor: '#27AE60', padding: 20, borderRadius: 15, alignItems: 'center', marginVertical: 10 },
    safeButtonText: { color: '#FFF', fontSize: 20, fontWeight: 'bold' },
    safeSubText: { color: '#EEE', fontSize: 12 },

    actionButton: { flexDirection: 'row', backgroundColor: '#333', padding: 15, borderRadius: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    actionText: { color: '#FFF', marginLeft: 10, fontWeight: 'bold' }
});

export default ActiveEmergencyScreen;
