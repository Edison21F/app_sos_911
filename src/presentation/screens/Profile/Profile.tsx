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
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../styles/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useProfileViewModel } from '../../hooks/useProfileViewModel';

const { width } = Dimensions.get('window');

const ProfileScreen = () => {
  const navigation = useNavigation<any>();
  const {
    client,
    phones,
    isLoading,
    isSaving,
    loadProfile,
    updateProfile,
    uploadImage,
    addPhone,
    updatePhone,
    deletePhone,
    logout
  } = useProfileViewModel();

  // --- LOCAL STATE FOR EDITING ---
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");

  // Edit Mode
  const [isEditing, setIsEditing] = useState(false);

  // Phone Logic
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newPhoneDetail, setNewPhoneDetail] = useState("");
  const [editPhoneIndex, setEditPhoneIndex] = useState<number | null>(null);
  const [isSavingPhone, setIsSavingPhone] = useState(false); // Local loading for phone modal

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

  // Sync state when client data loads
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    if (client) {
      setFullName(client.name || "");
      setEmail(client.email || "");
      setIdNumber(client.identityCard || "");
      setAddress(client.address || "");
      setBirthDate(client.birthDate ? client.birthDate.split('T')[0] : "");
      if (client.medicalRecord) {
        setBloodType(client.medicalRecord.bloodType || "");
        setAllergies(client.medicalRecord.allergies || "");
        setConditions(client.medicalRecord.conditions || "");
        setMedications(client.medicalRecord.medications || "");
      }
    }
  }, [client]);

  // --- HANDLERS ---
  const handleEditPress = () => setIsEditing(true);

  const handleSavePress = async () => {
    const success = await updateProfile({
      name: fullName,
      email: email,
      idNumber: idNumber,
      address: address,
      birthDate: birthDate,
      password: password || undefined,
      medicalRecord: {
        bloodType,
        allergies,
        conditions,
        medications
      }
    });
    if (success) {
      setIsEditing(false);
      setPassword("");
    }
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    console.log('pickImage: result:', JSON.stringify(result));
    if (!result.canceled && result.assets && result.assets.length > 0) {
      console.log('pickImage: selected image URI:', result.assets[0].uri);
      await uploadImage(result.assets[0].uri);
    } else {
      console.log('pickImage: no image selected or result.canceled');
    }
  };

  // Phone Handlers
  const openPhoneModal = (idx: number | null = null) => {
    setEditPhoneIndex(idx);
    if (idx !== null) {
      setNewPhone(phones[idx].number);
      setNewPhoneDetail(phones[idx].detail);
    } else {
      setNewPhone(""); setNewPhoneDetail("");
    }
    setShowPhoneModal(true);
  };

  const savePhoneHandler = async () => {
    if (!newPhone || !newPhoneDetail) return;
    setIsSavingPhone(true);
    let success = false;
    if (editPhoneIndex !== null) {
      success = (await updatePhone(phones[editPhoneIndex].id, newPhoneDetail, newPhone)) || false;
    } else {
      success = (await addPhone(newPhoneDetail, newPhone)) || false;
    }
    setIsSavingPhone(false);
    if (success) setShowPhoneModal(false);
  };

  const deletePhoneHandler = (idx: number) => {
    Alert.alert("Borrar", "¿Eliminar teléfono?", [
      { text: "Cancelar" },
      {
        text: "Eliminar", style: 'destructive', onPress: async () => {
          await deletePhone(phones[idx].id);
        }
      }
    ]);
  };

  const handleLogout = async () => {
    await logout();
    const { CommonActions } = require('@react-navigation/native');
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      })
    );
  };

  if (isLoading) { // Changed to only check isLoading, initially client might be null
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  // Safe check for client before render if not loading
  if (!client && !isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#fff' }}>Error cargando perfil</Text>
        <TouchableOpacity onPress={loadProfile} style={{ marginTop: 20, padding: 10, backgroundColor: theme.colors.primary, borderRadius: 8 }}>
          <Text style={{ color: '#fff' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const getInitials = (name: string) => name ? name.substring(0, 2).toUpperCase() : "US";

  return (
    <LinearGradient colors={theme.colors.gradientBackground} style={styles.container}>
      <Header showBackButton onBackPress={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

       {/* 1. Profile Display */}
<Animated.View entering={FadeInDown.delay(100).duration(500)} style={styles.avatarSection}>
  <View style={styles.imageWrapper}>
    {client!.profileImage ? (
      <Image
        key={client!.profileImage}
        source={{
          uri: `${client!.profileImage}?t=${Date.now()}`
        }}
        style={styles.avatarImage}
      />
    ) : (
      <View style={styles.avatarPlaceholder}>
        <Text style={styles.avatarText}>{getInitials(fullName)}</Text>
      </View>
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
            {phones.map((p, idx) => (
              <TouchableOpacity key={idx} style={styles.phoneRow} onLongPress={() => deletePhoneHandler(idx)} onPress={() => openPhoneModal(idx)}>
                <View style={styles.phoneIconBg}><Feather name="smartphone" size={14} color="#FFF" /></View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.phoneLabel}>{p.detail}</Text>
                  <Text style={styles.phoneValue}>{p.number}</Text>
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
              <TouchableOpacity style={styles.optionRow} onPress={handleLogout}>
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
              <TouchableOpacity style={styles.modalBtnSave} onPress={savePhoneHandler} disabled={isSavingPhone}>
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