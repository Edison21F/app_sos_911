import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  Alert,
  ImageBackground,
  ImageSourcePropType,
  KeyboardAvoidingView,
  ActivityIndicator,
  Platform,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import styles from './AddGroupStyles';
import Header from '../../../components/Header/Header';
import CustomSidebar from '../../../components/Sidebar/Sidebar';
import { LinearGradient } from 'expo-linear-gradient';

import { StackNavigationProp } from '@react-navigation/stack';
import api from '../../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AddGroupProps {
  navigation: StackNavigationProp<any>;
}

const AddGroup: React.FC<AddGroupProps> = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'join'>('create');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Create State
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');

  // Join State
  const [joinCode, setJoinCode] = useState('');

  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) {
      Alert.alert('Error', 'Por favor ingresa un nombre para el grupo');
      return;
    }

    setLoading(true);
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) throw new Error('No session');

      const response = await api.post('/grupos/crear', {
        clienteId,
        nombre: newGroupName,
        descripcion: newGroupDesc,
      });

      Alert.alert('Grupo Creado', `Código de acceso: ${response.data.codigo}`, [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error: any) {
      console.error('Create group error:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo crear el grupo');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!joinCode.trim() || joinCode.length !== 6) {
      Alert.alert('Error', 'Ingresa un código válido de 6 dígitos');
      return;
    }

    setLoading(true);
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) throw new Error('No session');

      const response = await api.post('/grupos/unirse', {
        clienteId,
        codigo: joinCode
      });

      Alert.alert('Éxito', `Te has unido al grupo "${response.data.nombre}"`, [
        { text: 'Ir a Grupos', onPress: () => navigation.goBack() }
      ]);

    } catch (error: any) {
      console.error('Join group error:', error);
      Alert.alert('Error', error.response?.data?.message || 'No se pudo unir al grupo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#026b6b", "#2D353C"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <Header
          onMenuPress={() => setSidebarOpen(true)}
          customTitle={activeTab === 'create' ? "Crear Grupo" : "Unirse a Grupo"}
          showBackButton
          onBackPress={() => navigation.goBack()}
        />

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={{ padding: 20 }}>
            <View style={{ flexDirection: 'row', marginBottom: 20, borderBottomWidth: 1, borderColor: '#FFFFFF33' }}>
              <TouchableOpacity
                style={{ flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === 'create' ? '#00ACAC' : 'transparent' }}
                onPress={() => setActiveTab('create')}
              >
                <Text style={{ fontSize: 16, fontWeight: activeTab === 'create' ? 'bold' : 'normal', color: activeTab === 'create' ? '#00ACAC' : '#CCC' }}>Crear Grupo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, padding: 15, alignItems: 'center', borderBottomWidth: 2, borderColor: activeTab === 'join' ? '#00ACAC' : 'transparent' }}
                onPress={() => setActiveTab('join')}
              >
                <Text style={{ fontSize: 16, fontWeight: activeTab === 'join' ? 'bold' : 'normal', color: activeTab === 'join' ? '#00ACAC' : '#CCC' }}>Unirse con Código</Text>
              </TouchableOpacity>
            </View>

            {activeTab === 'create' ? (
              <View>
                <Text style={{ color: '#FFF', marginBottom: 5 }}>Nombre del Grupo</Text>
                <TextInput
                  style={[styles.input, { color: '#FFF' }]}
                  placeholder="Ej. Vecinos Alerta"
                  value={newGroupName}
                  onChangeText={setNewGroupName}
                  placeholderTextColor="#AAA"
                />

                <Text style={{ color: '#FFF', marginBottom: 5, marginTop: 15 }}>Descripción (Opcional)</Text>
                <TextInput
                  style={[styles.input, { color: '#FFF' }]}
                  placeholder="Descripción breve..."
                  value={newGroupDesc}
                  onChangeText={setNewGroupDesc}
                  placeholderTextColor="#AAA"
                />

                <TouchableOpacity
                  style={[styles.createButton, { marginTop: 30, backgroundColor: '#00ACAC' }]}
                  onPress={handleCreateGroup}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#FFF" /> : (
                    <Text style={styles.createButtonText}>Crear Grupo</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View>
                <Text style={{ color: '#FFF', marginBottom: 5, textAlign: 'center' }}>Ingresa el código de 6 dígitos</Text>
                <TextInput
                  style={[styles.input, { color: '#FFF', textAlign: 'center', fontSize: 24, letterSpacing: 5 }]}
                  placeholder="000000"
                  value={joinCode}
                  onChangeText={(t) => setJoinCode(t.replace(/[^0-9]/g, '').slice(0, 6))}
                  placeholderTextColor="#555"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={[styles.createButton, { marginTop: 30, backgroundColor: '#00ACAC' }]}
                  onPress={handleJoinGroup}
                  disabled={loading}
                >
                  {loading ? <ActivityIndicator color="#FFF" /> : (
                    <Text style={styles.createButtonText}>Unirse al Grupo</Text>
                  )}
                </TouchableOpacity>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
        <CustomSidebar
          isOpen={isSidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AddGroup;