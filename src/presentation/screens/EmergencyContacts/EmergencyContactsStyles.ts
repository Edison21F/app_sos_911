import { StyleSheet, Platform, StatusBar } from 'react-native';
import { normalize } from '../../utils/dimensions';
import { theme } from '../../theme/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    paddingHorizontal: normalize(16),
    paddingTop: normalize(16),
    paddingBottom: normalize(100),
  },
  contactCard: {
    backgroundColor: theme.colors.card, // Glassmorphism
    borderRadius: normalize(16),
    padding: normalize(12),
    marginBottom: normalize(16),
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  contactImage: {
    width: normalize(55),
    height: normalize(55),
    borderRadius: normalize(27.5),
    borderWidth: 2,
    borderColor: theme.colors.primary,
    resizeMode: 'cover',
  },
  contactImageContainer: {
    width: normalize(55),
    height: normalize(55),
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsContainer: {
    width: normalize(55),
    height: normalize(55),
    borderRadius: normalize(27.5),
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: theme.colors.primary,
  },
  initialsText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  contactInfo: {
    flex: 1,
    marginLeft: normalize(12),
  },
  contactName: {
    fontSize: normalize(17),
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  contactRelation: {
    fontSize: normalize(14),
    color: theme.colors.textSecondary,
    marginTop: normalize(4),
  },
  contactActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    padding: normalize(8),
    marginRight: normalize(4),
  },
  addButtonContainer: {
    position: 'absolute',
    right: normalize(20),
    bottom: normalize(20),
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 10,
  },
  addButton: {
    width: normalize(60),
    height: normalize(60),
    borderRadius: normalize(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
  },
  loadingText: {
    fontSize: normalize(16),
    color: '#fff',
    marginTop: normalize(10),
    textAlign: 'center',
  },
});
