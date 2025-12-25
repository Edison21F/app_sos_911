import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration, Animated } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Phone, ShieldCheck } from 'lucide-react-native';
import { useActiveEmergencyViewModel } from '../../hooks/useActiveEmergencyViewModel';

const ActiveEmergencyScreen = ({ route, navigation }: any) => {
    const { type } = route.params; // Expecting { id: string, label: string, color: string, priority: string }

    const { status, countdown, location, cancelEmergency } = useActiveEmergencyViewModel(type.id);

    const pulseAnim = useRef(new Animated.Value(1)).current;

    // Pulse Animation
    useEffect(() => {
        if (status === 'active') {
            Vibration.vibrate([500, 500, 500]); // Vibrate on start
            Animated.loop(
                Animated.sequence([
                    Animated.timing(pulseAnim, { toValue: 1.2, duration: 500, useNativeDriver: true }),
                    Animated.timing(pulseAnim, { toValue: 1, duration: 500, useNativeDriver: true })
                ])
            ).start();
        } else {
            pulseAnim.setValue(1);
        }
    }, [status]);

    const handleCancel = () => {
        Alert.alert(
            'Cancelar Emergencia',
            '¿Estás seguro? Se notificará que estás a salvo.',
            [
                { text: 'No', style: 'cancel' },
                {
                    text: 'Sí, estoy a salvo',
                    onPress: async () => {
                        await cancelEmergency();
                        navigation.navigate('Home');
                    }
                }
            ]
        );
    };

    if (status === 'preparing') {
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
                <TouchableOpacity style={styles.safeButton} onPress={handleCancel}>
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
