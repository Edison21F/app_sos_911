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
import { useContactsViewModel } from '../../../hooks/useContactsViewModel';

type AddContactProps = StackScreenProps<RootStackParamList, 'AddContact'>;

const AddContact = ({ navigation, route }: AddContactProps) => {
  const [activeTab, setActiveTab] = useState<'manual' | 'search'>('manual');
  const { addContact, sendContactRequest, isLoading } = useContactsViewModel();

  // State Manual
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [descripcion, setDescripcion] = useState('');

  // State Search
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<any>(null); // Kept for future "search before add" logic

  // --- LOGICA MANUAL ---
  const handleSaveManual = async () => {
    if (!nombre.trim() || !telefono.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    const success = await addContact(nombre, telefono, descripcion || 'Contacto', false);
    if (success) {
      Alert.alert('Éxito', 'Contacto guardado correctamente.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    }
  };

  // --- LOGICA BUSQUEDA Y SOLICITUD ---
  const handleSearchUser = async () => {
    if (!searchQuery.trim()) {
      Alert.alert('Error', 'Ingrese una cédula o teléfono');
      return;
    }

    try {
      await sendContactRequest(searchQuery);
      Alert.alert('Solicitud Enviada', 'Se ha enviado una solicitud de contacto al usuario encontrado.');
      setSearchResult(null);
      setSearchQuery('');
      navigation.goBack();

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
    }
  };

  const handleSendRequest = () => {
    // Alias for handleSearchUser in this simplified flow
    handleSearchUser();
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

                  <TouchableOpacity style={styles.saveButton} onPress={handleSaveManual} disabled={isLoading}>
                    <Feather name="save" size={24} color="white" />
                    <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                      {isLoading ? 'Guardando...' : 'Guardar Contacto'}
                    </Text>
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
                    disabled={isLoading}
                  >
                    <Feather name="search" size={24} color="white" />
                    <Text style={[styles.saveButtonText, { marginLeft: 8 }]}>
                      {isLoading ? 'Buscando...' : 'Buscar'}
                    </Text>
                  </TouchableOpacity>
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