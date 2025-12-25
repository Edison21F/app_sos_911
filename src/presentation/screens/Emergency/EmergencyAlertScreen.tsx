import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Image, Vibration } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import { Phone, Navigation, CheckCircle } from 'lucide-react-native';
// import { normalize } from '../../utils/dimensions'; // Assuming normalize is not used or import from correct path if exists.
// Checking file usage: normalize is used? No, I see imports but is it used? 
// In my previous read of EmergencyAlertScreen I saw `normalize` imported but NOT used in styles. 
// I will remove it to be safe.
import { useEmergencyAlertViewModel } from '../../hooks/useEmergencyAlertViewModel';

const EmergencyAlertScreen = ({ route, navigation }: any) => {
    const { alertId, senderName, type } = route.params;
    const { senderLocation, status, notifyImOnIt } = useEmergencyAlertViewModel(alertId);

    const handleImOnIt = () => {
        notifyImOnIt();
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
