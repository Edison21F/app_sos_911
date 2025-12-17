import { StyleSheet, Platform, StatusBar } from 'react-native';
import { normalize } from '../../utils/dimensions';
import { theme } from '../../theme/theme';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 0,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollContainer: {
    padding: normalize(16),
    paddingBottom: normalize(24),
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: theme.colors.card, // Glassmorphism
    borderRadius: normalize(16),
    marginBottom: normalize(20),
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
  // Barra lateral de color
  borderSOS: {
    borderLeftWidth: normalize(7),
    borderLeftColor: theme.colors.primary, // Red
  },
  border911: {
    borderLeftWidth: normalize(7),
    borderLeftColor: theme.colors.primaryDark,
  },
  // Ícono grande a la izquierda
  iconContainer: {
    width: normalize(60),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },
  // Contenido principal de la tarjeta
  cardContent: {
    flex: 1,
    padding: normalize(16),
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: normalize(8),
  },
  alertTitleBlock: {
    flexDirection: 'column',
    gap: normalize(2),
  },
  alertType: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  alertSubtitle: {
    fontSize: normalize(13),
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  // Badge de estado
  statusBadge: {
    borderRadius: normalize(20),
    paddingVertical: normalize(4),
    paddingHorizontal: normalize(16),
    alignSelf: 'flex-start',
    fontWeight: 'bold',
    fontSize: normalize(11),
    overflow: 'hidden',
    borderWidth: 1,
  },
  status_resuelto: {
    backgroundColor: 'rgba(40, 180, 99, 0.15)', // Success transparent
    color: theme.colors.success,
    borderColor: theme.colors.success,
  },
  status_activo: {
    backgroundColor: 'rgba(255, 75, 75, 0.15)', // Primary/Danger transparent
    color: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  // Línea divisoria
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: normalize(10),
  },
  // Campos de fecha y ubicación
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: normalize(8),
  },
  infoIcon: {
    marginRight: normalize(10),
    marginTop: normalize(2),
  },
  infoBlock: {
    flex: 1,
  },
  infoLabel: {
    fontSize: normalize(11),
    color: theme.colors.textSecondary,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  infoValue: {
    fontSize: normalize(14),
    color: theme.colors.text,
    fontWeight: '500',
    marginTop: normalize(1),
  },
  noDataText: {
    fontSize: normalize(16),
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: normalize(20),
    fontStyle: 'italic',
  },
});

export default styles;
