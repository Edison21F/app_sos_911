import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Vibration } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Phone, Navigation, CheckCircle } from 'lucide-react-native';
import socketService from '../../infrastructure/services/SocketService';
import { normalize } from '../../utils/dimensions';

const EmergencyAlertScreen = ({ route, navigation }: any) => {
    const { alertId, senderName, type } = route.params; // Parámetros recibidos de la notifiación
    const [senderLocation, setSenderLocation] = useState<any>(null);
    const [status, setStatus] = useState('CREADA');

    // Efecto inicial al recibir la alerta
    useEffect(() => {
        Vibration.vibrate([1000, 1000, 1000]); // Vibración intensa para llamar la atención

        // Conectar al socket y suscribirse a la alerta
        socketService.connect();
        socketService.subscribeToAlert(alertId, (data: any) => {
            if (data.location) {
                setSenderLocation(data.location);
            }
            if (data.estado) {
                setStatus(data.estado);
                if (data.estado === 'CERRADA' || data.estado === 'CANCELADA') {
                    Alert.alert('Alerta Finalizada', 'La emergencia ha sido cerrada.');
                    navigation.goBack();
                }
            }
        });

        return () => {
            // Limpiar suscripción si fuera necesario
        };
    }, [alertId]);

    const handleImOnIt = () => {
        // Comunicar que estoy atendiendo
        // api.patch(...)
        Alert.alert('Respondido', 'Se ha notificado al usuario que estás en camino.');
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.alertTitle}>¡ALERTA DE EMERGENCIA!</Text>
                <Text style={styles.senderText}>{senderName} necesita ayuda</Text>
                <Text style={styles.typeText}>{type || 'Emergencia'}</Text>
            </View>

            <View style={styles.mapContainer}>
                {senderLocation ? (
                    <MapView
                        style={styles.map}
                        initialRegion={{
                            latitude: senderLocation.latitude,
                            longitude: senderLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                        region={{
                            latitude: senderLocation.latitude,
                            longitude: senderLocation.longitude,
                            latitudeDelta: 0.01,
                            longitudeDelta: 0.01,
                        }}
                    >
                        <Marker
                            coordinate={senderLocation}
                            title={senderName}
                            description="Ubicación actual"
                        />
                    </MapView>
                ) : (
                    <View style={styles.loadingContainer}>
                        <Text style={styles.loadingText}>Esperando ubicación...</Text>
                    </View>
                )}
            </View>

            <View style={styles.controls}>
                <TouchableOpacity style={styles.actionButton} onPress={() => {/* Llamar */ }}>
                    <Phone color="#FFF" />
                    <Text style={styles.actionText}>Llamar</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.actionButton, styles.mainAction]} onPress={handleImOnIt}>
                    <CheckCircle color="#FFF" />
                    <Text style={styles.actionText}>Voy en camino</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.actionButton} onPress={() => {/* Navegar */ }}>
                    <Navigation color="#FFF" />
                    <Text style={styles.actionText}>Ir</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    header: { padding: 20, paddingTop: 50, backgroundColor: '#C0392B', alignItems: 'center' },
    alertTitle: { color: '#FFF', fontSize: 22, fontWeight: 'bold' },
    senderText: { color: '#FFF', fontSize: 18, marginTop: 5 },
    typeText: { color: '#FFF', fontSize: 14, fontWeight: 'bold', marginTop: 5, backgroundColor: 'rgba(0,0,0,0.2)', padding: 5, borderRadius: 5 },

    mapContainer: { flex: 1, backgroundColor: '#222' },
    map: { width: '100%', height: '100%' },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { color: '#AAA' },

    controls: { flexDirection: 'row', justifyContent: 'space-around', padding: 20, backgroundColor: '#111' },
    actionButton: { alignItems: 'center', padding: 10 },
    mainAction: { backgroundColor: '#27AE60', borderRadius: 10, paddingHorizontal: 20 },
    actionText: { color: '#FFF', marginTop: 5 }
});

export default EmergencyAlertScreen;
