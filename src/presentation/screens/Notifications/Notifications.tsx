import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  TouchableOpacity,
  Modal,
  TextInput,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  Dimensions
} from 'react-native';
import { ShieldAlert, Siren, Bell, MapPin, Navigation } from 'lucide-react-native';
import GlobalHeaderWrapper from '../../components/Header/GlobalHeaderWrapper';
import { theme } from '../../styles/theme';
import { Notification, NotificationsProps } from './types';
import { normalize } from '../../../shared/utils/dimensions';
import MapView, { Marker } from 'react-native-maps';
import { LinearGradient } from 'expo-linear-gradient';
// import api removed
// import AsyncStorage removed
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

const NotificationCard: React.FC<{
  notification: Notification;
  index: number;
  onDelete: (id: string) => void;
  onMapPress: (location: { latitude: number; longitude: number }) => void;
  onCalificarPress: (notification: Notification) => void;
}> = ({ notification, index, onDelete, onMapPress, onCalificarPress }) => {

  // Design Config based on status/type (Optional refinement)
  const isMedical = notification.title.includes('MEDICA') || notification.alertType === 'sos';
  const isPreventive = notification.title.includes('PREVENTIVA');

  // Custom Styles for "Alerta: TYPE"
  const typeColor = isMedical ? '#ef4444' : isPreventive ? '#64748b' : '#Eab308';

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={styles.cardContainer}
    >
      <View style={styles.strip} />

      {/* Absolute Bell Icon on the strip/edge */}
      <View style={styles.iconBadge}>
        <Bell size={16} color="#FFF" />
      </View>

      <View style={styles.cardContent}>
        {/* Header: Title + Date */}
        <View style={styles.headerRow}>
          <Text style={styles.cardTitle}>Alerta de Seguridad</Text>
          <Text style={styles.cardDate}>{notification.time}</Text>
        </View>

        {/* Subtitle: Type */}
        <Text style={[styles.cardType, { color: typeColor }]}>
          {notification.title}
        </Text>

        {/* Description */}
        <Text style={styles.cardDesc} numberOfLines={2}>
          {notification.description}
        </Text>

        {/* Image (Placeholder or Real) - Absolute Right */}
        <Image
          source={require('../../../assets/noti.jpg')}
          style={styles.cardImage}
          resizeMode="cover"
        />

        {/* Buttons Row */}
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.btnLocation}
            onPress={() => onMapPress(notification.location)}
          >
            <MapPin size={16} color="#FFF" style={{ marginRight: 6 }} />
            <Text style={styles.btnText}>Ver ubicación</Text>
          </TouchableOpacity>

          {notification.status === 'pending' && (
            <TouchableOpacity
              style={styles.btnRate}
              onPress={() => onCalificarPress(notification)}
            >
              <Text style={styles.btnText}>Calificar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Animated.View>
  );
};

import { useNotificationsViewModel } from '../../hooks/useNotificationsViewModel';

