import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  SafeAreaView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../../navigation/Navigator';
import { styles } from './ContactDetailsStyles';
import { Feather } from '@expo/vector-icons';
import Header from '../../../components/Header/Header';
import { LinearGradient } from 'expo-linear-gradient';
import { useContactsViewModel } from '../../../hooks/useContactsViewModel';

type ContactDetailsScreenRouteProp = RouteProp<RootStackParamList, 'ContactDetails'>;
type ContactDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetails'>;

type ContactDetailsProps = {
  route: ContactDetailsScreenRouteProp;
  navigation: ContactDetailsScreenNavigationProp;
};

const ContactDetailsScreen: React.FC<ContactDetailsProps> = ({ route, navigation }) => {
  const { contact } = route.params;
  const { updateContact, deleteContact, isLoading } = useContactsViewModel();
  const [modalVisible, setModalVisible] = useState(false);
  const loading = isLoading;
  // Map contact (Entity) to Form State (Spanish)
  const [editedContact, setEditedContact] = useState({
    id: contact.id,
    nombre: contact.name,
    telefono: contact.phone,
    descripcion: contact.relationship
  });
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  // Update editedContact if route.params.contact changes
  useEffect(() => {
    setEditedContact({
      id: contact.id,
      nombre: contact.name,
      telefono: contact.phone,
      descripcion: contact.relationship
    });
  }, [contact]);

  const handleEdit = () => setModalVisible(true);

  const handleSave = async () => {
    if (!editedContact.nombre.trim() || !editedContact.telefono.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos obligatorios.');
      return;
    }

    const startUpdate = async () => {
      // Map form fields to Entity fields
      const success = await updateContact(editedContact.id, {
        name: editedContact.nombre, // Mapped from state 'nombre'
        phone: editedContact.telefono, // Mapped from state 'telefono'
        relationship: editedContact.descripcion // Mapped from state 'descripcion'
      });

      if (success) {
        setModalVisible(false);
        Alert.alert('Éxito', 'Contacto actualizado correctamente', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    };
    startUpdate();
  };

  const getInitials = (nombre: string) => {
    if (!nombre.trim()) return 'CO';
    return nombre
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

      <SafeAreaView style={styles.container}>
        <Header
          onMenuPress={() => setSidebarOpen(true)}
          showBackButton
          onBackPress={() => navigation.goBack()}
          customTitle="Detalles de Contacto"
        />

        <View style={styles.card}>
          <View style={styles.imageContainer}>
            <View style={styles.initialsContainer}>
              <Text style={styles.initialsText}>{getInitials(editedContact.nombre)}</Text>
            </View>
            <TouchableOpacity style={styles.editIcon} onPress={handleEdit}>
              <Feather name="edit" size={22} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>{editedContact.nombre}</Text>
          <Text style={styles.phone}>{editedContact.telefono}</Text>
          <Text style={styles.relation}>{editedContact.descripcion}</Text>
        </View>
      </SafeAreaView>

      {/* Modal de Edición */}
      <Modal visible={modalVisible} animationType="slide">
        <LinearGradient
          colors={["#026b6b", "#2D353C"]}
          style={styles.backgroundImage}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <SafeAreaView style={styles.modalContainer}>

            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => setModalVisible(false)}
              >
                <Feather name="arrow-left" size={24} color="#000" />
              </TouchableOpacity>

              <View style={styles.imageContainer}>
                <View style={styles.initialsContainer}>
                  <Text style={styles.initialsText}>{getInitials(editedContact.nombre)}</Text>
                </View>
              </View>

              <TextInput
                style={styles.input}
                value={editedContact.nombre}
                onChangeText={(text) => setEditedContact({ ...editedContact, nombre: text })}
                placeholder="Nombre"
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                value={editedContact.telefono}
                onChangeText={(text) => setEditedContact({ ...editedContact, telefono: text })}
                placeholder="Teléfono"
                keyboardType="phone-pad"
                placeholderTextColor="#ccc"
              />
              <TextInput
                style={styles.input}
                value={editedContact.descripcion}
                onChangeText={(text) => setEditedContact({ ...editedContact, descripcion: text })}
                placeholder="Descripción"
                placeholderTextColor="#ccc"
              />

              <TouchableOpacity
                style={[styles.saveButton, loading && { opacity: 0.7 }]}
                onPress={handleSave}
                disabled={loading}
              >
                <Feather name="save" size={24} color="white" />
                <Text style={[styles.buttonText, { marginLeft: 8 }]}>
                  {loading ? 'Guardando...' : 'Guardar'}
                </Text>
              </TouchableOpacity>

            </View>
          </SafeAreaView>
        </LinearGradient>
      </Modal>
    </LinearGradient>
  );
};

export default ContactDetailsScreen;