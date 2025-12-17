import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigator';
import { styles } from './AddContactStyles';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';


type AddContactProps = StackScreenProps<RootStackParamList, 'AddContact'>;

const AddContact = ({ navigation, route }: AddContactProps) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'search'>('manual');

  // State Manual
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // State Search
  const [searchQuery, setSearchQuery] = useState('');
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [searchResult, setSearchResult] = useState<any>(null); // { id, nombre, telefono }

  // --- LOGICA MANUAL ---
  const handleSaveManual = async () => {
    if (!nombre.trim() || !telefono.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      const clienteId = await AsyncStorage.getItem('clienteId');

      if (!clienteId) {
        Alert.alert('Error', 'No se pudo obtener la información del usuario.');
        return;
      }

      await api.post('/contactos_emergencias/crear', {
        clienteId: clienteId, // NOTA: Backend espera clienteId, no idUsuarioSql en el body del createEmergencyContact
        nombre,
        telefono,
        relacion: descripcion || 'Contacto'
      });

      Alert.alert('Éxito', 'Contacto guardado correctamente.', [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          }
        }
      ]);

    } catch (error: any) {
      console.error('Error al guardar contacto:', error);
      const msg = error.response?.data?.error || 'No se pudo guardar el contacto.';
      Alert.alert('Error', msg);
    }
  };

  // --- LOGICA BUSQUEDA Y SOLICITUD ---
  const handleSearchUser = async () => {
    // Nota: En este diseño simplificado, enviamos la solicitud DIRECTAMENTE al backend
    // El backend buscará y si encuentra, crea la solicitud inmediatamente.
    // O podemos hacer un paso intermedio de "buscar" para mostrar el nombre antes de enviar.
    // Vamos a implementar el paso intermedio simulado, O mejor, usamos el endpoint de solicitar directamante 
    // y si falla es que no existe. Pero el usuario quiere "buscar y agregar".

    // Para UX mejor: Podriamos tener un endpoint de "buscar preview" PERO por privacidad
    // a veces no se debe mostrar info.
    // Asumiremos que el usuario quiere enviar la solicitud directamente.

    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Ingrese una cédula o teléfono');
      return;
    }

    setLoadingSearch(true);
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      // Enviamos solicitud de vinculación
      const response = await api.post('/contactos_emergencias/solicitar', {
        clienteId,
        criterio: searchQuery
      });

      if (response.data) {
        Alert.alert('Solicitud Enviada', 'Se ha enviado una solicitud de contacto al usuario encontrado.');
        setSearchResult(null);
        setSearchQuery('');
        navigation.goBack();
      }

    } catch (error: any) {
      console.error('Error buscando usuario:', error);

      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      if (status === 404) {
        Alert.alert('Usuario no encontrado', 'No se encontró ningún usuario con esa cédula o teléfono.');
      } else if (status === 409) {
        Alert.alert('Aviso', backendMessage || 'Ya existe una solicitud o relación con este usuario.');
      } else {
        const msg = backendMessage || 'Error de conexión o del servidor.';
        Alert.alert('Error', msg);
      }
    } finally {
      setLoadingSearch(false);
    }
  };

  const handleSendRequest = () => {
    // Este metodo quedaria obsoleto si hacemos la solicitud directa en handleSearchUser
    // O si implementamos un endpoint de "preview" en el backend.
    // Por simplicidad y privacidad, usaremos handleSearchUser como "Enviar Solicitud directa".
    // Si quieres preview, necesitas un endpoint GET /clientes/buscar que retorne solo nombre parcial.
    handleSearchUser();
  };

  const getInitials = (name: string) => {
    if (!name.trim()) return 'CO';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <LinearGradient
      colors={["#026b6b", "#2D353C"]}
      style={styles.backgroundImage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <SafeAreaView style={styles.container}>
            <View style={styles.form}>
              <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={24} color="black" />
              </TouchableOpacity>

              {/* TABS HEADER */}
              <View style={{ flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderColor: '#eee' }}>
                <TouchableOpacity
                  style={{ flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === 'manual' ? '#00ACAC' : 'transparent' }}
                  onPress={() => setActiveTab('manual')}
                >
                  <Text style={{ fontWeight: activeTab === 'manual' ? 'bold' : 'normal', color: activeTab === 'manual' ? '#00ACAC' : '#666' }}>Manual</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{ flex: 1, padding: 10, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === 'search' ? '#00ACAC' : 'transparent' }}
                  onPress={() => setActiveTab('search')}
                >
                  <Text style={{ fontWeight: activeTab === 'search' ? 'bold' : 'normal', color: activeTab === 'search' ? '#00ACAC' : '#666' }}>Buscar Usuario</Text>
                </TouchableOpacity>
              </View>

              {activeTab === 'manual' ? (
                // --- FORMULARIO MANUAL ---
                <>
                  <View style={styles.imagePickerContainer}>
                    <View style={styles.initialsContainer}>
                      <Feather name="user" size={40} color="#fff" />
                    </View>
                    <Text style={styles.imageLabel}>Contacto</Text>
                  </View>

                  <Text style={styles.label}>Nombre:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Juan Pérez"
                    value={nombre}
                    onChangeText={setNombre}
                  />

                  <Text style={styles.label}>Teléfono:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="+593 987 654 321"
                    keyboardType="phone-pad"
                    value={telefono}
                    onChangeText={setTelefono}
                  />

                  <Text style={styles.label}>Relación:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej. Amigo cercano"
                    value={descripcion}
                    onChangeText={setDescripcion}
                  />

                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveManual}>
                    <Feather name="save" size={24} color="white" />
                    <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>Guardar Contacto</Text>
                  </TouchableOpacity>
                </>
              ) : (
                // --- FORMULARIO BUSQUEDA ---
                <>
                  <Text style={[styles.label, { marginTop: 10 }]}>Buscar por Cédula o Teléfono:</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Ingrese CI o celular"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />

                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: '#333' }]}
                    onPress={handleSearchUser}
                    disabled={loadingSearch}
                  >
                    <Feather name="search" size={24} color="white" />
                    <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                      {loadingSearch ? 'Buscando...' : 'Buscar'}
                    </Text>
                  </TouchableOpacity>

                  {/* RESULTADO DE BÚSQUEDA */}
                  {searchResult && (
                    <View style={{ marginTop: 20, padding: 15, backgroundColor: '#f0f9ff', borderRadius: 8, borderWidth: 1, borderColor: '#bae6fd' }}>
                      <Text style={{ fontWeight: 'bold', fontSize: 16 }}>Usuario Encontrado:</Text>
                      <Text style={{ fontSize: 14, marginVertical: 5 }}>{searchResult.nombre}</Text>

                      <TouchableOpacity
                        style={[styles.saveButton, { marginTop: 10, backgroundColor: '#00ACAC' }]}
                        onPress={handleSendRequest}
                      >
                        <Feather name="user-plus" size={20} color="white" />
                        <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>Enviar Solicitud</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}

            </View>
          </SafeAreaView>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

export default AddContact;