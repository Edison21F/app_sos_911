import React, { useState, useEffect } from 'react';
import { ImageBackground, ScrollView, View, Text, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header/Header';
import CustomSidebar from '../../components/Sidebar/Sidebar';
import styles from './AlertHistoryStyles';
import { ShieldAlert, Siren, Calendar, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { theme } from '../../theme/theme';

// Definición de tipos
type AlertType = 'SOS' | '911' | 'MEDICA' | 'VIOLENCIA' | 'INCENDIO'; // Mapear según backend
type AlertStatus = 'CREADA' | 'NOTIFICADA' | 'ATENDIDA' | 'CERRADA' | 'CANCELADA';

interface Alert {
  _id: string; // Mongo ID
  tipo: string;
  prioridad: string;
  ubicacion: {
    direccion?: string;
    latitud: number;
    longitud: number;
  };
  estado: AlertStatus;
  fecha_creacion: string;
  detalles?: string;
}

const AlertCard = ({ alert, onUpdate }: { alert: Alert, onUpdate: () => void }) => {
  const isSOS = alert.prioridad === 'ALTA' || alert.tipo === 'SOS';
  const borderStyle = isSOS ? styles.borderSOS : styles.border911;
  const icon = isSOS ? (
    <Siren size={38} color="#FF9E5D" />
  ) : (
    <ShieldAlert size={38} color="#FF4D4D" />
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CERRADA':
      case 'CANCELADA': return styles.status_resuelto;
      default: return styles.status_activo;
    }
  };

  const handleFinalize = async () => {
    try {
      await api.patch(`/alertas/${alert._id}/estado`, {
        estado: 'CERRADA',
        comentario: 'Finalizada por el usuario desde historial'
      });
      onUpdate();
    } catch (error) {
      console.error("Error finalizando alerta", error);
    }
  };

  const formattedDate = alert.fecha_creacion
    ? format(new Date(alert.fecha_creacion), "dd-MM-yy / h:mm a", { locale: es })
    : 'Fecha desconocida';

  return (
    <View style={[styles.alertCard, borderStyle]}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={styles.alertTitleBlock}>
            <Text style={styles.alertType}>{alert.tipo}</Text>
            <Text style={styles.alertSubtitle}>Alerta de Seguridad</Text>
          </View>
          <Text style={[styles.statusBadge, getStatusStyle(alert.estado)]}>{alert.estado}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Calendar size={20} color="#888" style={styles.infoIcon} />
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Fecha y Hora</Text>
            <Text style={styles.infoValue}>{formattedDate}</Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <MapPin size={20} color="#888" style={styles.infoIcon} />
          <View style={styles.infoBlock}>
            <Text style={styles.infoLabel}>Ubicación</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {alert.ubicacion?.direccion || `Lat: ${alert.ubicacion?.latitud?.toFixed(4)}, Lng: ${alert.ubicacion?.longitud?.toFixed(4)}`}
            </Text>
          </View>
        </View>

        {/* Botón Finalizar solo si está activa */}
        {['CREADA', 'NOTIFICADA', 'ATENDIDA'].includes(alert.estado) && (
          <View style={{ marginTop: 10 }}>
            <Text
              style={{
                color: 'white',
                backgroundColor: '#FF4D4D',
                padding: 8,
                borderRadius: 8,
                textAlign: 'center',
                fontWeight: 'bold'
              }}
              onPress={handleFinalize}
            >
              ESTOY A SALVO
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

const AlertHistoryComponent = ({ navigation }: { navigation: any }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchHistory = async () => {
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) return;

      const response = await api.get(`/alertas/historial/${clienteId}`);
      if (response.data.success) {
        setAlerts(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching alert history:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchHistory();
  };

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.backgroundImage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>

        <Header showBackButton={true} onBackPress={() => navigation.goBack()} customTitle="Historial de Alertas" />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FF9E5D" style={{ marginTop: 50 }} />
          ) : alerts.length > 0 ? (
            alerts.map(alert => (
              <AlertCard key={alert._id} alert={alert} onUpdate={fetchHistory} />
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={styles.noDataText}>No tienes historial de alertas.</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default AlertHistoryComponent;
