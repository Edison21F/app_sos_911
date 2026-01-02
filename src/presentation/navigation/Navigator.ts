import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { Contact } from '../../domain/entities/Contact';
import { ImageSourcePropType } from 'react-native';

import { Group } from '../../domain/entities/Group';

// Interfaces para los grupos
// Local definitions removed in favor of Domain Entity

// Definición de los parámetros de navegación para toda la aplicación
export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined;
  Register: undefined;
  Home: undefined;
  MainTabs: undefined;
  Groups: undefined;
  AddGroup: undefined;
  Pets: undefined;
  GroupChat: {
    group: Group;
  };
  GroupDetails: {
    group: Group;
  };
  EmergencyContacts: undefined;
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
  // Corrected ContactDetails to include updateContacts
  ContactDetails: { contact: Contact };
  AddContact: undefined;
  EditContact: { contactId: string }; // Assuming this will be used for a separate edit screen if needed
  Location: undefined;
  Information: undefined;
  AlertHistory: undefined;
  EmergencySelection: undefined;
  ActiveEmergency: { type: string, alertData?: any, isOffline?: boolean };
  EmergencyAlert: { alertId: string, senderName: string, type: string };
  NearbyAlerts: undefined;
};

// Tipos de navegación específicos para cada pantalla
export type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
export type RegisterScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Register'>;
export type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
export type GroupsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Groups'>;
export type GroupChatScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GroupChat'>;
export type EmergencyContactsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'EmergencyContacts'>;
export type ContactDetailsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'ContactDetails'>;
export type AddContactScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddContact'>;
export type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;
export type SettingsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Settings'>;

// Tipos para las props de ruta específicas
export type ContactDetailsRouteProp = RouteProp<RootStackParamList, 'ContactDetails'>;
export type AddContactRouteProp = RouteProp<RootStackParamList, 'AddContact'>;
export type EditContactRouteProp = RouteProp<RootStackParamList, 'EditContact'>;
export type AlertHistoryRouteProp = RouteProp<RootStackParamList, 'AlertHistory'>;
export type GroupChatRouteProp = RouteProp<RootStackParamList, 'GroupChat'>;

// Tipos para las props de los componentes de pantalla
export interface GroupsScreenProps {
  navigation: GroupsScreenNavigationProp;
}

export interface GroupChatScreenProps {
  navigation: GroupChatScreenNavigationProp;
  route: GroupChatRouteProp;
}

export interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

export interface RegisterScreenProps {
  navigation: RegisterScreenNavigationProp;
}

export interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export interface EmergencyContactsScreenProps {
  navigation: EmergencyContactsScreenNavigationProp;
}

export interface ContactDetailsScreenProps {
  navigation: ContactDetailsScreenNavigationProp;
  route: ContactDetailsRouteProp;
}

export interface AddContactScreenProps {
  navigation: AddContactScreenNavigationProp;
  route: AddContactRouteProp;
}

export interface ProfileScreenProps {
  navigation: ProfileScreenNavigationProp;
}

export interface SettingsScreenProps {
  navigation: SettingsScreenNavigationProp;
}