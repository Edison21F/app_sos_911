import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Alert, Linking, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../styles/theme';
import { MapPin, AlertTriangle, Navigation } from 'lucide-react-native';
import { normalize } from '../../../shared/utils/dimensions';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/Navigator';
import GlobalHeaderWrapper from '../../components/Header/GlobalHeaderWrapper';

type NearbyAlertsScreenProps = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'NearbyAlerts'>;
};

type AlertaCercana = {
    _id: string;
    tipo: string;
    prioridad: string;
    detalles?: string;
    ubicacion: {
        latitud: number;
        longitud: number;
        direccion_aproximada?: string;
    };
    fecha_creacion: string;
    distancia?: number;
};

import { useNearbyAlertsViewModel } from '../../hooks/useNearbyAlertsViewModel';

// ...

const NearbyAlertsScreen: React.FC<NearbyAlertsScreenProps> = ({ navigation }) => {
    const { alerts, isLoading, myLocation, fetchNearbyAlerts } = useNearbyAlertsViewModel();

    useEffect(() => {
        fetchNearbyAlerts();
    }, [fetchNearbyAlerts]);

    const handleRefresh = () => {
        fetchNearbyAlerts();
    };

    const openMaps = (lat: number, lng: number) => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${lat},${lng}`;
        const label = 'Emergencia';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) Linking.openURL(url);
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICA': return '#FF4B4B';
            case 'ALTA': return '#FF8C00';
            case 'MEDIA': return '#FFD700';
            default: return '#ccc';
        }
    };

    const renderItem = ({ item }: { item: AlertaCercana }) => (
        <View style={styles.card}>
            <View style={[styles.priorityStrip, { backgroundColor: getPriorityColor(item.prioridad) }]} />
            <View style={styles.cardContent}>
                <View style={styles.headerRow}>
                    <AlertTriangle size={normalize(20)} color={getPriorityColor(item.prioridad)} />
                    <Text style={styles.typeText}>{item.tipo}</Text>
                    <Text style={styles.dateText}>{new Date(item.fecha_creacion).toLocaleTimeString()}</Text>
                </View>

                {item.detalles && <Text style={styles.detailsText}>{item.detalles}</Text>}

                <View style={styles.locationRow}>
                    <MapPin size={normalize(16)} color="#666" />
                    <Text style={styles.locationText}>
                        {item.ubicacion.direccion_aproximada || `${item.ubicacion.latitud.toFixed(4)}, ${item.ubicacion.longitud.toFixed(4)}`}
                    </Text>
                </View>

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => openMaps(item.ubicacion.latitud, item.ubicacion.longitud)}
                >
                    <Navigation size={normalize(18)} color="#FFF" />
                    <Text style={styles.actionButtonText}>Ver en Mapa</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <GlobalHeaderWrapper showBackButton={true} />

            <FlatList
                data={alerts}
                keyExtractor={(item) => item._id}
                renderItem={renderItem}
                contentContainerStyle={styles.listContent}
                refreshing={isLoading}
                onRefresh={handleRefresh}
                ListEmptyComponent={
                    !isLoading ? (
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No hay alertas activas cerca de ti.</Text>
                        </View>
                    ) : null
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0F0F0F',
    },
    // Removed legacy header styles
    listContent: {
        padding: normalize(20),
    },
    card: {
        backgroundColor: '#1A1A1A',
        borderRadius: normalize(10),
        marginBottom: normalize(15),
        overflow: 'hidden',
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#333',
    },
    priorityStrip: {
        width: normalize(6),
        height: '100%',
    },
    cardContent: {
        flex: 1,
        padding: normalize(15),
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(8),
    },
    typeText: {
        fontSize: normalize(18),
        fontWeight: 'bold',
        color: '#FFF',
        marginLeft: normalize(10),
        flex: 1,
    },
    dateText: {
        fontSize: normalize(12),
        color: '#888',
    },
    detailsText: {
        color: '#CCC',
        marginBottom: normalize(10),
        fontSize: normalize(14),
    },
    locationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(15),
    },
    locationText: {
        color: '#888',
        marginLeft: normalize(6),
        fontSize: normalize(12),
    },
    actionButton: {
        flexDirection: 'row',
        backgroundColor: theme.colors.primary,
        padding: normalize(10),
        borderRadius: normalize(8),
        alignItems: 'center',
        justifyContent: 'center',
    },
    actionButtonText: {
        color: '#FFF',
        fontWeight: '600',
        marginLeft: normalize(8),
    },
    emptyContainer: {
        padding: normalize(40),
        alignItems: 'center',
    },
    emptyText: {
        color: '#666',
        fontSize: normalize(16),
    },
});

export default NearbyAlertsScreen;
