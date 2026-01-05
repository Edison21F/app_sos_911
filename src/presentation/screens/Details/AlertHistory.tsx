import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, RefreshControl, ScrollView, TouchableOpacity, TextInput, Modal, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/Header/Header';
import styles from './AlertHistoryStyles';
import { ShieldAlert, Siren, Calendar, MapPin, Filter, X, ChevronDown } from 'lucide-react-native';
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
    const [showFilters, setShowFilters] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);

   useEffect(() => {
     fetchHistory();
   }, []);

   const filteredAlerts = alerts.filter(alert => {
     const matchesType = !filterType || alert.type === filterType;
     const matchesStatus = !filterStatus || alert.status === filterStatus;
     const matchesDate = !filterDate || (alert.time && format(new Date(alert.time), 'yyyy-MM-dd').includes(filterDate));
     return matchesType && matchesStatus && matchesDate;
   });

   const clearFilters = () => {
     setFilterType('');
     setFilterStatus('');
     setFilterDate('');
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

        {/* Filter Toggle */}
        <View style={styles.filterContainer}>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setShowFilters(!showFilters)}>
            <Filter size={20} color="#FFF" />
            <Text style={styles.filterBtnText}>Filtros</Text>
          </TouchableOpacity>
          {(filterType || filterStatus || filterDate) && (
            <TouchableOpacity style={styles.clearBtn} onPress={clearFilters}>
              <X size={16} color="#FFF" />
              <Text style={styles.clearBtnText}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        {showFilters && (
          <View style={styles.filtersPanel}>
            <Text style={styles.filterTitle}>Filtrar por:</Text>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Tipo:</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowTypeModal(true)}>
                <Text style={styles.dropdownText}>{filterType || 'Todos'}</Text>
                <ChevronDown size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Estado:</Text>
              <TouchableOpacity style={styles.dropdown} onPress={() => setShowStatusModal(true)}>
                <Text style={styles.dropdownText}>{filterStatus || 'Todos'}</Text>
                <ChevronDown size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.filterRow}>
              <Text style={styles.filterLabel}>Fecha (YYYY-MM-DD):</Text>
              <TextInput
                style={styles.dateInput}
                placeholder="Ej: 2023-12-01"
                placeholderTextColor="#666"
                value={filterDate}
                onChangeText={setFilterDate}
              />
            </View>
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor="#fff" />}
        >
          {loading ? (
            <ActivityIndicator size="large" color="#FF9E5D" style={{ marginTop: 50 }} />
          ) : filteredAlerts.length > 0 ? (
            filteredAlerts.map(alert => (
              <AlertCard key={alert.id} alert={alert} onUpdate={finalizeAlert} />
            ))
          ) : (
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Text style={styles.noDataText}>No tienes historial de alertas.</Text>
            </View>
          )}
        </ScrollView>

        {/* Type Modal */}
        <Modal visible={showTypeModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Tipo</Text>
              <FlatList
                data={[
                  { label: 'Todos', value: '' },
                  { label: 'MEDICA', value: 'MEDICA' },
                  { label: 'INCENDIO', value: 'INCENDIO' },
                  { label: 'PELIGRO', value: 'PELIGRO' },
                  { label: 'TRANSITO', value: 'TRANSITO' },
                  { label: 'PREVENTIVA', value: 'PREVENTIVA' },
                ]}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setFilterType(item.value);
                      setShowTypeModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowTypeModal(false)}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Status Modal */}
        <Modal visible={showStatusModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Seleccionar Estado</Text>
              <FlatList
                data={[
                  { label: 'Todos', value: '' },
                  { label: 'CREADA', value: 'CREADA' },
                  { label: 'CANCELADA', value: 'CANCELADA' },
                ]}
                keyExtractor={(item) => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setFilterStatus(item.value);
                      setShowStatusModal(false);
                    }}
                  >
                    <Text style={styles.modalItemText}>{item.label}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.modalClose} onPress={() => setShowStatusModal(false)}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </SafeAreaView>
    </LinearGradient>
  );
};

export default AlertHistoryComponent;
