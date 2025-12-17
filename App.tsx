import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './src/navigation/Navigator';
import WelcomeScreen from './src/screens/Welcome/Welcome';
import LoginScreen from './src/screens/Auth/Login/Login';
import RegisterScreen from './src/screens/Auth/Register/Register';
import HomeScreen from './src/screens/Home/Home';
import EmergencyContactsScreen from './src/screens/EmergencyContacts/EmergencyContacts';
import ContactDetailsScreen from './src/screens/EmergencyContacts/Details/ContactDetails';
import AddContactScreen from './src/screens/EmergencyContacts/Add/AddContact';
import GroupsScreen from './src/screens/Groups/Groups';
import AddGroupScreen from './src/screens/Groups/Add/AddGroup';
import GroupChatScreen from './src/screens/Groups/Chat/GroupChat';
import GroupDetailsScreen from './src/screens/Groups/Details/GroupDetails';
import LocationScreen from './src/screens/Location/Location';
import ProfileScreen from './src/screens/Profile/Profile';
import InformationScreen from './src/screens/Information/Information';
import NotificationsScreen from './src/screens/Notifications/Notifications';
import AlertHistoryScreen from './src/screens/Details/AlertHistory';
import EmergencySelectionScreen from './src/screens/Emergency/EmergencySelection';
import ActiveEmergencyScreen from './src/screens/Emergency/ActiveEmergency';
import EmergencyAlertScreen from './src/screens/Emergency/EmergencyAlertScreen';
import NearbyAlertsScreen from './src/screens/Alerts/NearbyAlertsScreen';
import TabNavigator from './src/navigation/TabNavigator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { theme } from './src/theme/theme';


import io, { Socket } from 'socket.io-client';
import api from './src/api/api';
import EmergencyAlertModal from './src/components/Modals/EmergencyAlertModal';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootStackParamList>('Welcome');
  const [isLoading, setIsLoading] = useState(true);
  const [alertData, setAlertData] = useState<any>(null);
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const socketRef = React.useRef<Socket | null>(null);

  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const clienteId = await AsyncStorage.getItem('clienteId');
        if (clienteId) {
          setInitialRoute('MainTabs');
          setupSocket(clienteId);
        }
      } catch (error) {
        console.error('Error checking login state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginState();

    return () => {
      if (socketRef.current) socketRef.current.disconnect();
    };
  }, []);

  const setupSocket = (userId: string) => {
    // @ts-ignore
    const baseURL = api.defaults.baseURL || 'http://192.168.100.225:4000';
    socketRef.current = io(baseURL);

    socketRef.current.on('connect', () => {
      console.log('App Global Socket Connected');
      socketRef.current?.emit('join', `user_${userId}`);
    });

    socketRef.current.on('alert:new', (newAlert: any) => {
      console.log('Emergency Alert Received:', newAlert);
      setAlertData(newAlert);
      setIsAlertVisible(true);
    });
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: theme.colors.background },
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={TabNavigator} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EmergencyContacts" component={EmergencyContactsScreen} />
          <Stack.Screen name="ContactDetails" component={ContactDetailsScreen} />
          <Stack.Screen name="AddContact" component={AddContactScreen} />
          <Stack.Screen name="Groups" component={GroupsScreen} />
          <Stack.Screen name="AddGroup" component={AddGroupScreen} />
          <Stack.Screen name="GroupChat" component={GroupChatScreen} />
          <Stack.Screen name="GroupDetails" component={GroupDetailsScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="Location" component={LocationScreen} />
          <Stack.Screen name="Notifications" component={NotificationsScreen} />
          <Stack.Screen name="Information" component={InformationScreen} />
          <Stack.Screen name="AlertHistory" component={AlertHistoryScreen} />
          <Stack.Screen name="EmergencySelection" component={EmergencySelectionScreen} />
          <Stack.Screen name="ActiveEmergency" component={ActiveEmergencyScreen} />
          <Stack.Screen name="EmergencyAlert" component={EmergencyAlertScreen} />
          <Stack.Screen name="NearbyAlerts" component={NearbyAlertsScreen} />
        </Stack.Navigator>

        <EmergencyAlertModal
          visible={isAlertVisible}
          onClose={() => setIsAlertVisible(false)}
          alertData={alertData}
        />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}