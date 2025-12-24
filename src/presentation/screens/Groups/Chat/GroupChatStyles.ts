import { StyleSheet, Platform, StatusBar } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark
    alignItems: 'center',
    borderTopWidth: 0,
    margin: 10,
    borderRadius: 25,
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
    fontSize: 16,
    color: '#fff',
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#D32F2F', // Dark Red
    borderRadius: 25,
  },
  sendButtonDisabled: {
    opacity: 0.5,
    backgroundColor: '#555',
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 12,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  sentMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#922B21', // Deep Red (Material Red 900 variant) for better text contrast
    borderBottomRightRadius: 4,
    marginLeft: '20%',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#34495E', // Slightly lighter slate for contrast against dark bg
    borderBottomLeftRadius: 4,
    marginRight: '20%',
  },
  messageSender: {
    fontSize: 12,
    color: '#ccc', // Lighter for dark bg
    marginBottom: 4,
    fontWeight: '600'
  },
  messageText: {
    fontSize: 16,
    color: '#fff',
    lineHeight: 22,
  },
  messageTime: {
    fontSize: 10,
    color: '#ccc', // Lighter for dark bg
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});