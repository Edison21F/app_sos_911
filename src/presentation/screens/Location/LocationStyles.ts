import { StyleSheet, Platform, StatusBar } from 'react-native';
import { normalize } from '../../../shared/utils/dimensions';
import { theme } from '../../styles/theme';

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
    alignItems: 'center',
  },
  mapContainer: {
    width: '90%',
    height: '60%', // Reduced from 70% to give more room for buttons
    borderRadius: normalize(15),
    overflow: 'hidden',
    marginBottom: normalize(20),
    marginTop: normalize(20),
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: normalize(20),
    marginTop: normalize(10),
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary, // Red Button
    paddingVertical: normalize(10), // Reduced from 12
    paddingHorizontal: normalize(20),
    borderRadius: normalize(10),
    marginBottom: normalize(10), // Reduced from 15 to keep it closer but separated
    shadowColor: theme.colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    width: normalize(230),
  },
  buttonSecondary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primaryDark, // Darker Red
    paddingVertical: normalize(10), // Reduced from 12
    paddingHorizontal: normalize(20),
    borderRadius: normalize(10),
    shadowColor: theme.colors.primaryDark,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
    width: normalize(230),
    marginBottom: normalize(10), // Reduced from 15
  },
  buttonText: {
    color: '#fff',
    fontSize: normalize(16),
    marginLeft: normalize(8),
    textAlign: 'center',
    fontWeight: 'bold',
  },
});