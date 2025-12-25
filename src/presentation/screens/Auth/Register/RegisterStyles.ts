// RegisterStyles.ts

import { StyleSheet, Dimensions, Platform } from 'react-native';
import { theme } from '../../../styles/theme';

const { width, height } = Dimensions.get('window');


export const RegisterStyles = StyleSheet.create({
  // Contenedor principal de la pantalla.
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },


  keyboardAvoidingView: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 90 : 65,
  },


  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 50,
    justifyContent: 'flex-start',
  },

  headerContainer: {
    paddingBottom: 20,
    alignItems: 'center',
  },

  // Estilo del título principal.
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.text, // Blanco
    marginBottom: 10,
  },

  // Estilo del subtítulo.
  subtitle: {
    fontSize: 16,
    color: theme.colors.textSecondary, // Gris claro
    textAlign: 'center',
    paddingHorizontal: 10,
    lineHeight: 22,
  },

  // Contenedor del formulario.
  formContainer: {
    backgroundColor: theme.colors.card, // Glassmorphism
    borderRadius: 20,
    paddingVertical: 25,
    paddingHorizontal: 25,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
    marginTop: 5,
  },

  // Grupo de cada campo de entrada.
  inputGroup: {
    marginBottom: 20,
  },

  // Estilo para las etiquetas de los inputs.
  label: {
    fontSize: 15,
    color: theme.colors.textSecondary,
    marginBottom: 8,
    marginLeft: 2,
    fontWeight: '600',
  },


  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Translucido
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  icon: {
    marginRight: 10,
    color: theme.colors.textSecondary,
  },

  inputField: {
    flex: 1,
    fontSize: 16,
    fontWeight: '400',
    color: theme.colors.text,
    paddingVertical: 0,
  },


  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },

  passwordInput: {
    flex: 1,
    fontSize: 16,
    color: theme.colors.text,
    paddingVertical: 0,
  },


  passwordToggle: {
    paddingLeft: 10,
  },


  registerButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  registerButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.8,
  },


  termsContainer: {
    marginTop: 20,
    paddingHorizontal: 8,
  },


  termsText: {
    fontSize: 13,
    color: '#777',
    textAlign: 'center',
    lineHeight: 18,
  },

  linkText: {
    color: theme.colors.primary,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },


  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: 20,
  },


  loginText: {
    color: theme.colors.textSecondary,
    fontSize: 15,
  },

  // Estilo del enlace para iniciar sesión.
  loginLink: {
    color: theme.colors.primary,
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 6,
  },

  gradientBackground: {
    flex: 1,
    width: '100%',
    height: '100%',
  },


  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 55 : 30,
    left: 20,
    zIndex: 10,
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.3)', // Semi-transparent background for visibility
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
});