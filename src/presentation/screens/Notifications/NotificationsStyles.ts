import { StyleSheet, Platform, StatusBar } from 'react-native';
import { normalize } from '../../utils/dimensions';
import { theme } from '../../theme/theme';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    padding: normalize(15),
  },
  // Estilos para la tarjeta tipo web con barra lateral
  cardContainer: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: theme.colors.card, // Glassmorphism
    borderRadius: normalize(18),
    marginBottom: normalize(18),
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 6,
    overflow: 'hidden',
    minHeight: normalize(110),
  },
  sideBar: {
    width: normalize(8), // Thinner bar
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: normalize(18),
    borderBottomLeftRadius: normalize(18),
  },
  cardContent: {
    flex: 1,
    padding: normalize(16),
    justifyContent: 'center',
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: normalize(8),
  },
  communityText: {
    fontSize: normalize(15),
    fontWeight: 'bold',
    color: theme.colors.text,
    textAlign: 'left',
  },
  timeText: {
    fontSize: normalize(13),
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  notificationContentWeb: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: normalize(10),
  },
  notificationInfo: {
    flex: 1,
    marginRight: normalize(10),
  },
  notificationTitle: {
    fontSize: normalize(17),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  notificationDescription: {
    fontSize: normalize(14),
    color: theme.colors.textSecondary,
    marginTop: normalize(4),
  },
  profileImage: {
    width: normalize(48),
    height: normalize(48),
    borderRadius: normalize(24),
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  notificationActions: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: normalize(10),
    width: '100%',
    gap: normalize(10),
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: normalize(10),
    paddingVertical: normalize(10),
    paddingHorizontal: normalize(16),
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: normalize(13),
  },
  // Colores de barra lateral (suaves)
  sosBar: {
    backgroundColor: theme.colors.primary, // Red for SOS
  },
  alert911Bar: {
    backgroundColor: '#D94A4A', // Red dark
  },
  unnecessaryBar: {
    backgroundColor: '#4EC9B0', // Teal
  },
  // Botones de acción 
  sosButton: {
    backgroundColor: theme.colors.primary,
  },
  alert911Button: {
    backgroundColor: '#D94A4A',
  },
  unnecessaryButton: {
    backgroundColor: '#399E8A',
  },
});
