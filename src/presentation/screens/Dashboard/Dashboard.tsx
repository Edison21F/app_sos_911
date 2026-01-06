import React from 'react';
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';
import { styles } from './DashboardStyles';
import ModernHeader from '../../components/Header/ModernHeader';
import { AlertTriangle, Users, CheckCircle, Clock, Zap, Wifi, MapPin } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useDashboardViewModel } from '../../hooks/useDashboardViewModel';
import { useNotificationContext } from '../../contexts/NotificationContext';

const DashboardScreen = () => {
    /**
     * CAPA DE PRESENTACIÓN: Pantalla (View)
     * 
     * RESPONSABILIDAD:
     * Renderizar la interfaz gráfica del Dashboard.
     * Muestra tarjetas de estadísticas y estado del dispositivo.
     * 
     * INTERACCIÓN:
     * Obtiene todos los datos y funciones desde `useDashboardViewModel`.
     * No contiene lógica de negocio, solo renderizado UI.
     */
    const navigation = useNavigation<any>();
    const {
        user,
        batteryLevel,
        isConnected,
        isGpsEnabled,
        stats,
        loading,
        getProfileImageUrl,
        refreshStats
    } = useDashboardViewModel();
    const { notificationCount } = useNotificationContext();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(async () => {
        setRefreshing(true);
        await refreshStats();
        setRefreshing(false);
    }, [refreshStats]);

    // Helper para calcular color basado en valor
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
                    notificationCount={notificationCount}
                    onLogout={() => { /* TODO: Move to VM or separate auth hook? For now keep empty as per original placeholder */ }}
                    onNotificationPress={() => navigation.navigate('Notifications' as any)}
                    onProfilePress={() => navigation.navigate('Profile' as any)}
                    profileImage={getProfileImageUrl()}
                />

                <ScrollView
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor={theme.colors.primary}
                            colors={[theme.colors.primary]}
                        />
                    }
                >
                    <Text style={styles.sectionTitle}>Estado General</Text>

                    {loading ? (
                        <View style={{ padding: 40, alignItems: 'center' }}>
                            <ActivityIndicator size="large" color={theme.colors.primary} />
                            <Text style={{ color: theme.colors.textSecondary, marginTop: 10 }}>
                                Cargando estadísticas...
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.grid}>
                            {/* Tarjeta de Alertas Activas */}
                            <View style={[styles.card, { backgroundColor: 'rgba(229, 57, 53, 0.15)' }]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardLabel}>Alertas Activas</Text>
                                    <View style={[styles.iconBadge, { backgroundColor: 'rgba(229, 57, 53, 0.2)' }]}>
                                        <AlertTriangle size={20} color="#E53935" />
                                    </View>
                                </View>
                                <Text style={styles.statValue}>{stats?.alertasActivas ?? 0}</Text>
                                <Text style={styles.statSubtext}>
                                    {(stats?.alertasActivas ?? 0) > 0 ? 'Requieren atención' : 'Sin alertas'}
                                </Text>
                            </View>

                            {/* Tarjeta de Contactos */}
                            <View style={[styles.card, { backgroundColor: 'rgba(33, 150, 243, 0.15)' }]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardLabel}>Contactos</Text>
                                    <View style={[styles.iconBadge, { backgroundColor: 'rgba(33, 150, 243, 0.2)' }]}>
                                        <Users size={20} color="#2196F3" />
                                    </View>
                                </View>
                                <Text style={styles.statValue}>{stats?.contactos ?? 0}</Text>
                                <Text style={styles.statSubtext}>Registrados</Text>
                            </View>

                            {/* Tarjeta de Resueltas */}
                            <View style={[styles.card, { backgroundColor: 'rgba(46, 204, 113, 0.15)' }]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardLabel}>Resueltas</Text>
                                    <View style={[styles.iconBadge, { backgroundColor: 'rgba(46, 204, 113, 0.2)' }]}>
                                        <CheckCircle size={20} color="#2ecc71" />
                                    </View>
                                </View>
                                <Text style={styles.statValue}>{stats?.alertasResueltas ?? 0}</Text>
                                <Text style={styles.statSubtext}>Total histórico</Text>
                            </View>

                            {/* Tarjeta de Tiempo de Respuesta */}
                            <View style={[styles.card, { backgroundColor: 'rgba(241, 196, 15, 0.15)' }]}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.cardLabel}>Respuesta</Text>
                                    <View style={[styles.iconBadge, { backgroundColor: 'rgba(241, 196, 15, 0.2)' }]}>
                                        <Clock size={20} color="#f1c40f" />
                                    </View>
                                </View>
                                <Text style={styles.statValue}>
                                    {stats?.tiempoRespuestaPromedio ?? 0}s
                                </Text>
                                <Text style={styles.statSubtext}>Promedio</Text>
                            </View>
                        </View>
                    )}

                    <Text style={styles.sectionTitle}>Estado del Dispositivo</Text>

                    <View style={styles.deviceStatsContainer}>
                        {/* Batería */}
                        <View style={styles.gaugeContainer}>
                            <View style={[styles.gaugeRing, { borderColor: getBatteryColor(batteryLevel || 0) }]}>
                                <Zap size={24} color={getBatteryColor(batteryLevel || 0)} />
                                <Text style={styles.gaugeValue}>{batteryLevel ?? 0}%</Text>
                            </View>
                            <Text style={styles.gaugeLabel}>Batería</Text>
                        </View>

                        {/* Red */}
                        <View style={styles.gaugeContainer}>
                            <View style={[styles.gaugeRing, { borderColor: isConnected ? '#3498db' : '#e74c3c' }]}>
                                <Wifi size={24} color={isConnected ? '#3498db' : '#e74c3c'} />
                                <Text style={styles.gaugeValue}>{isConnected ? 'ON' : 'OFF'}</Text>
                            </View>
                            <Text style={styles.gaugeLabel}>Red</Text>
                        </View>

                        {/* GPS */}
                        <View style={styles.gaugeContainer}>
                            <View style={[styles.gaugeRing, { borderColor: isGpsEnabled ? '#2ecc71' : '#e74c3c' }]}>
                                <MapPin size={24} color={isGpsEnabled ? '#2ecc71' : '#e74c3c'} />
                                <Text style={styles.gaugeValue}>{isGpsEnabled ? 'ON' : 'OFF'}</Text>
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


