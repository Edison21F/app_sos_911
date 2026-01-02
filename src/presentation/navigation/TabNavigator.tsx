import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { Feather, FontAwesome5 } from '@expo/vector-icons';

import HomeScreen from '../screens/Home/Home';
import NotificationsScreen from '../screens/Notifications/Notifications';
import AlertHistoryScreen from '../screens/Details/AlertHistory';
import NearbyAlertsScreen from '../screens/Alerts/NearbyAlertsScreen';
import EmergencyContactsScreen from '../screens/EmergencyContacts/EmergencyContacts';
import GroupsScreen from '../screens/Groups/Groups';
import DashboardScreen from '../screens/Dashboard/Dashboard';

// Placeholder for SOS tab since we intercept the press
const SOSPlaceholder = () => <View />;

const Tab = createBottomTabNavigator();

const CustomTabBarButton = ({ children, onPress }: any) => (
    <TouchableOpacity
        style={{
            top: -30,
            justifyContent: 'center',
            alignItems: 'center',
            ...styles.shadow
        }}
        onPress={onPress}
    >
        <View style={{
            width: 70,
            height: 70,
            borderRadius: 35,
            backgroundColor: '#E53935',
            justifyContent: 'center',
            alignItems: 'center',
            borderWidth: 4,
            borderColor: '#1a1a1a' // Match background
        }}>
            {children}
        </View>
    </TouchableOpacity>
);

const TabNavigator = () => {
    const navigation = useNavigation<any>();

    return (
        <Tab.Navigator
            initialRouteName="Home"
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: true,
                tabBarStyle: {
                    backgroundColor: '#1a1a1a', // Dark theme
                    borderTopWidth: 0,
                    height: 60,
                    paddingBottom: 5,
                    paddingTop: 5
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    marginBottom: 5,
                    paddingBottom: 5 // Padding extra
                },
                tabBarActiveTintColor: '#E53935',
                tabBarInactiveTintColor: '#748c94',
            }}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    tabBarLabel: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="bar-chart-2" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Alertas"
                component={AlertHistoryScreen}
                options={{
                    tabBarLabel: 'Historial',
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="clock" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <FontAwesome5 name="exclamation-triangle" size={30} color="#fff" />
                    ),
                    tabBarButton: (props) => (
                        <CustomTabBarButton {...props} />
                    ),
                    tabBarLabel: () => null
                }}
            />

            <Tab.Screen
                name="Contactos"
                component={EmergencyContactsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="users" size={24} color={color} />
                    )
                }}
            />

            <Tab.Screen
                name="Grupos"
                component={GroupsScreen}
                options={{
                    tabBarIcon: ({ color, size }) => (
                        <Feather name="message-square" size={24} color={color} />
                    )
                }}
            />
        </Tab.Navigator >
    );
};

const styles = StyleSheet.create({
    shadow: {
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.5,
        elevation: 5
    }
});

export default TabNavigator;
