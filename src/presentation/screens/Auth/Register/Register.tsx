// Register.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RegisterStyles } from './RegisterStyles';
import { RegisterScreenNavigationProp } from '../../../navigation/Navigator';
import { theme } from '../../../styles/theme'; // Verified path
import { useRegisterViewModel } from '../../../hooks/useRegisterViewModel';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Application from 'expo-application';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen() {
  const navigation = useNavigation<RegisterScreenNavigationProp>();
  const { register, isLoading } = useRegisterViewModel(navigation);

  const [formData, setFormData] = useState({
    nombre: '',
    correo_electronico: '',
    cedula_identidad: '',
    direccion: '',
    contrasena: '',
    fecha_nacimiento: '',
    estado: 'activo' as 'activo' | 'inactivo',
    numero_ayudas: 0,
    estado_eliminado: 'activo' as 'activo' | 'eliminado',
  });

  const [showPassword, setShowPassword] = useState(false);

  // Obtener datos del dispositivo
  const getDeviceInfo = async () => {
    let deviceId = null;
    let modelo_dispositivo = '';
    if (Platform.OS === 'android') {
      deviceId = await Application.getAndroidId();
      modelo_dispositivo = Device.modelName || 'Android';
    } else if (Platform.OS === 'ios') {
      deviceId = await Application.getIosIdForVendorAsync();
      modelo_dispositivo = Device.modelName || 'iPhone';
    }
    return { deviceId, modelo_dispositivo };
  };

  const handleRegister = async () => {
    try {
      if (!formData.nombre || !formData.correo_electronico || !formData.contrasena || !formData.cedula_identidad || !formData.direccion || !formData.fecha_nacimiento) {
        Alert.alert('Error', 'Por favor completa todos los campos obligatorios.');
        return;
      }

      await AsyncStorage.removeItem('deviceId');
      await AsyncStorage.removeItem('clienteId');
      await AsyncStorage.removeItem('autoLoginEnabled');

      const { deviceId, modelo_dispositivo } = await getDeviceInfo();
      if (!deviceId || !modelo_dispositivo) {
        Alert.alert('Error', 'No se pudo obtener la información del dispositivo.');
        return;
      }

      const tipo_dispositivo = Platform.OS === 'android' ? 'Android' : 'iOS';
      const dataToSend = {
        name: formData.nombre,
        email: formData.correo_electronico,
        identityCard: formData.cedula_identidad,
        address: formData.direccion,
        birthDate: formData.fecha_nacimiento,
        password: formData.contrasena,
        // Optional/Extra fields that might be used by backend implementation details
        contrasena: formData.contrasena,
        deviceId,
        tipo_dispositivo,
        modelo_dispositivo,
        // Include other formData properties if needed, but explicitly mapped ones satisfy the interface
        estado: formData.estado,
        numero_ayudas: formData.numero_ayudas,
        estado_eliminado: formData.estado_eliminado
      };

      await register(dataToSend);

    } catch (error: any) {
      console.error('Error al registrar:', error);
      // Main error handling is in ViewModel
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={RegisterStyles.gradientBackground}
    >
      <SafeAreaView style={RegisterStyles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#00ACAC" />

        <TouchableOpacity
          style={RegisterStyles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-left" size={28} color="#fff" />
        </TouchableOpacity>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={RegisterStyles.keyboardAvoidingView}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={RegisterStyles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={RegisterStyles.headerContainer}>
                <Text style={RegisterStyles.title}>Crear Cuenta</Text>
                <Text style={RegisterStyles.subtitle}>
                  Completa tus datos para comenzar
                </Text>
              </View>

              <View style={RegisterStyles.formContainer}>
                <View style={RegisterStyles.inputGroup}>
                  <Text style={RegisterStyles.label}>Nombre completo *</Text>
                  <View style={RegisterStyles.inputWithIcon}>
                    <Icon name="account" size={20} color="#999" style={RegisterStyles.icon} />
                    <TextInput
                      style={RegisterStyles.inputField}
                      placeholder="Nombre"
                      placeholderTextColor="#999"
                      value={formData.nombre}
                      onChangeText={(text) => setFormData({ ...formData, nombre: text })}
                      returnKeyType="next"
                      autoCorrect={false}
                    />
                  </View>
                </View>

                <View style={RegisterStyles.inputGroup}>
                  <Text style={RegisterStyles.label}>Correo electrónico *</Text>
                  <View style={RegisterStyles.inputWithIcon}>
                    <Icon name="email" size={20} color="#999" style={RegisterStyles.icon} />
                    <TextInput
                      style={RegisterStyles.inputField}
                      placeholder="Correo"
                      placeholderTextColor="#999"
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoCorrect={false}
                      value={formData.correo_electronico}
                      onChangeText={(text) =>
                        setFormData({ ...formData, correo_electronico: text })
                      }
                      returnKeyType="next"
                    />
                  </View>
                </View>

                <View style={RegisterStyles.inputGroup}>
                  <Text style={RegisterStyles.label}>Cédula *</Text>
                  <View style={RegisterStyles.inputWithIcon}>
                    <Icon name="credit-card-outline" size={20} color="#999" style={RegisterStyles.icon} />
                    <TextInput
                      style={RegisterStyles.inputField}
                      placeholder="Cédula"
                      placeholderTextColor="#999"
                      value={formData.cedula_identidad}
                      onChangeText={(text) =>
                        setFormData({ ...formData, cedula_identidad: text })
                      }
                      returnKeyType="next"
                    />
                  </View>
                </View>

                <View style={RegisterStyles.inputGroup}>
                  <Text style={RegisterStyles.label}>Dirección *</Text>
                  <View style={RegisterStyles.inputWithIcon}>
                    <Icon name="map-marker" size={20} color="#999" style={RegisterStyles.icon} />
                    <TextInput
                      style={RegisterStyles.inputField}
                      placeholder="Dirección"
                      placeholderTextColor="#999"
                      value={formData.direccion}
                      onChangeText={(text) =>
                        setFormData({ ...formData, direccion: text })
                      }
                      returnKeyType="next"
                    />
                  </View>
                </View>

                {/* NUEVO CAMPO: Fecha de Nacimiento */}
                <View style={RegisterStyles.inputGroup}>
                  <Text style={RegisterStyles.label}>Fecha de Nacimiento *</Text>
                  <View style={RegisterStyles.inputWithIcon}>
                    <Icon name="calendar" size={20} color="#999" style={RegisterStyles.icon} />
                    <TextInput
                      style={RegisterStyles.inputField}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#999"
                      value={formData.fecha_nacimiento}
                      onChangeText={(text) =>
                        setFormData({ ...formData, fecha_nacimiento: text })
                      }
                      returnKeyType="next"
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <View style={RegisterStyles.inputGroup}>
                  <Text style={RegisterStyles.label}>Contraseña *</Text>
                  <View style={RegisterStyles.passwordContainer}>
                    <Icon name="lock" size={20} color="#999" style={RegisterStyles.icon} />
                    <TextInput
                      style={RegisterStyles.passwordInput}
                      placeholder="Contraseña"
                      placeholderTextColor="#999"
                      secureTextEntry={!showPassword}
                      value={formData.contrasena}
                      onChangeText={(text) =>
                        setFormData({ ...formData, contrasena: text })
                      }
                      returnKeyType="done"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={RegisterStyles.passwordToggle}
                    >
                      <Icon
                        name={showPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color="#999"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity
                  style={RegisterStyles.registerButton}
                  onPress={handleRegister}
                  activeOpacity={0.7}
                  disabled={isLoading}
                >
                  <Text style={RegisterStyles.registerButtonText}>
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                  </Text>
                </TouchableOpacity>

                <View style={RegisterStyles.loginContainer}>
                  <Text style={RegisterStyles.loginText}>¿Ya tienes una cuenta?</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={RegisterStyles.loginLink}>Iniciar sesión</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
