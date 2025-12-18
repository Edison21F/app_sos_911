import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather, Ionicons, MaterialCommunityIcons, FontAwesome5 } from "@expo/vector-icons";
import Header from "../../components/Header/Header";
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api/api';
import { theme } from '../../theme/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const API_BASE_URL = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : '';

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  // --- STATE ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const [clienteId, setClienteId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Phone Logic
  const [phoneList, setPhoneList] = useState([] as { id: number; detalle: string; numero: string }[]);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newPhoneDetail, setNewPhoneDetail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [editPhoneIndex, setEditPhoneIndex] = useState<number | null>(null);
  const [isSavingPhone, setIsSavingPhone] = useState(false);

  // Password
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Date
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Medical ID
  const [bloodType, setBloodType] = useState("");
  const [allergies, setAllergies] = useState("");
  const [conditions, setConditions] = useState("");
  const [medications, setMedications] = useState("");

  // --- EFFECT ---
  useEffect(() => {
    loadClientProfile();
  }, []);

  const loadClientProfile = async () => {
    try {
      const storedClienteId = await AsyncStorage.getItem('clienteId');
      if (!storedClienteId) return;
      setClienteId(storedClienteId);

      const response = await api.get(`/clientes/detalle/${storedClienteId}`);
      const data = response.data;
      if (data) {
        setFullName(data.nombre || '');
        setEmail(data.correo_electronico || '');
        setIdNumber(data.cedula_identidad || '');
        setAddress(data.direccion || '');
        setBirthDate(data.fecha_nacimiento ? data.fecha_nacimiento.split('T')[0] : '');
        if (data.foto_perfil) {
          const url = `${API_BASE_URL}/uploads/profiles/${data.foto_perfil}`;
          setProfileImage(url);
        }
        if (data.ficha_medica) {
          setBloodType(data.ficha_medica.tipo_sangre || '');
          setAllergies(data.ficha_medica.alergias || '');
          setConditions(data.ficha_medica.padecimiento || '');
          setMedications(data.ficha_medica.medicamentos || '');
        }
      }
      loadPhoneNumbers(storedClienteId);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  const loadPhoneNumbers = async (id: string) => {
    try {
      const res = await api.get(`/clientes_numeros/listar/por-cliente/${id}`);
      setPhoneList(res.data.map((p: any) => ({ id: p.id, detalle: p.nombre, numero: p.numero })));
    } catch (e) { }
  };

  // --- HANDLERS ---
  const handleEditPress = () => setIsEditing(true);

  const handleSavePress = async () => {
    try {
      setIsSaving(true);
      const payload: any = {
        nombre: fullName,
        correo_electronico: email,
        cedula_identidad: idNumber,
        direccion: address,
        fecha_nacimiento: birthDate,
        ficha_medica: {
          tipo_sangre: bloodType,
          alergias: allergies,
          padecimiento: conditions,
          medicamentos: medications
        }
      };
      if (password) payload.contrasena = password;

      await api.put(`/clientes/actualizar/${clienteId}`, payload);
      Alert.alert("Éxito", "Perfil actualizado correctamente");
      setIsEditing(false);
      setPassword("");
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) uploadImage(result.assets[0].uri);
  };

  const uploadImage = async (uri: string) => {
    // ... same logic as before ...
    try {
      const formData = new FormData();
      // @ts-ignore
      formData.append('foto_perfil', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: `profile_${clienteId}.jpg`,
        type: 'image/jpeg',
      });
      const response = await fetch(`${API_BASE_URL}/clientes/upload-profile/${clienteId}`, {
        method: 'POST', body: formData, headers: { 'Accept': 'application/json' }
      });
      const data = await response.json();
      if (response.ok && data.foto_perfil) {
        setProfileImage(`${API_BASE_URL}/uploads/profiles/${data.foto_perfil}`);
      }
    } catch (e) {
      Alert.alert("Error", "Falló subida de imagen");
    }
  };

  // Phone Handlers
  const openPhoneModal = (idx: number | null = null) => {
    setEditPhoneIndex(idx);
    if (idx !== null) {
      setNewPhone(phoneList[idx].numero);
      setNewPhoneDetail(phoneList[idx].detalle);
    } else {
      setNewPhone(""); setNewPhoneDetail("");
    }
    setShowPhoneModal(true);
  };

  const savePhone = async () => {
    if (!newPhone || !newPhoneDetail) return;
    try {
      setIsSavingPhone(true);
      if (editPhoneIndex !== null) {
        const p = phoneList[editPhoneIndex];
        await api.put(`/clientes_numeros/actualizar/${p.id}`, { nombre: newPhoneDetail, numero: newPhone, estado: 'activo' });
        const list = [...phoneList]; list[editPhoneIndex] = { ...p, numero: newPhone, detalle: newPhoneDetail };
        setPhoneList(list);
      } else {
        const res = await api.post('/clientes_numeros/crear', { clienteId, nombre: newPhoneDetail, numero: newPhone });
        setPhoneList([...phoneList, { id: res.data.clienteNumero.id, detalle: newPhoneDetail, numero: newPhone }]);
      }
      setShowPhoneModal(false);
    } catch (e) { Alert.alert("Error", "Falló guardar teléfono"); }
    finally { setIsSavingPhone(false); }
  };

  const deletePhoneHandler = (idx: number) => {
    Alert.alert("Borrar", "¿Eliminar teléfono?", [
      { text: "Cancelar" },
      {
        text: "Eliminar", style: 'destructive', onPress: async () => {
          try {
            await api.delete(`/clientes_numeros/eliminar/${phoneList[idx].id}`);
            setPhoneList(phoneList.filter((_, i) => i !== idx));
          } catch (e) { Alert.alert("Error"); }
        }
      }
    ]);
  };

  if (!clienteId || isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "US";

  return (
    <LinearGradient colors={theme.colors.gradientBackground} style={styles.container}>
      {/* Header Back Button Only */}
      <Header showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. Profile Display */}
        <Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.avatarSection}>
          <View style={styles.imageWrapper}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarPlaceholder}><Text style={styles.avatarText}>{getInitials(fullName)}</Text></View>
            )}
            <TouchableOpacity style={styles.cameraBtn} onPress={pickImage}>
              <Feather name="camera" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          <Text style={styles.nameText}>{fullName}</Text>
          <Text style={styles.emailText}>{email}</Text>
        </Animated.View>

        {/* 2. Info Cards */}
        <Animated.View entering={FadeInDown.delay(200).duration(500)}>

          {/* Personal Data */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="user" size={18} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Datos Personales</Text>
              {!isEditing && (
                <TouchableOpacity onPress={handleEditPress}>
                  <Text style={styles.editLink}>Editar</Text>
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Nombre</Text>
              <TextInput
                style={[styles.valueInput, isEditing && styles.inputEditing]}
                value={fullName}
                onChangeText={setFullName}
                editable={isEditing}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Cédula</Text>
              <TextInput
                style={[styles.valueInput, isEditing && styles.inputEditing]}
                value={idNumber}
                onChangeText={setIdNumber}
                editable={isEditing}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Nacimiento</Text>
              <TouchableOpacity onPress={() => isEditing && setShowDatePicker(true)} disabled={!isEditing}>
                <Text style={[styles.valueText, isEditing && { color: '#FFF' }]}>{birthDate || 'Sin definir'}</Text>
              </TouchableOpacity>
            </View>

            {isEditing && showDatePicker && (
              <DateTimePicker
                value={birthDate ? new Date(birthDate) : new Date()}
                mode="date"
                display="default"
                onChange={(e, d) => { setShowDatePicker(false); if (d) setBirthDate(format(d, 'yyyy-MM-dd')); }}
              />
            )}
          </View>

          {/* Medical ID Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <FontAwesome5 name="file-medical" size={18} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Ficha Médica</Text>
            </View>

            <View style={styles.fieldRow}>
              <Text style={styles.label}>Tipo de Sangre</Text>
              <TextInput
                style={[styles.valueInput, isEditing && styles.inputEditing]}
                value={bloodType}
                onChangeText={setBloodType}
                placeholder={isEditing ? "Ej: O+" : "No especificado"}
                placeholderTextColor="#666"
                editable={isEditing}
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Alergias</Text>
              <TextInput
                style={[styles.valueInput, isEditing && styles.inputEditing]}
                value={allergies}
                onChangeText={setAllergies}
                placeholder={isEditing ? "Ej: Penicilina, Nueces" : "Ninguna"}
                placeholderTextColor="#666"
                editable={isEditing}
                multiline
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Padecimientos / Condiciones</Text>
              <TextInput
                style={[styles.valueInput, isEditing && styles.inputEditing]}
                value={conditions}
                onChangeText={setConditions}
                placeholder={isEditing ? "Ej: Diabetes, Asma" : "Ninguno"}
                placeholderTextColor="#666"
                editable={isEditing}
                multiline
              />
            </View>
            <View style={styles.divider} />
            <View style={styles.fieldRow}>
              <Text style={styles.label}>Medicamentos</Text>
              <TextInput
                style={[styles.valueInput, isEditing && styles.inputEditing]}
                value={medications}
                onChangeText={setMedications}
                placeholder={isEditing ? "Ej: Insulina, inhalador" : "Ninguno"}
                placeholderTextColor="#666"
                editable={isEditing}
                multiline
              />
            </View>
          </View>

          {/* Phones Card */}
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Feather name="phone" size={18} color={theme.colors.primary} />
              <Text style={styles.cardTitle}>Teléfonos</Text>
              <TouchableOpacity onPress={() => openPhoneModal()}>
                <Feather name="plus-circle" size={18} color={theme.colors.primary} />
              </TouchableOpacity>
            </View>
            {phoneList.map((p, idx) => (
              <TouchableOpacity key={idx} style={styles.phoneRow} onLongPress={() => deletePhoneHandler(idx)} onPress={() => openPhoneModal(idx)}>
                <View style={styles.phoneIconBg}><Feather name="smartphone" size={14} color="#FFF" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.phoneLabel}>{p.detalle}</Text>
                  <Text style={styles.phoneValue}>{p.numero}</Text>
                </View>
                <Feather name="chevron-right" size={16} color="#666" />
              </TouchableOpacity>
            ))}
          </View>

          {/* Security */}
          {isEditing && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Feather name="lock" size={18} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Seguridad</Text>
              </View>
              <View style={styles.fieldRow}>
                <TextInput
                  style={[styles.valueInput, styles.inputEditing]}
                  placeholder="Nueva Contraseña"
                  placeholderTextColor="#666"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Options / Account Actions */}
          {!isEditing && (
            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Feather name="settings" size={18} color={theme.colors.primary} />
                <Text style={styles.cardTitle}>Cuenta y Opciones</Text>
              </View>

              {/* Location */}
              <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Location')}>
                <View style={[styles.phoneIconBg, { backgroundColor: 'rgba(46, 204, 113, 0.1)' }]}>
                  <Feather name="map-pin" size={16} color="#2ECC71" />
                </View>
                <Text style={styles.optionText}>Mi Ubicación</Text>
                <Feather name="chevron-right" size={18} color="#666" />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Historial */}
              <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('AlertHistory')}>
                <View style={[styles.phoneIconBg, { backgroundColor: 'rgba(255, 165, 0, 0.1)' }]}>
                  <Feather name="clock" size={16} color="#FFA500" />
                </View>
                <Text style={styles.optionText}>Historial de Alertas</Text>
                <Feather name="chevron-right" size={18} color="#666" />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Info */}
              <TouchableOpacity style={styles.optionRow} onPress={() => navigation.navigate('Information')}>
                <View style={[styles.phoneIconBg, { backgroundColor: 'rgba(52, 152, 219, 0.1)' }]}>
                  <Feather name="info" size={16} color="#3498DB" />
                </View>
                <Text style={styles.optionText}>Acerca de Nosotros</Text>
                <Feather name="chevron-right" size={18} color="#666" />
              </TouchableOpacity>

              <View style={styles.divider} />

              {/* Logout */}
              <TouchableOpacity style={styles.optionRow} onPress={async () => {
                const { CommonActions } = require('@react-navigation/native');
                await AsyncStorage.multiRemove(['clienteId', 'nombreUsuario', 'userToken']);
                navigation.dispatch(
                  CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'Login' }],
                  })
                );
              }}>
                <View style={[styles.phoneIconBg, { backgroundColor: 'rgba(231, 76, 60, 0.1)' }]}>
                  <Feather name="log-out" size={16} color="#E74C3C" />
                </View>
                <Text style={[styles.optionText, { color: '#E74C3C' }]}>Cerrar Sesión</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Action Buttons */}
          {isEditing && (
            <TouchableOpacity style={styles.saveBtn} onPress={handleSavePress} disabled={isSaving}>
              {isSaving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>Guardar Cambios</Text>}
            </TouchableOpacity>
          )}
        </Animated.View>
        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Phone Modal */}
      <Modal visible={showPhoneModal} transparent animationType="fade">
        <View style={styles.modalBg}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editPhoneIndex !== null ? 'Editar' : 'Agregar'} Teléfono</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Etiqueta (Casa, Trabajo...)"
              placeholderTextColor="#666"
              value={newPhoneDetail}
              onChangeText={setNewPhoneDetail}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="Número"
              placeholderTextColor="#666"
              keyboardType="phone-pad"
              value={newPhone}
              onChangeText={setNewPhone}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalBtnCancel} onPress={() => setShowPhoneModal(false)}>
                <Text style={styles.modalBtnTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalBtnSave} onPress={savePhone} disabled={isSavingPhone}>
                {isSavingPhone ? <ActivityIndicator color="#FFF" /> : <Text style={styles.modalBtnTextSave}>Guardar</Text>}
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </View>
      </Modal>

    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20 },
  avatarSection: { alignItems: 'center', marginBottom: 25 },
  imageWrapper: { position: 'relative', marginBottom: 15 },
  avatarImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: theme.colors.primary },
  avatarPlaceholder: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#333', justifyContent: 'center', alignItems: 'center', borderWidth: 3, borderColor: theme.colors.primary },
  avatarText: { fontSize: 30, color: '#FFF', fontWeight: 'bold' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: theme.colors.primary, padding: 8, borderRadius: 20 },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#FFF' },
  emailText: { fontSize: 14, color: '#aaa' },

  card: { backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: 16, padding: 15, marginBottom: 15, borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  cardTitle: { color: '#FFF', fontSize: 16, fontWeight: 'bold', marginLeft: 10, flex: 1 },
  editLink: { color: theme.colors.primary, fontSize: 14 },

  fieldRow: { marginBottom: 12 },
  label: { color: '#888', fontSize: 12, marginBottom: 4 },
  valueText: { color: '#FFF', fontSize: 16 },
  valueInput: { color: '#FFF', fontSize: 16, padding: 0 },
  inputEditing: { borderBottomWidth: 1, borderBottomColor: theme.colors.primary, paddingBottom: 5 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.1)', marginVertical: 10 },

  phoneRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8 },
  phoneIconBg: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  phoneLabel: { color: '#aaa', fontSize: 12 },
  phoneValue: { color: '#FFF', fontSize: 15 },

  saveBtn: { backgroundColor: theme.colors.primary, padding: 15, borderRadius: 12, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },

  // Modal
  modalBg: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1A1A1A', padding: 20, borderRadius: 20 },
  modalTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  modalInput: { backgroundColor: 'rgba(255,255,255,0.1)', color: '#FFF', padding: 12, borderRadius: 10, marginBottom: 15 },
  modalActions: { flexDirection: 'row', gap: 10 },
  modalBtnCancel: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center' },
  modalBtnSave: { flex: 1, padding: 12, borderRadius: 10, backgroundColor: theme.colors.primary, alignItems: 'center' },
  modalBtnTextCancel: { color: '#FFF' },
  modalBtnTextSave: { color: '#FFF', fontWeight: 'bold' },

  // Options Styles
  optionRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12 },
  optionText: { color: '#FFF', fontSize: 16, flex: 1, marginLeft: 12 },
});

export default ProfileScreen;