import React, { useEffect, useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Animated, Dimensions } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, FontAwesome5 } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import AlertService, { ALERTA_TYPES } from '../../services/alert.service';
import OfflineAlertService from '../../services/offlineAlert.service';
import { theme } from '../../theme/theme'; // Adjust path if needed

const ActiveEmergencyScreen = () => {
    const route = useRoute<any>();
    const navigation = useNavigation<any>();
    const { type, isOffline } = route.params || {};

    const [pulse] = useState(new Animated.Value(1));
    const mapRef = useRef<MapView>(null);
    const [currentRegion, setCurrentRegion] = useState<Region>({
        latitude: -0.180653,
        longitude: -78.467834,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    useEffect(() => {
        // Obtener ubicación inicial
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') return;

            let location = await Location.getCurrentPositionAsync({});
            const region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            };
            setCurrentRegion(region);
            mapRef.current?.animateToRegion(region, 1000);
        })();

        // Animación de pulso continuo
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulse, { toValue: 1.2, duration: 800, useNativeDriver: true }),
                Animated.timing(pulse, { toValue: 1, duration: 800, useNativeDriver: true }),
            ])
        ).start();

        // Sincronizar si está offline (intento en background si volviera la red, o solo dejarlo estar)
        if (isOffline) {
            OfflineAlertService.syncPendingAlerts();
        }

        return () => {
            // Cleanup al salir
        };
    }, []);

    const handleStop = async () => {
        await AlertService.stopEmergency();
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }], // Volver a la navegación principal (Tab Navigator)
        });
    };

    // Configuración dinámica según tipo
    // Configuración dinámica según tipo
    const getConfig = () => {
        switch (type) {
            case ALERTA_TYPES.MEDICAL:
                return { color: ['#E53935', '#B71C1C'] as const, icon: 'heartbeat', title: 'EMERGENCIA MÉDICA', msg: 'Solicitando ayuda médica' };
            case ALERTA_TYPES.FIRE:
                return { color: ['#FF9800', '#E65100'] as const, icon: 'fire', title: 'INCENDIO', msg: 'Alerta de fuego activada' };
            case ALERTA_TYPES.DANGER:
                return { color: ['#673AB7', '#311B92'] as const, icon: 'exclamation-triangle', title: 'PELIGRO', msg: 'Alerta silenciosa enviada' };
            case ALERTA_TYPES.TRAFFIC:
                return { color: ['#0288D1', '#01579B'] as const, icon: 'car-crash', title: 'ACCIDENTE', msg: 'Reportando accidente' };
            case ALERTA_TYPES.PREVENTIVE:
                return { color: ['#43A047', '#1B5E20'] as const, icon: 'shield', title: 'PREVENTIVA', msg: 'Modo preventivo activo' };
            default:
                return { color: ['#D32F2F', '#B71C1C'] as const, icon: 'bell', title: 'EMERGENCIA', msg: 'Ayuda en camino' };
        }
    };

    const config = getConfig();

    return (
        <View style={styles.container}>
            {/* Mapa de fondo */}
            <MapView
                provider={PROVIDER_GOOGLE}
                ref={mapRef}
                style={StyleSheet.absoluteFillObject}
                initialRegion={currentRegion}
                showsUserLocation={true}
                showsMyLocationButton={false}
                followsUserLocation={true}
                customMapStyle={[ // Mapa estilo oscuro para emergencias
                    {
                        "elementType": "geometry",
                        "stylers": [{ "color": "#242f3e" }]
                    },
                    {
                        "elementType": "labels.text.fill",
                        "stylers": [{ "color": "#746855" }]
                    },
                    {
                        "elementType": "labels.text.stroke",
                        "stylers": [{ "color": "#242f3e" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#38414e" }]
                    },
                    {
                        "featureType": "road",
                        "elementType": "geometry.stroke",
                        "stylers": [{ "color": "#212a37" }]
                    },
                    {
                        "featureType": "water",
                        "elementType": "geometry",
                        "stylers": [{ "color": "#17263c" }]
                    }
                ]}
            />

            {/* Overlay Gradiente semitransparente para legibilidad */}
            <LinearGradient
                colors={[...config.color.map((c: string) => c + '80'), 'transparent', ...config.color.map((c: string) => c + '99')] as any} // Hex + Alpha
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFillObject}
            />

            <SafeAreaView style={styles.content}>

                <View style={styles.statusContainer}>
                    {isOffline && (
                        <View style={styles.offlineBadge}>
                            <Feather name="wifi-off" size={16} color="#fff" />
                            <Text style={styles.offlineText}>Modo Offline</Text>
                        </View>
                    )}

                    <Text style={styles.title}>{config.title}</Text>
                    <Text style={styles.subtitle}>{config.msg}</Text>
                    <View style={styles.locationBadge}>
                        <FontAwesome5 name="map-marker-alt" size={14} color="#fff" style={{ marginRight: 5 }} />
                        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Compartiendo Ubicación en tiempo real</Text>
                    </View>
                </View>

                <View style={styles.pulseContainer}>
                    <Animated.View style={[styles.circle, { transform: [{ scale: pulse }] }]}>
                        <FontAwesome5 name={config.icon} size={60} color={config.color[0]} />
                    </Animated.View>
                </View>

                <TouchableOpacity style={styles.safeButton} onPress={handleStop}>
                    <Text style={styles.safeButtonText}>ESTOY A SALVO</Text>
                    <Text style={styles.safeButtonSub}>Desactivar Alerta</Text>
                </TouchableOpacity>

            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 30,
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    statusContainer: {
        alignItems: 'center',
        marginTop: 40
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        letterSpacing: 2,
        textAlign: 'center'
    },
    subtitle: {
        fontSize: 18,
        color: 'rgba(255,255,255,0.8)',
        marginTop: 10,
        textAlign: 'center'
    },
    locationBadge: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 15,
        marginTop: 15,
        alignItems: 'center'
    },
    offlineBadge: {
        flexDirection: 'row',
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 20,
        alignItems: 'center',
        gap: 8
    },
    offlineText: {
        color: '#fff',
        fontWeight: 'bold'
    },
    pulseContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        // Hacerlo más pequeño para no tapar tanto el mapa
        marginBottom: 20
    },
    circle: {
        width: 140, // Reduced from 200
        height: 140, // Reduced from 200
        borderRadius: 70,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.5,
        shadowRadius: 10,
    },
    safeButton: {
        width: '90%',
        backgroundColor: '#fff',
        paddingVertical: 18,
        borderRadius: 30, // More rounded
        alignItems: 'center',
        marginBottom: 30,
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.3,
        shadowRadius: 5
    },
    safeButtonText: {
        color: '#333',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    safeButtonSub: {
        color: '#666',
        fontSize: 13
    }
});

export default ActiveEmergencyScreen;
