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
import { Ionicons, Feather } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamList } from '../../../navigation/Navigator';
import { styles } from './AddContactStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { useContactsViewModel } from '../../../hooks/useContactsViewModel';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

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

  return (
    <LinearGradient
      colors={['#2c0000', '#000000']} // Dark Red to Black Gradient
      style={styles.backgroundImage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Ionicons name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Agregar Contacto</Text>
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.form}>

              {/* TABS HEADER */}
              <Animated.View
                entering={FadeInDown.delay(100).duration(600).springify()}
                style={styles.tabContainer}
              >
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'manual' && styles.activeTab]}
                  onPress={() => setActiveTab('manual')}
                >
                  <Text style={[styles.tabText, activeTab === 'manual' && styles.activeTabText]}>Manual</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tabButton, activeTab === 'search' && styles.activeTab]}
                  onPress={() => setActiveTab('search')}
                >
                  <Text style={[styles.tabText, activeTab === 'search' && styles.activeTabText]}>Buscar Usuario</Text>
                </TouchableOpacity>
              </Animated.View>

              {activeTab === 'manual' ? (
                // --- FORMULARIO MANUAL ---
                <View>
                  <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.imagePickerContainer}>
                    <View style={styles.initialsContainer}>
                      <Feather name="user-plus" size={40} color="#fff" />
                    </View>
                    <Text style={styles.imageLabel}>Nuevo Contacto Local</Text>
                  </Animated.View>

                  <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.fieldContainer}>
                    <Text style={styles.label}>Nombre</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej. Juan Pérez"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={nombre}
                      onChangeText={setNombre}
                    />
                  </Animated.View>

                  <Animated.View entering={FadeInDown.delay(400).duration(600).springify()} style={styles.fieldContainer}>
                    <Text style={styles.label}>Teléfono</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="+593 987 654 321"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      keyboardType="phone-pad"
                      value={telefono}
                      onChangeText={setTelefono}
                    />
                  </Animated.View>

                  <Animated.View entering={FadeInDown.delay(500).duration(600).springify()} style={styles.fieldContainer}>
                    <Text style={styles.label}>Relación (Opcional)</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ej. Padre, Amigo, Vecino"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={descripcion}
                      onChangeText={setDescripcion}
                    />
                  </Animated.View>

                  <Animated.View entering={FadeInUp.delay(600).duration(600).springify()}>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveManual} disabled={isLoading}>
                      {isLoading ? (
                        <Text style={styles.saveButtonText}>Guardando...</Text>
                      ) : (
                        <>
                          <Feather name="save" size={20} color="white" />
                          <Text style={styles.saveButtonText}>Guardar Contacto</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              ) : (
                // --- FORMULARIO BUSQUEDA ---
                <View>
                  <Animated.View entering={FadeInDown.delay(200).duration(600).springify()} style={styles.imagePickerContainer}>
                    <View style={[styles.initialsContainer, { borderColor: '#00ACAC' }]}>
                      <Feather name="search" size={40} color="#fff" />
                    </View>
                    <Text style={styles.imageLabel}>Buscar en la red SOS</Text>
                  </Animated.View>

                  <Animated.View entering={FadeInDown.delay(300).duration(600).springify()} style={styles.fieldContainer}>
                    <Text style={styles.label}>Cédula o Teléfono</Text>
                    <TextInput
                      style={styles.input}
                      placeholder="Ingrese identificación"
                      placeholderTextColor="rgba(255,255,255,0.4)"
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                    />
                  </Animated.View>

                  <Animated.View entering={FadeInUp.delay(400).duration(600).springify()}>
                    <TouchableOpacity
                      style={[styles.saveButton, { backgroundColor: '#333', borderColor: '#555', borderWidth: 1 }]}
                      onPress={handleSearchUser}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Text style={styles.saveButtonText}>Buscando...</Text>
                      ) : (
                        <>
                          <Feather name="search" size={20} color="white" />
                          <Text style={styles.saveButtonText}>Buscar Usuario</Text>
                        </>
                      )}
                    </TouchableOpacity>
                  </Animated.View>
                </View>
              )}

            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AddContact;