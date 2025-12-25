import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Vibration } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ambulance, Flame, ShieldAlert, Car, Eye } from 'lucide-react-native';
import { normalize } from '../../../shared/utils/dimensions';

const EMERGENCY_TYPES = [
    { id: 'MEDICA', label: 'Emergencia Médica', icon: Ambulance, color: '#E74C3C', priority: 'CRITICA' },
    { id: 'PELIGRO', label: 'Peligro / Violencia', icon: ShieldAlert, color: '#C0392B', priority: 'CRITICA' },
    { id: 'INCENDIO', label: 'Incendio', icon: Flame, color: '#E67E22', priority: 'CRITICA' },
    { id: 'TRANSITO', label: 'Accidente de Tránsito', icon: Car, color: '#F1C40F', priority: 'ALTA' },
    { id: 'PREVENTIVA', label: 'Emergencia Preventiva', icon: Eye, color: '#3498DB', priority: 'MEDIA' },
];

const EmergencySelectionScreen = ({ navigation }: any) => {

    const handleSelect = (type: any) => {
        Vibration.vibrate(50); // Feedback háptico
        // Navegar a la pantalla de emergencia activa pasando el tipo
        navigation.navigate('ActiveEmergency', { type });
    };

    const renderItem = ({ item }: any) => {
        const Icon = item.icon;
        return (
            <TouchableOpacity
                style={[styles.card, { borderColor: item.color }]}
                onPress={() => handleSelect(item)}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#2c3e50', '#000000']}
                    style={styles.cardGradient}
                >
                    <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                        <Icon size={normalize(32)} color="#FFF" />
                    </View>
                    <Text style={styles.cardLabel}>{item.label}</Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>¿Cuál es tu emergencia?</Text>
            <FlatList
                data={EMERGENCY_TYPES}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
            />
            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <Text style={styles.cancelText}>Cancelar</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1a1a1a',
        paddingTop: 50,
        paddingHorizontal: 20,
    },
    title: {
        color: '#FFF',
        fontSize: normalize(24),
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    listContent: {
        paddingBottom: 40,
    },
    card: {
        height: 100,
        marginBottom: 15,
        borderRadius: 15,
        borderWidth: 2,
        overflow: 'hidden',
    },
    cardGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
    },
    cardLabel: {
        color: '#FFF',
        fontSize: normalize(18),
        fontWeight: '600',
    },
    cancelButton: {
        marginBottom: 30,
        padding: 15,
        backgroundColor: '#333',
        borderRadius: 10,
        alignItems: 'center',
    },
    cancelText: {
        color: '#FFF',
        fontSize: 16,
    }
});

export default EmergencySelectionScreen;
