import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Plus, Trash2, ChevronRight } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
// import AsyncStorage from '@react-native-async-storage/async-storage'; // Commented out
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import GlobalHeaderWrapper from '../../components/Header/GlobalHeaderWrapper';
import { styles } from './EmergencyContactsStyles';
import { theme } from '../../theme/theme';
import { normalize } from '../../utils/dimensions';

interface Contact {
  id: string;
  nombre: string;
  telefono: string;
  descripcion: string;
}

// Remove hardcoded contacts
const initialContacts: Contact[] = [];

const EmergencyContactsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [requests, setRequests] = useState<any[]>([]); // New state for pending requests
  const [loading, setLoading] = useState(false);


  // Fetch CONTACTS (Vinculados/Propios)
  const fetchContacts = async () => {
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) return;

      const response = await api.get(`/contactos_emergencias/listar/por-cliente/${clienteId}`);
      if (response.data) {
        setContacts(response.data.map((c: any) => ({
          id: c.id,
          nombre: c.nombre,
          telefono: c.telefono,
          descripcion: c.descripcion || c.relacion,
          estado: c.estado // Guardamos estado para mostrar badge
        })));
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  };

  // Fetch PENDING REQUESTS
  const fetchRequests = async () => {
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) return;

      const response = await api.get(`/contactos_emergencias/solicitudes/${clienteId}`);
      if (response.data) {
        setRequests(response.data);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const loadAll = async () => {
    setLoading(true);
    await Promise.all([fetchContacts(), fetchRequests()]);
    setLoading(false);
  }

  useFocusEffect(
    React.useCallback(() => {
      loadAll();
    }, [])
  );

  const handleRespond = async (requestId: number, respuesta: 'ACEPTAR' | 'RECHAZAR') => {
    try {
      setLoading(true);
      await api.patch('/contactos_emergencias/responder', {
        id: requestId,
        respuesta
      });
      Alert.alert('Éxito', `Solicitud ${respuesta === 'ACEPTAR' ? 'aceptada' : 'rechazada'}.`);
      loadAll();
    } catch (error) {
      console.error('Error responding:', error);
      Alert.alert('Error', 'No se pudo responder la solicitud.');
      setLoading(false);
    }
  };

  const handleDelete = (contactToDelete: Contact) => {
    Alert.alert(
      `Eliminar a ${contactToDelete.nombre}`,
      '¿Estás seguro de que quieres eliminar este contacto?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              setLoading(true);
              await api.delete(`/contactos_emergencias/eliminar/${contactToDelete.id}`);
              Alert.alert('Éxito', 'Contacto eliminado correctamente');
              fetchContacts();
            } catch (error) {
              console.error('Error deleting contact:', error);
              Alert.alert('Error', 'No se pudo eliminar el contacto.');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  const getInitials = (nombre: string) => {
    if (!nombre || !nombre.trim()) return 'CO';
    return nombre
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const renderRequestItem = (req: any) => (
    <View key={req.id} style={[styles.contactCard, { borderColor: '#Eab308', borderWidth: 1 }]}>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{req.nombre}</Text>
        <Text style={[styles.contactRelation, { color: '#Eab308', fontWeight: 'bold' }]}>
          Solicitud de Contacto
        </Text>
      </View>
      <View style={{ flexDirection: 'row' }}>
        <TouchableOpacity
          onPress={() => handleRespond(req.id, 'ACEPTAR')}
          style={{ backgroundColor: '#22c55e', padding: 8, borderRadius: 5, marginRight: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Aceptar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleRespond(req.id, 'RECHAZAR')}
          style={{ backgroundColor: '#ef4444', padding: 8, borderRadius: 5 }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderContactCard = (contact: Contact) => (
    <TouchableOpacity
      key={contact.id}
      style={styles.contactCard}
      activeOpacity={0.8}
      onPress={() => navigation.navigate('ContactDetails', { contact })}
    >
      <View style={styles.contactImageContainer}>
        <View style={styles.initialsContainer}>
          <Text style={styles.initialsText}>{getInitials(contact.nombre)}</Text>
        </View>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{contact.nombre}</Text>
        <Text style={styles.contactRelation}>{contact.descripcion}</Text>
        {/* Status Badge */}
        {/* @ts-ignore */}
        {contact.estado === 'PENDIENTE' && (
          <Text style={{ fontSize: 10, color: '#Eab308', fontWeight: 'bold' }}>PENDIENTE</Text>
        )}
        {/* @ts-ignore */}
        {contact.estado === 'VINCULADO' && (
          <Text style={{ fontSize: 10, color: '#22c55e', fontWeight: 'bold' }}>VINCULADO</Text>
        )}
      </View>
      <View style={styles.contactActions}>
        <TouchableOpacity onPress={() => handleDelete(contact)} style={styles.deleteButton}>
          <Trash2 size={normalize(20)} color={theme.colors.danger} />
        </TouchableOpacity>
        <ChevronRight size={normalize(22)} color={theme.colors.textSecondary} />
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.backgroundImage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <GlobalHeaderWrapper showBackButton={true} />
        <ScrollView contentContainerStyle={styles.content}>
          {loading && <ActivityIndicator size="small" color="#fff" style={{ marginBottom: 10 }} />}

          {/* SECTION REQUESTS */}
          {requests.length > 0 && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Solicitudes Pendientes</Text>
              {requests.map(renderRequestItem)}
            </View>
          )}

          {/* SECTION CONTACTS */}
          <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold', marginBottom: 10 }}>Mis Contactos</Text>
          {contacts.map(renderContactCard)}

          {contacts.length === 0 && !loading && (
            <Text style={{ color: '#ccc', textAlign: 'center', marginTop: 20 }}>No tienes contactos registrados.</Text>
          )}

        </ScrollView>
        <TouchableOpacity
          style={styles.addButtonContainer}
          activeOpacity={0.9}
          onPress={() => navigation.navigate('AddContact')}
        >
          <LinearGradient
            colors={theme.colors.gradientButton}
            style={styles.addButton}
          >
            <Plus size={normalize(28)} color="#FFF" />
          </LinearGradient>
        </TouchableOpacity>

      </SafeAreaView>
    </LinearGradient>
  );
};

export default EmergencyContactsScreen;