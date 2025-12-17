import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Modal, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from "react-native";
import { styles } from "./profileStyles";
import { AntDesign } from "@expo/vector-icons";
import Header from "../../components/Header/Header";
import CustomSidebar from "../../components/Sidebar/Sidebar";
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import api from '../../api/api';
import { theme } from '../../theme/theme';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

// Base URL for images - Adjust as per your environment
// Assuming the API base URL is something like http://IP:PORT/api
// we need to construct the image URL.
// If api.defaults.baseURL is "http://192.168.100.225:4000/api",
// then images are at "http://192.168.100.225:4000/uploads/profiles/..."
const API_BASE_URL = api.defaults.baseURL ? api.defaults.baseURL.replace('/api', '') : '';

const ProfileScreen = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [clienteId, setClienteId] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null); // State for profile image
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false); // State for image upload
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [newPhone, setNewPhone] = useState("");
  const [newPhoneDetail, setNewPhoneDetail] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneList, setPhoneList] = useState([] as { id: number; detalle: string; numero: string }[]);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [editPhoneIndex, setEditPhoneIndex] = useState<number | null>(null);
  const [isLoadingPhones, setIsLoadingPhones] = useState(false);
  const [isSavingPhone, setIsSavingPhone] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);


  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setBirthDate(format(selectedDate, 'yyyy-MM-dd'));
    }
  };

  // Cargar datos del cliente al inicializar
  useEffect(() => {
    const loadClientProfile = async () => {
      try {
        setIsLoading(true);

        const storedClienteId = await AsyncStorage.getItem('clienteId');
        if (!storedClienteId) {
          Alert.alert('Error', 'No se encontró la sesión del cliente.');
          return;
        }

        setClienteId(storedClienteId);

        // Fetch client data
        const response = await api.get(`/clientes/detalle/${storedClienteId}`);
        const clienteData = response.data;

        if (clienteData) {
          console.log('Datos del cliente cargados:', clienteData);
          console.log('Foto perfil en datos:', clienteData.foto_perfil);

          const nombre = clienteData.nombre || '';
          const correo = clienteData.correo_electronico || '';
          const cedula = clienteData.cedula_identidad || '';
          const direccion = clienteData.direccion || '';
          const fechaNacimiento = clienteData.fecha_nacimiento ? clienteData.fecha_nacimiento.split('T')[0] : '';

          setFullName(nombre);
          setEmail(correo);
          setOriginalEmail(correo);
          setIdNumber(cedula);
          setAddress(direccion);
          setBirthDate(fechaNacimiento);

          if (clienteData.foto_perfil) {
            const imageUrl = `${API_BASE_URL}/uploads/profiles/${clienteData.foto_perfil}`;
            console.log('Constructed Profile Image URL:', imageUrl);
            setProfileImage(imageUrl);
          } else {
            console.log('No profile picture set in backend data.');
          }


          if (!correo.trim()) {
            Alert.alert(
              'Perfil incompleto',
              'Tu perfil no tiene un correo electrónico registrado. Por favor actualízalo.',
              [{ text: 'OK' }]
            );
          }
        } else {
          Alert.alert('Error', 'No se pudieron cargar los datos del perfil');
        }

        // Load phone numbers
        await loadPhoneNumbers(storedClienteId);

      } catch (error) {
        console.error('Error al cargar perfil del cliente:', error);
        Alert.alert('Error', 'Error inesperado al cargar el perfil');
      } finally {
        setIsLoading(false);
      }
    };

    loadClientProfile();
  }, []);

  // Función para cargar números de teléfono
  const loadPhoneNumbers = async (clienteIdParam: string) => {
    try {
      setIsLoadingPhones(true);
      const response = await api.get(`/clientes_numeros/listar/por-cliente/${clienteIdParam}`);

      const mappedPhones = response.data.map((p: any) => ({
        id: p.id,
        detalle: p.nombre, // Mapping 'nombre' from backend as 'detalle' in frontend
        numero: p.numero
      }));
      setPhoneList(mappedPhones);
    } catch (error) {
      console.error('Error al cargar números de teléfono:', error);
      // Don't clear list on error to avoid flashing empty state if intermittent
    } finally {
      setIsLoadingPhones(false);
    }
  };

  // Función para validar el teléfono
  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{7,15}$/;
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return phoneRegex.test(phone) && cleanPhone.length >= 7 && cleanPhone.length <= 15;
  };

  const addPhone = async () => {
    if (!clienteId) return;

    if (!newPhone.trim() || !newPhoneDetail.trim()) {
      setPhoneError("Por favor completa todos los campos");
      return;
    }

    if (!validatePhone(newPhone)) {
      setPhoneError("Formato de teléfono inválido");
      return;
    }

    try {
      setIsSavingPhone(true);

      const payload = {
        clienteId: clienteId,
        nombre: newPhoneDetail.trim(),
        numero: newPhone.trim()
      };

      const response = await api.post('/clientes_numeros/crear', payload);

      const newPhoneData = response.data.clienteNumero;
      const newPhoneEntry = {
        id: newPhoneData.id,
        detalle: newPhoneData.nombre,
        numero: newPhoneData.numero
      };

      setPhoneList(prev => [...prev, newPhoneEntry]);

      setNewPhone("");
      setNewPhoneDetail("");
      setPhoneError("");
      setShowPhoneModal(false);

      Alert.alert('Éxito', 'Número de teléfono agregado correctamente.');

    } catch (error: any) {
      console.error('Error al agregar teléfono:', error);
      const msg = error.response?.data?.message || 'No se pudo agregar el número.';
      setPhoneError(msg);
    } finally {
      setIsSavingPhone(false);
    }
  };

  const editPhone = async () => {
    if (!clienteId || editPhoneIndex === null) return;

    if (!newPhone.trim() || !newPhoneDetail.trim()) {
      setPhoneError("Por favor completa todos los campos");
      return;
    }

    if (!validatePhone(newPhone)) {
      setPhoneError("Formato de teléfono inválido");
      return;
    }

    const phoneToEdit = phoneList[editPhoneIndex];

    try {
      setIsSavingPhone(true);

      const payload = {
        nombre: newPhoneDetail.trim(),
        numero: newPhone.trim(),
        estado: 'activo'
      };

      await api.put(`/clientes_numeros/actualizar/${phoneToEdit.id}`, payload);

      const updatedPhoneList = [...phoneList];
      updatedPhoneList[editPhoneIndex] = {
        ...phoneToEdit,
        numero: newPhone.trim(),
        detalle: newPhoneDetail.trim()
      };
      setPhoneList(updatedPhoneList);

      setNewPhone("");
      setNewPhoneDetail("");
      setPhoneError("");
      setShowPhoneModal(false);
      setEditPhoneIndex(null);

      Alert.alert('Éxito', 'Número de teléfono actualizado correctamente');

    } catch (error: any) {
      console.error('Error al actualizar teléfono:', error);
      const msg = error.response?.data?.message || 'No se pudo actualizar el número.';
      setPhoneError(msg);
    } finally {
      setIsSavingPhone(false);
    }
  };

  const deletePhone = (index: number) => {
    const phoneToDelete = phoneList[index];

    Alert.alert(
      'Confirmar eliminación',
      `¿Estás seguro de que deseas eliminar el número ${phoneToDelete.numero}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await api.delete(`/clientes_numeros/eliminar/${phoneToDelete.id}`);

              const updatedPhoneList = phoneList.filter((_, i) => i !== index);
              setPhoneList(updatedPhoneList);

              Alert.alert('Éxito', 'Número de teléfono eliminado correctamente.');

            } catch (error) {
              console.error('Error al eliminar teléfono:', error);
              Alert.alert('Error', 'No se pudo eliminar el número de teléfono.');
            }
          }
        }
      ]
    );
  };

  const openAddPhoneModal = () => {
    setNewPhone("");
    setNewPhoneDetail("");
    setPhoneError("");
    setEditPhoneIndex(null);
    setShowPhoneModal(true);
  };

  const openEditPhoneModal = (index: number) => {
    const phone = phoneList[index];
    setNewPhone(phone.numero);
    setNewPhoneDetail(phone.detalle);
    setPhoneError("");
    setEditPhoneIndex(index);
    setShowPhoneModal(true);
  };

  const closePhoneModal = () => {
    setShowPhoneModal(false);
    setNewPhone("");
    setNewPhoneDetail("");
    setPhoneError("");
    setEditPhoneIndex(null);
  };

  const handleSavePhone = () => {
    if (editPhoneIndex !== null) {
      editPhone();
    } else {
      addPhone();
    }
  };

  const pickImage = async () => {
    console.log("pickImage button pressed"); // DEBUG LOG
    // Request permission
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permiso denegado", "Se requiere permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Using deprecated Options because MediaType fails to open gallery
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      console.log("Image picked, starting upload for URI:", result.assets[0].uri); // DEBUG LOG
      uploadImage(result.assets[0].uri);
    } else {
      console.log("Image picker canceled");
    }
  };

  const uploadImage = async (uri: string) => {
    if (!clienteId) return;

    setIsUploadingImage(true);

    try {
      const formData = new FormData();

      // @ts-ignore
      formData.append('foto_perfil', {
        uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
        name: `profile_${clienteId}.jpg`,
        type: 'image/jpeg',
      });

      // Using fetch instead of axios for better FormData handling in React Native
      const response = await fetch(`${API_BASE_URL}/clientes/upload-profile/${clienteId}`, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          // Do NOT set Content-Type header, let fetch set it with the boundary
        },
      });

      const responseData = await response.json();

      if (response.ok && responseData.foto_perfil) {
        setProfileImage(`${API_BASE_URL}/uploads/profiles/${responseData.foto_perfil}`);
        Alert.alert("Éxito", "Foto de perfil actualizada.");
      } else {
        throw new Error(responseData.message || 'Error al subir la imagen');
      }

    } catch (error: any) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", error.message || "No se pudo actualizar la foto de perfil.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleEditPress = () => {
    setIsEditing(true);
  };

  const handleSavePress = async () => {
    if (!clienteId) return;

    try {
      setIsSaving(true);

      if (!fullName.trim() || !email.trim() || !idNumber.trim() || !birthDate.trim()) {
        Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email.trim())) {
        Alert.alert('Error', 'El formato del correo electrónico no es válido');
        return;
      }

      const payload: any = {
        nombre: fullName.trim(),
        correo_electronico: email.trim(),
        cedula_identidad: idNumber.trim(),
        direccion: address.trim(),
        fecha_nacimiento: birthDate.trim()
      };

      if (password.trim()) {
        payload.contrasena = password.trim();
      }

      await api.put(`/clientes/actualizar/${clienteId}`, payload);

      setOriginalEmail(email.trim());
      Alert.alert('Éxito', 'Perfil actualizado correctamente', [
        {
          text: 'OK',
          onPress: () => {
            setIsEditing(false);
            setPassword('');
          }
        }
      ]);

    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      const msg = error.response?.data?.message || 'No se pudo actualizar el perfil';
      Alert.alert('Error', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };


  const getInitials = (name: string) => {
    if (!name) return '';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // Si está cargando, mostrar indicador
  if (isLoading) {
    return (
      <LinearGradient
        colors={['#026b6b', '#2D353C']}
        style={styles.backgroundImage}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.container}>
          <Header onMenuPress={() => setSidebarOpen(true)} customTitle="Ver Perfil" />
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', marginTop: 16, fontSize: 16 }}>
              Cargando perfil...
            </Text>
          </View>
        </View>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground} // Updated to use theme
      style={styles.backgroundImage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.container}>
        <Header onMenuPress={() => setSidebarOpen(true)} customTitle="Ver Perfil" />

        <View style={styles.profileContainer}>
          <View style={{ alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <View style={[styles.profileAvatar, profileImage ? { backgroundColor: 'transparent', borderWidth: 0 } : {}]}>
              {profileImage ? (
                <Image source={{ uri: profileImage }} style={styles.profileImage} />
              ) : (
                <Text style={styles.profileAvatarText}>{getInitials(fullName)}</Text>
              )}
            </View>

            {/* Camera Icon Button for Profile Picture */}
            <TouchableOpacity
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                backgroundColor: theme.colors.primary,
                borderRadius: 20,
                padding: 8,
                elevation: 5
              }}
              onPress={pickImage}
              disabled={isUploadingImage}
            >
              {isUploadingImage ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Feather name="camera" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>

          {!isEditing ? (
            <TouchableOpacity style={[styles.editButton, styles.editButtonStyled]} onPress={handleEditPress}>
              <Feather name="edit" size={18} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.editButtonText}>Editar Perfil</Text>
            </TouchableOpacity>
          ) : null}
        </View>


        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.form}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.label}>Nombre completo</Text>
          <TextInput
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
            editable={isEditing}
            placeholder="Ingresa tu nombre completo"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />

          <Text style={styles.label}>Correo electrónico</Text>
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            editable={isEditing}
            keyboardType="email-address"
            placeholder="Ingresa tu correo electrónico"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />

          <Text style={styles.label}>Número de identificación</Text>
          <TextInput
            style={styles.input}
            value={idNumber}
            onChangeText={setIdNumber}
            editable={isEditing}
            keyboardType="numeric"
            placeholder="Ingresa tu número de identificación"
            placeholderTextColor="rgba(255, 255, 255, 0.7)"
          />

          {/* New field: Fecha de Nacimiento */}
          <Text style={styles.label}>Fecha de Nacimiento</Text>
          <TouchableOpacity onPress={() => isEditing && setShowDatePicker(true)} disabled={!isEditing}>
            <View pointerEvents="none">
              <TextInput
                style={styles.input}
                value={birthDate}
                editable={false} // Disable direct text input
                placeholder="AAAA-MM-DD"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
              />
            </View>
          </TouchableOpacity>
          {showDatePicker && (
            <DateTimePicker
              value={birthDate ? new Date(birthDate) : new Date()}
              mode="date"
              display="default"
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}

          <View style={styles.phoneSectionContainer}>
            <Text style={styles.phoneSectionTitleText}>Teléfono</Text>
            {isLoadingPhones ? (
              <View style={styles.phoneLoadingView}>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.phoneLoadingMessage}>Cargando números...</Text>
              </View>
            ) : phoneList.length > 0 ? (
              phoneList.map((item, idx) => (
                <TouchableOpacity
                  key={item.id || idx} // Use item.id for key if available, fallback to idx
                  style={styles.phoneItemContainer}
                  onPress={() => openEditPhoneModal(idx)}
                  onLongPress={() => deletePhone(idx)}
                >
                  <Text style={styles.phoneItemTitleText}>{item.detalle}:</Text>
                  <Text style={styles.phoneItemNumberText}>{item.numero}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <View style={styles.noPhoneContainer}>
                <Text style={styles.noPhoneText}>No hay números registrados</Text>
              </View>
            )}
          </View>

          {isEditing && (
            <>
              <Text style={styles.label}>Nueva contraseña</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={isEditing}
                placeholder="Nueva contraseña"
                placeholderTextColor="rgba(255, 255, 255, 0.7)"
              />
            </>
          )}

          {isEditing && (
            <TouchableOpacity
              style={[
                styles.button,
                styles.saveButtonEdit,
                isSaving ? styles.saveButtonEditDisabled : null
              ]}
              onPress={handleSavePress}
              disabled={isSaving}
            >
              {isSaving ? (
                <>
                  <ActivityIndicator size="small" color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Guardando...</Text>
                </>
              ) : (
                <>
                  <Feather name="check-circle" size={18} color="#fff" style={{ marginRight: 8 }} />
                  <Text style={styles.buttonText}>Guardar</Text>
                </>
              )}
            </TouchableOpacity>
          )}
        </ScrollView>

        <View style={styles.addPhoneSection}>
          <Text style={styles.addPhonePrompt}>
            {phoneList.length === 0 ? '¿Quieres agregar un número de teléfono?' : '¿Quieres agregar otro número?'}
          </Text>
          <TouchableOpacity
            style={styles.addPhoneBtn}
            onPress={openAddPhoneModal}
          >
            <Feather name="phone" size={20} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.addPhoneBtnText}>Agregar Teléfono</Text>
          </TouchableOpacity>
        </View>

        <Modal
          visible={showPhoneModal}
          animationType="fade"
          transparent
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.modalKeyboardAvoidingView}
          >
            <View style={styles.modalContentContainer}>
              <Text style={styles.modalTitleText}>{typeof editPhoneIndex === 'number' ? 'Editar Teléfono' : 'Agregar Teléfono'}</Text>
              {/* Campo Detalle */}
              <View style={styles.modalInputContainer}>
                <Feather name="tag" size={20} color="#137C6B" style={styles.modalInputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Detalle (Ej: Principal)"
                  placeholderTextColor="#aaa"
                  value={newPhoneDetail}
                  onChangeText={setNewPhoneDetail}
                  maxLength={20}
                />
              </View>

              <View style={styles.modalInputContainer}>
                <Feather name="phone" size={20} color="#137C6B" style={styles.modalInputIcon} />
                <TextInput
                  style={styles.modalInput}
                  placeholder="Número de teléfono"
                  placeholderTextColor="#aaa"
                  keyboardType="phone-pad"
                  value={newPhone}
                  onChangeText={setNewPhone}
                  maxLength={15}
                />
              </View>
              {phoneError ? <Text style={{ color: 'red', marginBottom: 8 }}>{phoneError}</Text> : null}
              <TouchableOpacity
                style={styles.modalSaveBtn}
                onPress={handleSavePhone}
                disabled={isSavingPhone}
              >
                {isSavingPhone ? (
                  <ActivityIndicator size="small" color="#fff" style={styles.modalSaveBtnIcon} />
                ) : (
                  <Feather name="plus" size={18} color="#fff" style={styles.modalSaveBtnIcon} />
                )}
                <Text style={styles.modalSaveBtnText}>
                  {isSavingPhone ? 'Guardando...' : (typeof editPhoneIndex === 'number' ? 'Guardar Cambios' : 'Guardar')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={closePhoneModal}
              >
                <Feather name="x-circle" size={18} color="#137C6B" style={styles.modalCancelBtnIcon} />
                <Text style={styles.modalCancelBtnText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Modal>
      </View>
      <CustomSidebar isOpen={isSidebarOpen} onClose={() => setSidebarOpen(false)} />
    </LinearGradient>
  );
};

const localStyles = StyleSheet.create({
  profileImageContainer: {
    position: "relative",
  },
});

export default ProfileScreen;