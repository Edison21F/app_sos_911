import { StyleSheet, Platform, StatusBar, Dimensions } from 'react-native';
import { normalize, screenWidth } from '../../../shared/utils/dimensions';
import { theme } from '../../styles/theme';

// Constants
const SIDEBAR_WIDTH = Math.min(screenWidth * 0.8, 300);
const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 47 : StatusBar.currentHeight || 0;

// Shadow styles for reuse
const shadowProps = {
  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 4,
  },
  shadowOpacity: 0.3,
  shadowRadius: 6,
  elevation: 8,
};

export const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay
    zIndex: 1,
  },

  sidebar: {
    position: 'absolute',
    top: 0, // Full height
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: '#0F0F0F', // Black background
    zIndex: 2,
    ...shadowProps,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
  },

  container: {
    flex: 1,
    backgroundColor: '#0F0F0F',
    paddingTop: STATUSBAR_HEIGHT,
  },

  header: {
    padding: normalize(20),
    backgroundColor: '#1A1A1A', // Slightly lighter black
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  headerImage: {
    width: normalize(65),
    height: normalize(65),
    marginRight: normalize(15),
    borderRadius: normalize(50),
    borderWidth: 2,
    borderColor: theme.colors.primary, // Red border
    backgroundColor: '#fff',
  },

  headerContent: {
    flex: 1,
  },

  headerText: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: theme.colors.text,
    letterSpacing: 0.5,
  },

  headerSubText: {
    fontSize: normalize(14),
    color: theme.colors.textSecondary,
    marginTop: normalize(4),
  },

  menuContainer: {
    flex: 1,
    paddingTop: normalize(15),
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalize(15),
    paddingHorizontal: normalize(20),
    borderBottomWidth: 0,
    marginBottom: 4,
  },

  menuItemActive: {
    backgroundColor: 'rgba(255, 75, 75, 0.1)', // Red tint
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },

  menuText: {
    fontSize: normalize(16),
    color: theme.colors.text,
    marginLeft: normalize(15),
    letterSpacing: 0.3,
    fontWeight: '500',
  },

  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: normalize(20),
    backgroundColor: '#1A1A1A',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  logoutText: {
    fontSize: normalize(16),
    color: theme.colors.primary, // Red for logout
    marginLeft: normalize(10),
    fontWeight: 'bold',
  },
});