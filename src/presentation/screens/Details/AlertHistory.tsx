import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header/Header';
import styles from './AlertHistoryStyles';
import { ShieldAlert, Siren, Calendar, MapPin } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { theme } from '../../styles/theme';
import { useAlertHistoryViewModel } from '../../hooks/useAlertHistoryViewModel';
import { Alert } from '../../../domain/entities/Alert';

const AlertCard = ({ alert, onUpdate }: { alert: Alert, onUpdate: (id: string) => void }) => {
  const isSOS = alert.type === 'SOS' || alert.title.includes('SOS');
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

  const formattedDate = alert.time
    ? format(new Date(alert.time), "dd-MM-yy / h:mm a", { locale: es })
    : 'Fecha desconocida';

  return (
    <View style={[styles.alertCard, borderStyle]}>
      <View style={styles.iconContainer}>{icon}</View>
      <View style={styles.cardContent}>
        <View style={styles.headerRow}>
          <View style={styles.alertTitleBlock}>
            <Text style={styles.alertType}>{alert.type}</Text>
            <Text style={styles.alertSubtitle}>{alert.title}</Text>
          </View>
          <Text style={[styles.statusBadge, getStatusStyle(alert.status)]}>{alert.status}</Text>
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
              {alert.location?.address || `Lat: ${alert.location?.latitude?.toFixed(4)}, Lng: ${alert.location?.longitude?.toFixed(4)}`}
            </Text>
          </View>
        </View>

        {/* Botón Finalizar solo si está activa */}
        {['CREADA', 'NOTIFICADA', 'ATENDIDA'].includes(alert.status) && (
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
              onPress={() => onUpdate(alert.id)}
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
  const { alerts, loading, refreshing, fetchHistory, refresh, finalizeAlert } = useAlertHistoryViewModel();

  useEffect(() => {
    fetchHistory();
  }, []);

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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#fff" />}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FF9E5D" style={{ marginTop: 50 }} />
          ) : alerts.length > 0 ? (
            alerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onUpdate={finalizeAlert} />
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
