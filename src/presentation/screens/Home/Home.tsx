// HomeScreen.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView as RNSafeAreaView,
  StatusBar,
  Animated,
  Easing,
  Alert,
  Modal,
  Linking,
  Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle, G } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { Phone, Shield, Lock, AlertTriangle } from 'lucide-react-native';
import ModernHeader from '../../components/Header/ModernHeader';
import { styles } from './HomeStyles';
import { normalize } from '../../../shared/utils/dimensions';
import { HomeScreenProps } from './types';
import { theme } from '../../styles/theme';
import { useHomeViewModel } from '../../hooks/useHomeViewModel';

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { user, profileImageUrl, initHome, toggleAutoLogin, autoLoginEnabled, logout } = useHomeViewModel();

  // Local UI State
  const [isButtonActive, setIsButtonActive] = useState(false);
  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isCooldownActive, setIsCooldownActive] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [rotation, setRotation] = useState(0);
  const animationFrameRef = useRef<number>(0);
  const pulseAnimValue = useRef(new Animated.Value(1)).current;
  const securityButtonFade = useRef(new Animated.Value(1)).current;

  // Header Data derived from ViewModel
  const userName = user ? user.name.split(' ')[0] : "Usuario";

  useEffect(() => {
    // Animate rotation
    const animate = () => {
      setRotation(prev => (prev + 0.3) % 360);
      animationFrameRef.current = requestAnimationFrame(animate);
    };
    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    initHome();
  }, [initHome]);

  useEffect(() => {
    if (isAlertModalOpen || isCooldownActive) {
      Animated.timing(securityButtonFade, { toValue: 0, duration: 300, useNativeDriver: true }).start();
    } else {
      Animated.timing(securityButtonFade, { toValue: 1, duration: 300, useNativeDriver: true }).start();
    }
  }, [isAlertModalOpen, isCooldownActive]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCooldownActive && cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime(prev => {
          if (prev <= 1) { setIsCooldownActive(false); return 0; }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isCooldownActive, cooldownTime]);

  const handleResolvePress = () => setIsButtonActive(false);

  const handleAutoLoginToggle = async () => {
    try {
      const newValue = await toggleAutoLogin();
      if (!newValue) {
        Alert.alert('Auto-login desactivado', 'Deberás iniciar sesión manualmente la próxima vez.', [{ text: 'Entendido' }]);
      } else {
        Alert.alert('Auto-login activado', 'La aplicación recordará tu sesión.', [{ text: 'Perfecto' }]);
      }
    } catch (error) { Alert.alert('Error', 'No se pudo cambiar la configuración'); }
  };

  // Logout Logic
  const handleLogout = () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
              });
            } catch (e) {
              console.error("Error logging out", e);
            }
          }
        }
      ]
    );
  };

  const renderSecurityModal = () => {
    return (
      <Modal
        visible={isSecurityModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsSecurityModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Shield size={normalize(32)} color={theme.colors.primary} />
              <Text style={styles.modalTitle}>Seguridad de Sesión</Text>
            </View>
            <View style={styles.modalBody}>
              <Text style={styles.modalDescription}>Controla cómo inicias sesión en la aplicación</Text>
              <View style={styles.switchContainer}>
                <View style={styles.switchRow}>
                  <View style={styles.switchLabelContainer}>
                    <Lock size={normalize(20)} color="#666" />
                    <Text style={styles.switchLabel}>Inicio automático</Text>
                  </View>
                  <Switch
                    value={autoLoginEnabled}
                    onValueChange={handleAutoLoginToggle}
                    thumbColor={autoLoginEnabled ? theme.colors.primary : '#f4f3f4'}
                    trackColor={{ false: '#767577', true: `${theme.colors.primary}80` }}
                  />
                </View>
                <Text style={styles.switchDescription}>
                  {autoLoginEnabled ? 'La app recordará tu sesión para accesos futuros' : 'Deberás iniciar sesión manualmente cada vez'}
                </Text>
              </View>
            </View>
            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={() => setIsSecurityModalOpen(false)}>
                <Text style={styles.modalCloseText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderResolveButton = () => {
    if (!isButtonActive) return null;
    return (
      <TouchableOpacity style={styles.resolveButton} onPress={handleResolvePress} activeOpacity={0.8}>
        <LinearGradient colors={[theme.colors.success, '#1E8449']} style={styles.resolveGradient} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <Text style={styles.resolveText}>Resuelto</Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const handleEmergencyCall = async () => {
    Linking.openURL('tel:911').catch(() => Alert.alert('Error', 'No se pudo iniciar la llamada'));
  };

  const handleEmergencyPress = () => {
    if (isCooldownActive) return;
    navigation.navigate('EmergencySelection');
  };

  const formatCooldownTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Alert Modal
  const renderAlertModal = () => isAlertModalOpen ? (<View />) : null;

  const renderFuturisticElements = () => {
    const centerX = normalize(200);
    const centerY = normalize(200);
    const maxRadius = normalize(190);
    return (
      <Svg style={styles.linesContainer}>
        <G transform={`rotate(${rotation}, ${centerX}, ${centerY})`}>
          {[0.4, 0.6, 0.8, 1].map((scale, index) => (
            <Circle
              key={`circle-${index}`}
              cx={centerX}
              cy={centerY}
              r={maxRadius * scale}
              stroke="rgba(255, 75, 75, 0.2)"
              strokeWidth="1.5"
              fill="none"
              strokeDasharray={`${normalize(5)},${normalize(15)}`}
            />
          ))}
        </G>
        <Circle cx={centerX} cy={centerY} r={normalize(20)} fill="rgba(255, 255, 255, 0.05)" />
      </Svg>
    );
  };

  useEffect(() => {
    let pulseAnimation: Animated.CompositeAnimation | null = null;
    if (!isButtonActive && !isAlertModalOpen && !isCooldownActive) {
      pulseAnimation = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnimValue, { toValue: 1.04, duration: 600, useNativeDriver: true }),
          Animated.timing(pulseAnimValue, { toValue: 1, duration: 600, useNativeDriver: true }),
        ])
      );
      pulseAnimation.start();
    } else {
      pulseAnimValue.setValue(1);
    }
    return () => { if (pulseAnimation) pulseAnimation.stop(); pulseAnimValue.setValue(1); };
  }, [isButtonActive, isAlertModalOpen, isCooldownActive]);

  const renderButton = () => {
    return (
      <TouchableOpacity onPress={handleEmergencyPress} activeOpacity={isCooldownActive ? 1 : 0.9} disabled={isCooldownActive}>
        <Animated.View style={{ transform: [{ scale: pulseAnimValue }] }}>
          <LinearGradient
            colors={isCooldownActive ? ['#95A5A6', '#7F8C8D'] : theme.colors.gradientButton}
            style={[styles.innerButton, isButtonActive && styles.innerButtonActive]}
            start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
          >
            {isCooldownActive ? (
              <View style={styles.buttonContent}>
                <Text style={styles.buttonText}>SOS</Text>
                <Text style={styles.subtitleText}>Disponible en {formatCooldownTime(cooldownTime)}</Text>
              </View>
            ) : (
              <View style={styles.buttonContent}>
                <Text style={[styles.buttonText, isButtonActive && styles.buttonTextActive]}>SOS</Text>
                {!isButtonActive && <Text style={styles.subtitleText}>Presionar una vez</Text>}
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  const renderNearbyPeople = () => {
    return null;
  };

  return (
    <LinearGradient colors={theme.colors.gradientBackground} style={styles.backgroundImage} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* NEW MODERN HEADER */}
        <ModernHeader
          userName={userName}
          notificationCount={2}
          onLogout={handleLogout}
          onNotificationPress={() => navigation.navigate('Notifications')}
          onProfilePress={() => navigation.navigate('Profile')}
          profileImage={profileImageUrl} // Use correct variable from viewModel
        />

        <Text style={[styles.title, isButtonActive && { marginTop: normalize(18) }]}>
          {isAlertModalOpen ? "Alerta activa" : isButtonActive ? "Alerta activa" : isCooldownActive ? `Disponible en ${formatCooldownTime(cooldownTime)}` : "Un toque para tu seguridad"}
        </Text>

        <View style={[styles.content, { paddingBottom: 120 }]}>
          <View style={styles.buttonContainer}>
            {renderFuturisticElements()}
            <Animated.View style={[styles.outerButton, isButtonActive && styles.outerButtonActive]}>
              {renderButton()}
            </Animated.View>
            {renderNearbyPeople()}
          </View>

          <TouchableOpacity style={styles.emergencyTag} onPress={handleEmergencyCall}>
            <Phone size={normalize(26)} color={theme.colors.primary} />
            <Text style={styles.emergencyText}>911</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.nearbyValuesButton} onPress={() => navigation.navigate('NearbyAlerts')}>
            <AlertTriangle size={normalize(20)} color={theme.colors.text} style={{ marginRight: 8 }} />
            <Text style={styles.nearbyValuesText}>Alertas Cercanas</Text>
          </TouchableOpacity>
          <View style={{ height: 20 }} />
        </View>

        <Animated.View style={[styles.securityButton, { opacity: securityButtonFade }]}>
          <TouchableOpacity style={styles.securityButtonContent} onPress={() => setIsSecurityModalOpen(true)} activeOpacity={0.8}>
            <Shield size={normalize(20)} color={theme.colors.primary} />
            <Text style={styles.securityButtonText}>Seguridad de Sesión</Text>
          </TouchableOpacity>
        </Animated.View>
        {renderSecurityModal()}
        {renderAlertModal()}
      </SafeAreaView>
    </LinearGradient>
  );
};

export default HomeScreen;