// Importamos StyleSheet desde React Native para definir los estilos
import { StyleSheet, Dimensions } from 'react-native';
import { theme } from '../../../theme/theme';

const { width } = Dimensions.get('window');

// Definimos los estilos de la pantalla de inicio de sesión
export const LoginStyles = StyleSheet.create({

  // Contenedor principal que centra todos los elementos en la pantalla
  container: {
    flex: 1, // Ocupa toda la pantalla
    alignItems: 'center', // Centra elementos horizontalmente
    justifyContent: 'center', // Centra elementos verticalmente
    padding: 20, // Añade un pequeño margen interno
  },

  // Imagen de fondo que cubre toda la pantalla
  backgroundGradient: {
    flex: 1,
    width: '100%',
    height: '100%',
  },


  // Contenedor del logo y título
  logoContainer: {
    marginBottom: 40, // Espaciado inferior para separar del siguiente elemento
    alignItems: 'center', // Centra los elementos hijos horizontalmente
  },

  // Estilo del logo de la aplicación
  logo: {
    width: 120, // Ancho de la imagen del logo
    height: 120, // Alto de la imagen del logo
    marginBottom: 20, // Espaciado inferior para separarlo del título
  },

  // Estilo del título principal "Sos911"
  title: {
    fontSize: 48, // Tamaño grande para que resalte
    fontWeight: 'bold', // Negrita para mayor impacto visual
    color: theme.colors.text, // Texto en color blanco
    marginBottom: 10, // Espaciado inferior
    textAlign: 'center', // Centra el texto
  },

  // Estilo para la palabra "Sos" dentro del título
  sosText: {
    fontWeight: 'bold', // Negrita para destacar
    color: theme.colors.text, // Color blanco
  },

  // Estilo para "911" dentro del título
  nineElevenText: {
    fontWeight: 'bold', // Negrita para destacar
    color: theme.colors.primary, // Rojo corporativo
  },

  // Estilo del subtítulo que indica que el usuario debe iniciar sesión
  subtitle: {
    fontSize: 16, // Tamaño de fuente moderado
    fontWeight: '400', // Peso de fuente normal
    color: theme.colors.textSecondary, // Gris claro
    marginBottom: 40, // Espaciado inferior
    textAlign: 'center', // Centra el texto en la pantalla
  },

  // Contenedor de los campos de entrada
  inputContainer: {
    width: '100%', // Hace que los inputs no sean demasiado anchos
    maxWidth: 400, // Evita que los inputs sean demasiado grandes en pantallas grandes
    backgroundColor: theme.colors.card, // Fondo glassmorphism
    borderRadius: 20,
    padding: 30,
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },

  // ***** NUEVOS ESTILOS PARA INPUTS CON ICONOS *****
  // Envoltorio para el TextInput y el Icon
  inputWrapper: {
    flexDirection: 'row', // Para que el icono y el texto estén en la misma fila
    alignItems: 'center', // Centra verticalmente el icono y el texto
    backgroundColor: 'rgba(255, 255, 255, 0.05)', // Translucido
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15, // Añadir padding horizontal aquí
    height: 55, // Altura fija para el contenedor
  },
  // Estilo para el icono dentro del input
  icon: {
    marginRight: 10, // Espacio a la derecha del icono
    color: theme.colors.textSecondary, // Color del icono
  },
  // Estilo del TextInput cuando hay un icono
  inputField: {
    flex: 1, // Para que el TextInput ocupe el resto del espacio disponible
    paddingVertical: 0, // Ajustar el padding vertical del input
    fontSize: 16, // Tamaño de fuente para el texto del input
    color: theme.colors.text, // Color del texto del input (blanco)
  },
  // **********************************************

  // Botón de inicio de sesión
  loginButton: {
    backgroundColor: theme.colors.primary, // Color llamativo del botón (Rojo)
    borderRadius: 12, // Bordes redondeados para un diseño moderno
    paddingVertical: 16, // Espaciado interno vertical
    width: '100%', // Ocupa todo el ancho disponible en el contenedor
    alignItems: 'center', // Centra el texto dentro del botón
    marginTop: 10, // Espaciado superior para separarlo de los inputs
    shadowColor: theme.colors.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },

  // Texto dentro del botón de inicio de sesión
  loginButtonText: {
    color: '#fff', // Texto en color blanco para contrastar con el fondo
    fontSize: 18, // Tamaño de fuente adecuado para la lectura
    fontWeight: 'bold', // Peso medio para resaltar
  },

  // Contenedor del mensaje de registro
  registerContainer: {
    flexDirection: 'row', // Alinea los elementos en una fila
    marginTop: 25, // Espaciado superior
    justifyContent: 'center',
  },

  // Texto que pregunta si el usuario tiene cuenta
  registerText: {
    color: theme.colors.textSecondary, // Texto gris claro
    fontSize: 14, // Tamaño de fuente pequeño pero legible
  },

  // Enlace para registrarse
  registerLink: {
    color: theme.colors.primary,// Rojo para indicar que es un enlace
    fontSize: 14, // Tamaño de fuente similar al texto anterior
    fontWeight: 'bold', // Negrita para resaltarlo
    marginLeft: 5, // Espaciado izquierdo para separarlo del texto anterior
  },
});