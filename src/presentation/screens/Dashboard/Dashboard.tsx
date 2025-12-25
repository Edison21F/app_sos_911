import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';
import { styles } from './DashboardStyles';
import ModernHeader from '../../components/Header/ModernHeader';
import { AlertTriangle, Users, CheckCircle, Clock, Zap, Wifi, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDashboardViewModel } from '../../hooks/useDashboardViewModel';
// import client removed

const DashboardScreen = () => {
    const navigation = useNavigation<any>();
    const { user, batteryLevel, isConnected, isGpsEnabled, getProfileImageUrl } = useDashboardViewModel();

    // Helper to calculate color based on value
    const getBatteryColor = (level: number) => {
        if (level > 20) return '#2ecc71';
        return '#e74c3c';
    };

    return (
        <LinearGradient
            colors={theme.colors.gradientBackground}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <ModernHeader
                    userName={user ? user.name.split(' ')[0] : 'Usuario'}
                    notificationCount={2}
                    onLogout={() => { /* TODO: Move to VM or separate auth hook? For now keep empty as per original placeholder */ }}
                    onNotificationPress={() => navigation.navigate('Alertas' as any)}
                    onProfilePress={() => navigation.navigate('Profile' as any)}
                    profileImage={getProfileImageUrl()}
                />

                <ScrollView contentContainerStyle={styles.content}>
                    <Text style={styles.sectionTitle}>Estado General</Text>

                    <View style={styles.grid}>
                        {/* Active Alerts Card */}
                        <View style={[styles.card, { backgroundColor: 'rgba(229, 57, 53, 0.15)' }]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardLabel}>Alertas Activas</Text>
                                <View style={[styles.iconBadge, { backgroundColor: 'rgba(229, 57, 53, 0.2)' }]}>
                                    <AlertTriangle size={20} color="#E53935" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>2</Text>
                            <Text style={styles.statSubtext}>Requieren atención</Text>
                        </View>

                        {/* Contacts Card */}
                        <View style={[styles.card, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardLabel}>Contactos</Text>
                                <View style={[styles.iconBadge, { backgroundColor: 'rgba(33, 150, 243, 0.2)' }]}>
                                    <Users size={20} color="#2196F3" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>3</Text>
                            <Text style={styles.statSubtext}>2 disponibles</Text>
                        </View>

                        {/* Resolved Card */}
                        <View style={[styles.card, { backgroundColor: 'rgba(46, 204, 113, 0.15)' }]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardLabel}>Resueltas</Text>
                                <View style={[styles.iconBadge, { backgroundColor: 'rgba(46, 204, 113, 0.2)' }]}>
                                    <CheckCircle size={20} color="#2ecc71" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>1</Text>
                            <Text style={styles.statSubtext}>Este mes</Text>
                        </View>

                        {/* Response Time Card */}
                        <View style={[styles.card, { backgroundColor: 'rgba(241, 196, 15, 0.15)' }]}>
                            <View style={styles.cardHeader}>
                                <Text style={styles.cardLabel}>Respuesta</Text>
                                <View style={[styles.iconBadge, { backgroundColor: 'rgba(241, 196, 15, 0.2)' }]}>
                                    <Clock size={20} color="#f1c40f" />
                                </View>
                            </View>
                            <Text style={styles.statValue}>45s</Text>
                            <Text style={styles.statSubtext}>Promedio</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Estado del Dispositivo</Text>

                    <View style={styles.deviceStatsContainer}>
                        {/* Battery */}
                        <View style={styles.gaugeContainer}>
                            <View style={[styles.gaugeRing, { borderColor: getBatteryColor(batteryLevel || 0) }]}>
                                <Zap size={24} color={getBatteryColor(batteryLevel || 0)} />
                                <Text style={styles.gaugeValue}>{batteryLevel}%</Text>
                            </View>
                            <Text style={styles.gaugeLabel}>Batería</Text>
                        </View>

                        {/* Network */}
                        <View style={styles.gaugeContainer}>
                            <View style={[styles.gaugeRing, { borderColor: isConnected ? '#3498db' : '#e74c3c' }]}>
                                <Wifi size={24} color={isConnected ? '#3498db' : '#e74c3c'} />
                                <Text style={styles.gaugeValue}>{isConnected ? '100' : '0'}</Text>
                            </View>
                            <Text style={styles.gaugeLabel}>Red</Text>
                        </View>

                        {/* GPS */}
                        <View style={styles.gaugeContainer}>
                            <View style={[styles.gaugeRing, { borderColor: isGpsEnabled ? '#2ecc71' : '#e74c3c' }]}>
                                <MapPin size={24} color={isGpsEnabled ? '#2ecc71' : '#e74c3c'} />
                                <Text style={styles.gaugeValue}>{isGpsEnabled ? '95' : '0'}</Text>
                            </View>
                            <Text style={styles.gaugeLabel}>GPS</Text>
                        </View>
                    </View>

                </ScrollView>
            </SafeAreaView>
        </LinearGradient>
    );
};

export default DashboardScreen;
