import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../../theme/theme';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface EmergencyAlertModalProps {
    visible: boolean;
    onClose: () => void;
    alertData: any;
}

const EmergencyAlertModal: React.FC<EmergencyAlertModalProps> = ({ visible, onClose, alertData }) => {
    const [responding, setResponding] = useState(false);

    if (!alertData) return null;

    const { ubicacion, tipo, detalles, prioridad, _id, idUsuarioSql } = alertData;
    const senderName = "Contacto de Emergencia"; // Ideally this comes from alertData or we fetch name

    const handleResponse = async (responseType: string) => {
        try {
            setResponding(true);
            const myId = await AsyncStorage.getItem('clienteId');
            const myName = await AsyncStorage.getItem('nombreUsuario');

            await api.post(`/alertas/responder/${_id}`, {
                idUsuarioSql: myId,
                nombre: myName || 'Usuario',
                respuesta: responseType,
                ubicacion: {
                    latitud: 0, // Should get real location if possible
                    longitud: 0
                }
            });
            onClose();
        } catch (error) {
            console.error('Error sending response:', error);
        } finally {
            setResponding(false);
        }
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    {/* Header: Red Alert Style */}
                    <View style={styles.header}>
                        <Ionicons name="warning" size={40} color="#fff" />
                        <Text style={styles.title}>¡ALERTA DE EMERGENCIA!</Text>
                        <Text style={styles.sender}>De: {senderName}</Text>
                    </View>

                    {/* Alert Details */}
                    <View style={styles.details}>
                        <View style={styles.row}>
                            <Text style={styles.label}>Tipo:</Text>
                            <Text style={styles.value}>{tipo}</Text>
                        </View>
                        <View style={styles.row}>
                            <Text style={styles.label}>Prioridad:</Text>
                            <Text style={[styles.value, { color: theme.colors.danger }]}>{prioridad}</Text>
                        </View>
                        {detalles && (
                            <Text style={styles.detailsText}>"{detalles}"</Text>
                        )}
                    </View>

                    {/* Map */}
                    <View style={styles.mapContainer}>
                        <MapView
                            style={styles.map}
                            initialRegion={{
                                latitude: ubicacion.latitud,
                                longitude: ubicacion.longitud,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01,
                            }}
                        >
                            <Marker coordinate={{ latitude: ubicacion.latitud, longitude: ubicacion.longitud }} />
                        </MapView>
                    </View>

                    {/* Quick Responses */}
                    <View style={styles.actions}>
                        <Text style={styles.actionTitle}>Respuesta Rápida:</Text>
                        <View style={styles.buttonsRow}>
                            <TouchableOpacity
                                style={[styles.button, styles.btnWay]}
                                onPress={() => handleResponse('Voy en camino')}
                            >
                                <Ionicons name="car" size={24} color="#fff" />
                                <Text style={styles.btnText}>Voy en camino</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.button, styles.btnOk]}
                                onPress={() => handleResponse('Enterado')}
                            >
                                <Ionicons name="checkmark-circle" size={24} color="#fff" />
                                <Text style={styles.btnText}>Enterado</Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                            <Text style={styles.closeText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
    container: { backgroundColor: '#1A1A1A', borderRadius: 20, overflow: 'hidden', maxHeight: '90%' },
    header: { backgroundColor: theme.colors.danger, padding: 20, alignItems: 'center' },
    title: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
    sender: { color: '#fff', fontSize: 16, marginTop: 5 },
    details: { padding: 15 },
    row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
    label: { color: '#aaa', fontSize: 16 },
    value: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
    detailsText: { color: '#ccc', fontStyle: 'italic', marginTop: 10, textAlign: 'center' },
    mapContainer: { height: 200, width: '100%' },
    map: { flex: 1 },
    actions: { padding: 20, alignItems: 'center' },
    actionTitle: { color: '#fff', marginBottom: 15 },
    buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 15 },
    button: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 15, borderRadius: 10, marginHorizontal: 5 },
    btnWay: { backgroundColor: '#3498DB' },
    btnOk: { backgroundColor: '#28B463' },
    btnText: { color: '#fff', fontWeight: 'bold', marginLeft: 5 },
    closeBtn: { padding: 10 },
    closeText: { color: '#aaa' }
});

export default EmergencyAlertModal;
