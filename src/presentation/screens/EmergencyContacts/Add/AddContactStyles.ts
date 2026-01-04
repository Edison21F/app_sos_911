import { StyleSheet, Platform } from 'react-native';
import { normalize } from '../../../../shared/utils/dimensions';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: normalize(20),
    paddingVertical: normalize(15),
    marginBottom: normalize(10),
  },
  backButton: {
    padding: normalize(8),
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  headerTitle: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#fff',
    marginLeft: normalize(15),
    letterSpacing: 1,
  },
  form: {
    paddingHorizontal: normalize(20),
  },
  // Tab Selector
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: normalize(15),
    padding: 4,
    marginBottom: normalize(30),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  tabButton: {
    flex: 1,
    paddingVertical: normalize(12),
    alignItems: 'center',
    borderRadius: normalize(12),
  },
  activeTab: {
    backgroundColor: '#922B21', // Deep Red
  },
  tabText: {
    color: '#aaa',
    fontSize: normalize(14),
    fontWeight: '600',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  // Input Fields
  fieldContainer: {
    marginBottom: normalize(20),
  },
  label: {
    fontSize: normalize(14),
    color: 'rgba(255,255,255,0.7)',
    marginBottom: normalize(8),
    marginLeft: 4,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    height: normalize(50),
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: normalize(15),
    paddingHorizontal: normalize(20),
    color: '#fff',
    fontSize: normalize(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },

  // Image Picker
  imagePickerContainer: {
    alignItems: 'center',
    marginBottom: normalize(30),
  },
  initialsContainer: {
    width: normalize(100),
    height: normalize(100),
    borderRadius: normalize(50),
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#922B21',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  imageLabel: {
    marginTop: normalize(10),
    fontSize: normalize(14),
    color: '#ccc',
  },

  // Button
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#D32F2F', // Brighter Red
    paddingVertical: normalize(16),
    borderRadius: normalize(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: normalize(20),
    shadowColor: "#D32F2F",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: normalize(18),
    fontWeight: 'bold',
    marginLeft: normalize(10),
  },
});
