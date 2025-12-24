import React, { useState, useEffect, ReactNode } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { CheckCircle, Heart, Eye } from 'lucide-react-native';
import GlobalHeaderWrapper from "../../components/Header/GlobalHeaderWrapper";
import { styles, theme } from "./InformationStyles";
import { normalize } from "../../utils/dimensions";

// Tipos para el contenido global
interface Section {
    key: 'howItWorks' | 'mission' | 'vision';
    title: string;
    content: string;
}

interface ContenidoApp {
    gradientStart: string;
    gradientEnd: string;
    fontFamily: string;
    mainTitle: string;
    sections: Section[];
}

// Hardcoded content data based on the image provided
const HARDCODED_APP_CONTENT: ContenidoApp = {
    gradientStart: theme.colors.gradientBackground[0],
    gradientEnd: theme.colors.gradientBackground[1],
    fontFamily: 'System',
    mainTitle: 'Un toque para tu seguridad',
    sections: [
        {
            key: 'howItWorks',
            title: 'Cómo Funciona',
            content: 'Presiona el botón de pánico 3 veces para enviar una alerta instantánea a nuestra central, a la comunidad cercana y a tus contactos de emergencia.'
        },
        {
            key: 'mission',
            title: 'Nuestra Misión',
            content: 'Proporcionar una herramienta de respuesta rápida que conecte a personas en emergencia con ayuda inmediata, fortaleciendo la seguridad y la colaboración ciudadana a través de la tecnología.'
        },
        {
            key: 'vision',
            title: 'Nuestra Visión',
            content: 'Ser la plataforma de seguridad colaborativa líder, creando vecindarios más seguros y resilientes donde cada miembro de la comunidad se sienta protegido y respaldado en todo momento.'
        }
    ]
};


// Tipar los iconos
const ICONS: Record<Section['key'], (color: string) => ReactNode> = {
    howItWorks: (color: string) => <CheckCircle size={normalize(24)} color={color} />,
    mission: (color: string) => <Heart size={normalize(24)} color={color} />,
    vision: (color: string) => <Eye size={normalize(24)} color={color} />,
};

const ICON_BG: Record<Section['key'], string> = {
    howItWorks: 'rgba(255, 75, 75, 0.1)', // Red tint
    mission: 'rgba(255, 75, 75, 0.1)',
    vision: 'rgba(255, 75, 75, 0.1)'
};

const ICON_COLOR: Record<Section['key'], string> = {
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
    const [contenido, setContenido] = useState<ContenidoApp | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Commented out original fetch call
        // fetch('http://192.168.1.31:9000/api/mobile-content')
        //     .then(res => res.json())
        //     .then((data: ContenidoApp) => {
        //         setContenido(data);
        //         setLoading(false);
        //     })
        //     .catch(() => setLoading(false));

        // Simulate network delay for hardcoded data
        setTimeout(() => {
            setContenido(HARDCODED_APP_CONTENT); // Use hardcoded data
            setLoading(false);
        }, 500); // Simulate a short loading time
    }, []);

    if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={theme.colors.primary} />;
    if (!contenido) return <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>No se pudo cargar el contenido (datos quemados no disponibles).</Text>;

    return (
        <LinearGradient
            colors={[contenido.gradientStart, contenido.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientContainer}
        >
            <SafeAreaView style={styles.safeArea}>
                <GlobalHeaderWrapper showBackButton={true} />
                <ScrollView contentContainerStyle={styles.contentContainer}>
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { fontFamily: contenido.fontFamily }]}>{contenido.mainTitle}</Text>
                        <View style={{ width: 60, height: 4, backgroundColor: theme.colors.primary, borderRadius: 2, marginTop: 6, marginBottom: 2, alignSelf: 'center', opacity: 0.7 }} />
                    </View>
                    {contenido.sections.map((section) => (
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