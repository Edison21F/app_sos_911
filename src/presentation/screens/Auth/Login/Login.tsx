// Login.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthViewModel } from '../../../hooks/useAuthViewModel';
import { LoginScreenNavigationProp } from '../../../navigation/Navigator';
import { LoginStyles } from './LoginStyles';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../../styles/theme';

export default function LoginScreen() {
  const navigation = useNavigation<LoginScreenNavigationProp>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [autoLoggingIn, setAutoLoggingIn] = useState(false);
  const { login, isLoading, getCsrfToken } = useAuthViewModel();

  // Obtener un nuevo token CSRF al entrar a la pantalla de Login
  useEffect(() => {
    getCsrfToken();
  }, [getCsrfToken]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingrese email y contraseña');
      return;
    }

    const success = await login({ email, password });

    if (success) {
      Alert.alert('Éxito', 'Inicio de sesión exitoso', [
        {
          text: 'OK',
          onPress: () => navigation.reset({ index: 0, routes: [{ name: 'Home' }] })
        }
      ]);
    } else {
      Alert.alert('Error', 'Credenciales incorrectas o error de conexión');
    }
  };

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={LoginStyles.backgroundGradient}
    >
      <SafeAreaView style={LoginStyles.container}>
        <View style={LoginStyles.logoContainer}>
          <Image
            source={require('../../../../assets/logo/icon.png')}
            style={LoginStyles.logo}
            resizeMode="contain"
          />
          <Text style={LoginStyles.title}>
            <Text style={LoginStyles.sosText}>Sos</Text>
            <Text style={LoginStyles.nineElevenText}>911</Text>
          </Text>
          <Text style={LoginStyles.subtitle}>Inicia sesión para continuar</Text>
        </View>

        <View style={LoginStyles.inputContainer}>
          <View style={LoginStyles.inputWrapper}>
            <Icon name="email" size={20} color="#999" style={LoginStyles.icon} />
            <TextInput
              placeholder="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              style={LoginStyles.inputField}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholderTextColor="#999"
            />
          </View>

          <View style={LoginStyles.inputWrapper}>
            <Icon name="lock" size={20} color="#999" style={LoginStyles.icon} />
            <TextInput
              placeholder="Contraseña"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              style={LoginStyles.inputField}
              autoCapitalize="none"
              placeholderTextColor="#999"
            />
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            style={LoginStyles.loginButton}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={LoginStyles.loginButtonText}>Iniciar Sesión</Text>
            )}
          </TouchableOpacity>

          <View style={LoginStyles.registerContainer}>
            <Text style={LoginStyles.registerText}>¿No tienes una cuenta?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={LoginStyles.registerLink}>Regístrate</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
