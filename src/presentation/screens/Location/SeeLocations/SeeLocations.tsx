import React, { useState } from 'react';
import { View, TouchableOpacity, Text, Modal, FlatList, Alert, TextInput } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { styles } from './SeeLocationsStyles';
import Header from '../../../components/Header/Header';
import { LinearGradient } from 'expo-linear-gradient';

interface SavedLocation {
  id: string;
  clienteId: string;
  latitud: number;
  longitud: number;
  marca_tiempo: string;
  estado: string;
  nombre?: string;
}

interface Props {
  closeModal: () => void;
  savedLocations: SavedLocation[];
  deleteLocation: (id: string) => void;
  renameLocation: (location: SavedLocation, newName: string) => void;
}

const SeeLocations = ({ closeModal, savedLocations, deleteLocation, renameLocation }: Props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [renameModalVisible, setRenameModalVisible] = useState(false);
  const [currentLocationToRename, setCurrentLocationToRename] = useState<SavedLocation | null>(null);
  const [newName, setNewName] = useState('');

  const handleDeleteLocation = async (locationId: string) => {
    Alert.alert('Eliminar', '¿Estás seguro?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await deleteLocation(locationId);
          } catch (error) {
            console.error('Error deleting location:', error);
          }
        }
      }
    ]);
  };

  const openRenameModal = (location: SavedLocation) => {
    setCurrentLocationToRename(location);
    setNewName(location.nombre || '');
    setRenameModalVisible(true);
  };

  const handleRenameSubmit = () => {
    if (currentLocationToRename && newName.trim()) {
      renameLocation(currentLocationToRename, newName.trim());
      setRenameModalVisible(false);
      setCurrentLocationToRename(null);
      setNewName('');
    } else {
      Alert.alert('Error', 'El nombre no puede estar vacío');
    }
  };

  return (
    <>
      <Modal visible={true} transparent={true} animationType="slide">
        <LinearGradient
          colors={["#026b6b", "#2D353C"]}
          style={styles.backgroundImage}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.modalContainer}>
            <Header
              onMenuPress={() => setSidebarOpen(true)}
              showBackButton
              onBackPress={closeModal}
              customTitle="Mis Ubicaciones"
            />

            <MapView
              style={styles.modalMap}
              initialRegion={{
                latitude: -0.1807,
                longitude: -78.4678,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              {savedLocations.map((location) => (
                <Marker
                  key={location.id}
                  coordinate={{ latitude: location.latitud, longitude: location.longitud }}
                  title={location.nombre || `Ubicación ${location.id}`}
                  description={location.marca_tiempo}
                  pinColor="red"
                />
              ))}
            </MapView>

            <View style={styles.locationsList}>
              <Text style={styles.locationsTitle}>Mis Ubicaciones:</Text>

              <FlatList
                data={savedLocations}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.locationItem}>
                    <MaterialIcons name="location-on" style={styles.locationItemIcon} />
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.locationText}>{item.nombre || `Ubicación ${item.id}`}</Text>
                      <Text style={{ fontSize: 10, color: '#666' }}>{`Lat: ${item.latitud.toFixed(4)}, Lon: ${item.longitud.toFixed(4)}`}</Text>
                    </View>

                    <TouchableOpacity onPress={() => openRenameModal(item)} style={{ marginRight: 15 }}>
                      <Feather name="edit-2" size={20} color="#00ACAC" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => handleDeleteLocation(item.id)}>
                      <MaterialIcons name="delete" size={20} color="red" />
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </View>
        </LinearGradient>
      </Modal>

      {/* Modal pequeño para renombrar */}
      <Modal visible={renameModalVisible} transparent={true} animationType="fade">
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.6)' }}>
          <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, width: '80%' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 15 }}>Renombrar Ubicación</Text>

            <TextInput
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10, marginBottom: 20 }}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nuevo nombre (ej. Casa)"
            />

            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setRenameModalVisible(false)} style={{ marginRight: 15, padding: 10 }}>
                <Text style={{ color: '#666' }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleRenameSubmit} style={{ backgroundColor: '#00ACAC', padding: 10, borderRadius: 5 }}>
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Guardar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default SeeLocations;