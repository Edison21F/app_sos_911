import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import { container } from '../../infrastructure/di/container';
import { SavedLocation } from '../../domain/entities/SavedLocation';

export const useLocationViewModel = () => {
  const [savedLocations, setSavedLocations] = useState<SavedLocation[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(false);

  const loadSavedLocations = async () => {
    try {
      setLoadingLocations(true);
      const clienteId = await AsyncStorage.getItem('clienteId');
      console.log('Loading locations for clienteId:', clienteId);
      if (!clienteId) {
        console.warn('No clienteId found, cannot load locations');
        return;
      }

      const locations = await container.getSavedLocationsUseCase.execute(clienteId);
      console.log('Loaded locations:', locations);
      setSavedLocations(locations);
    } catch (error) {
      console.error('Error loading locations:', error);
      // Show alert for debugging
      Alert.alert('Error', 'No se pudieron cargar las ubicaciones guardadas');
    } finally {
      setLoadingLocations(false);
    }
  };

  const saveCurrentLocation = async (latitude: number, longitude: number) => {
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) return;

      const locationData = {
        clienteId,
        latitud: latitude,
        longitud: longitude,
        marca_tiempo: new Date().toISOString(),
        estado: 'activo'
      };

      await container.saveLocationUseCase.execute(locationData);
      Alert.alert('Éxito', 'Ubicación guardada correctamente');
      loadSavedLocations(); // Recargar lista
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la ubicación');
    }
  };

  const deleteLocation = async (locationId: string) => {
    Alert.alert('Eliminar', '¿Estás seguro?', [
      { text: 'Cancelar' },
      {
        text: 'Eliminar',
        onPress: async () => {
          try {
            await container.deleteLocationUseCase.execute(locationId);
            loadSavedLocations();
          } catch (error) {
            console.error('Error deleting location:', error);
          }
        }
      }
    ]);
  };

  const renameLocation = async (location: SavedLocation, newName: string) => {
    try {
      await container.renameLocationUseCase.execute(location, newName);
      Alert.alert('Éxito', 'Ubicación renombrada correctamente');
      loadSavedLocations();
    } catch (error) {
      console.error('Error renaming location:', error);
      Alert.alert('Error', 'No se pudo renombrar la ubicación');
    }
  };

  useEffect(() => {
    loadSavedLocations();
  }, []);

  return {
    savedLocations,
    loadingLocations,
    loadSavedLocations,
    saveCurrentLocation,
    deleteLocation,
    renameLocation
  };
};