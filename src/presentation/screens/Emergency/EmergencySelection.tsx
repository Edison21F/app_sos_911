import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { Feather, FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { useEmergencySelectionViewModel } from '../../hooks/useEmergencySelectionViewModel';
import { theme } from '../../styles/theme';

const EmergencySelectionScreen = () => {
    const navigation = useNavigation<any>();
    const { loading, location, startEmergency } = useEmergencySelectionViewModel();

    // Location logic moved to ViewModel

    const handleEmergency = async (type: string, priority: string, title: string) => {
        await startEmergency(type as any, priority);
    };

    const EmergencyButton = ({ icon, label, type, priority, color, subLabel }: any) => (
        <TouchableOpacity
            style={[styles.card, { backgroundColor: color }]}
            onPress={() => handleEmergency(type, priority, label)}
            disabled={loading}
        >
            <View style={styles.iconContainer}>
                {icon}
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{label}</Text>
                <Text style={styles.cardSubtitle}>{subLabel}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <LinearGradient
            colors={['#1a1a1a', '#000000']}
            style={styles.container}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Feather name="arrow-left" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>¿Cuál es tu emergencia?</Text>
                <Text style={styles.headerSubtitle}>Selecciona la opción que mejor describa la situación</Text>

                <View style={styles.grid}>
                    <EmergencyButton
                        icon={<FontAwesome5 name="heartbeat" size={32} color="#fff" />}
                        label="Médica"
                        subLabel="Salud, Heridas"
                        type="MEDICA"
                        priority="ALTA"
                        color="#E53935" // Red
                    />

                    <EmergencyButton
                        icon={<FontAwesome5 name="fire" size={32} color="#fff" />}
                        label="Incendio"
                        subLabel="Fuego, Explosión"
                        type="INCENDIO"
                        priority="CRITICA"
                        color="#FB8C00" // Orange
                    />

                    <EmergencyButton
                        icon={<MaterialIcons name="dangerous" size={36} color="#fff" />}
                        label="Peligro"
                        subLabel="Robo, Acoso"
                        type="PELIGRO"
                        priority="CRITICA"
                        color="#5E35B1" // Purple
                    />

                    <EmergencyButton
                        icon={<FontAwesome5 name="car-crash" size={30} color="#fff" />}
                        label="Tránsito"
                        subLabel="Choque, Atropello"
                        type="TRANSITO"
                        priority="ALTA"
                        color="#0277BD" // Blue
                    />

                    <EmergencyButton
                        icon={<Feather name="shield" size={32} color="#fff" />}
                        label="Preventiva"
                        subLabel="Sospecha, Riesgo"
                        type="PREVENTIVA"
                        priority="MEDIA"
                        color="#43A047" // Green
                    />
                </View>

                {loading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#fff" />
                        <Text style={{ color: '#fff', marginTop: 10 }}>Activando Alerta...</Text>
                    </View>
                )}

            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#fff',
        marginTop: 20,
        marginBottom: 5,
    },
    headerSubtitle: {
        fontSize: 16,
        color: '#ccc',
        marginBottom: 30,
    },
    grid: {
        flexDirection: 'column',
        gap: 15,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: 16,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(255,255,255,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    textContainer: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
    },
    backButton: {
        padding: 10,
        marginLeft: -10,
        marginBottom: 0
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
    }
});

export default EmergencySelectionScreen;