const NotificationsScreen: React.FC<NotificationsProps> = ({ navigation }) => {
  const { notifications, loading, refreshing, refresh, setNotifications } = useNotificationsViewModel();
  const [mapLocation, setMapLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  // Rating State
  const [showCalificarModal, setShowCalificarModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [calificacionStep, setCalificacionStep] = useState<'select' | 'input'>('select');
  const [calificacionTipo, setCalificacionTipo] = useState<'sos' | '911' | 'unnecessary' | null>(null);
  const [calificacionMensaje, setCalificacionMensaje] = useState('');

  useEffect(() => {
    refresh();
  }, [refresh]);

  const onRefresh = () => { refresh(); };

  // Rating Handlers
  const handleCalificar = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowCalificarModal(true);
    setCalificacionMensaje('');
    setCalificacionStep('select');
    setCalificacionTipo(null);
  };

  const handleSelectTipo = (tipo: 'sos' | '911' | 'unnecessary') => {
    setCalificacionTipo(tipo);
    setCalificacionStep('input');
  };

  const handleEnviarCalificacion = () => {
    if (!selectedNotification || !calificacionTipo) return;
    // Optimistic Update
    setNotifications((prev: Notification[]) => prev.map((n: Notification) => n.id === selectedNotification.id ? { ...n, status: calificacionTipo } : n));
    setShowCalificarModal(false);
    // Here you would typically call API to save response
  };

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea}>
        <GlobalHeaderWrapper showBackButton={true} />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#fff" />}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FF9E5D" style={{ marginTop: 50 }} />
          ) : notifications.length > 0 ? (
            notifications.map((item: Notification, index: number) => (
              <NotificationCard
                key={item.id}
                index={index}
                notification={item}
                onDelete={() => { }}
                onMapPress={setMapLocation}
                onCalificarPress={handleCalificar}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Bell size={50} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyText}>Sin notificaciones nuevas</Text>
            </View>
          )}
        </ScrollView>

        {/* Map Modal */}
        <Modal visible={!!mapLocation} transparent animationType="slide" onRequestClose={() => setMapLocation(null)}>
          <View style={styles.modalOverlay}>
            <View style={styles.mapModal}>
              <View style={styles.mapHeader}>
                <Text style={styles.mapTitle}>Ubicación de Alerta</Text>
                <TouchableOpacity onPress={() => setMapLocation(null)}>
                  <Text style={styles.closeMapText}>X</Text>
                </TouchableOpacity>
              </View>
              <MapView
                style={{ flex: 1 }}
                initialRegion={{
                  latitude: mapLocation?.latitude || 0,
                  longitude: mapLocation?.longitude || 0,
                  latitudeDelta: 0.005,
                  longitudeDelta: 0.005,
                }}
              >
                <Marker coordinate={mapLocation || { latitude: 0, longitude: 0 }} />
              </MapView>
            </View>
          </View>
        </Modal>

        {/* Rating Modal (Simplified for brevity but styled) */}
        <Modal visible={showCalificarModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.ratingModal}>
              {calificacionStep === 'select' ? (
                <>
                  <Text style={styles.ratingTitle}>Calificar Alerta</Text>
                  <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: '#FFB26B' }]} onPress={() => handleSelectTipo('sos')}>
                    <Siren size={20} color="#fff" />
                    <Text style={styles.ratingBtnText}>Emergencia Real (SOS)</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: '#FF6B6B' }]} onPress={() => handleSelectTipo('911')}>
                    <ShieldAlert size={20} color="#fff" />
                    <Text style={styles.ratingBtnText}>911 - Crítica</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: '#4EC9B0' }]} onPress={() => handleSelectTipo('unnecessary')}>
                    <Bell size={20} color="#fff" />
                    <Text style={styles.ratingBtnText}>Falsa / Innecesaria</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setShowCalificarModal(false)}>
                    <Text style={styles.cancelText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.ratingTitle}>Comentario (Opcional)</Text>
                  <TextInput
                    style={styles.commentInput}
                    placeholder="Detalles..."
                    placeholderTextColor="#666"
                    value={calificacionMensaje}
                    onChangeText={setCalificacionMensaje}
                  />
                  <TouchableOpacity style={[styles.ratingBtn, { backgroundColor: '#00BFA5' }]} onPress={handleEnviarCalificacion}>
                    <Text style={styles.ratingBtnText}>Enviar Calificación</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  // Card Styles
  cardContainer: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    flexDirection: 'row',
  },
  strip: {
    width: 6,
    backgroundColor: '#fff',
    height: '100%',
  },
  iconBadge: {
    position: 'absolute',
    left: -6, // Overlap the strip
    top: '40%',
    backgroundColor: '#333',
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fff',
    zIndex: 10,
    marginLeft: 10, // Adjust to position correctly relative to strip
  },
  cardContent: {
    flex: 1,
    padding: 16,
    paddingLeft: 20, // Space for the visual strip area if needed
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  cardTitle: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cardDate: {
    color: '#9ca3af',
    fontSize: 12,
  },
  cardType: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  cardDesc: {
    color: '#d1d5db',
    fontSize: 14,
    marginBottom: 12,
    maxWidth: '70%', // Make room for image
  },
  cardImage: {
    position: 'absolute',
    right: 15,
    top: 40,
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  btnLocation: {
    flex: 1,
    backgroundColor: '#00BFA5', // Teal/Cyan
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnRate: {
    flex: 1,
    backgroundColor: '#6b7280', // Grey
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },

  // Empty State
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
    opacity: 0.7,
  },
  emptyText: {
    color: '#FFF',
    marginTop: 10,
    fontSize: 16,
  },

  // Modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center',
    padding: 20,
  },
  mapModal: {
    height: 400,
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    overflow: 'hidden',
  },
  mapHeader: {
    padding: 15,
    backgroundColor: '#262626',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mapTitle: { color: '#FFF', fontWeight: 'bold' },
  closeMapText: { color: '#ccc', fontSize: 18, fontWeight: 'bold' },

  ratingModal: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 25,
    borderWidth: 1,
    borderColor: '#333',
  },
  ratingTitle: { color: '#FFF', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  ratingBtn: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    gap: 10,
  },
  ratingBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 15 },
  cancelText: { color: '#888', textAlign: 'center', marginTop: 10 },
  commentInput: {
    backgroundColor: '#333',
    color: '#FFF',
    borderRadius: 10,
    padding: 12,
    minHeight: 80,
    textAlignVertical: 'top',
    marginBottom: 15
  }
});

export default NotificationsScreen;
