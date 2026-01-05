import React, { ReactNode } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Heart, Eye } from 'lucide-react-native';
import GlobalHeaderWrapper from "../../components/Header/GlobalHeaderWrapper";
import { styles, theme } from "./InformationStyles";
import { normalize } from '../../../shared/utils/dimensions';
import { useInformationViewModel } from '../../hooks/useInformationViewModel';
import { AppContent } from '../../../domain/entities/AppContent';
import api from '../../../infrastructure/http/client';

// Tipar los iconos
const ICONS: Record<AppContent['sections'][0]['key'], (color: string) => ReactNode> = {
  howItWorks: (color: string) => <CheckCircle size={normalize(24)} color={color} />,
  mission: (color: string) => <Heart size={normalize(24)} color={color} />,
  vision: (color: string) => <Eye size={normalize(24)} color={color} />,
};

const ICON_BG: Record<AppContent['sections'][0]['key'], string> = {
  howItWorks: `${theme.colors.primary}1A`, // 10% opacity hex
  mission: `${theme.colors.primary}1A`,
  vision: `${theme.colors.primary}1A`
};

const ICON_COLOR: Record<AppContent['sections'][0]['key'], string> = {
  howItWorks: theme.colors.primary,
  mission: theme.colors.primary,
  vision: theme.colors.primary
};

interface InfoCardProps {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  iconBgColor: string;
}

const InfoCard: React.FC<InfoCardProps> = ({ icon, title, children, iconBgColor }) => (
  <View style={styles.infoCard}>
    <View style={styles.cardHeader}>
      <View style={[styles.iconContainer, { backgroundColor: iconBgColor }]}>
        {icon}
      </View>
      <Text style={styles.cardTitle}>{title}</Text>
    </View>
    <Text style={styles.cardText}>{children}</Text>
  </View>
);

const InformationScreen = () => {
  const navigation = useNavigation();
  const { content, loading, isLoaded } = useInformationViewModel();

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.colors.primary} />;
  if (!isLoaded || !content) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>No se pudo cargar el contenido.</Text>;

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.safeArea}>
        <GlobalHeaderWrapper showBackButton={true} />
        <ScrollView contentContainerStyle={styles.contentContainer}>
          <View style={styles.header}>
            <Text style={[styles.headerTitle, { fontFamily: content.fontFamily }]}>{content.mainTitle}</Text>
            <View style={{ width: 60, height: 4, backgroundColor: theme.colors.primary, borderRadius: 2, marginTop: 6, marginBottom: 2, alignSelf: 'center', opacity: 0.7 }} />
          </View>
          {content.sections.map((section) => (
            <InfoCard
              key={section.key}
              title={section.title}
              iconBgColor={ICON_BG[section.key]}
              icon={ICONS[section.key](ICON_COLOR[section.key])}
            >
              {section.content}
            </InfoCard>
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default InformationScreen;