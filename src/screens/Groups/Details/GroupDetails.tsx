import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    FlatList,
    SafeAreaView,
    ActivityIndicator,
    StyleSheet,
    Alert,
    Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../../../theme/theme';
import api from '../../../api/api';
import Header from '../../../components/Header/Header';
import { GroupChatScreenProps } from '../../../navigation/Navigator'; // Reusing props type mostly or defining new
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../../navigation/Navigator';

type GroupDetailsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'GroupDetails'>;
type GroupDetailsScreenRouteProp = RouteProp<RootStackParamList, 'GroupDetails'>;

interface GroupDetailsProps {
    navigation: GroupDetailsScreenNavigationProp;
    route: GroupDetailsScreenRouteProp;
}

interface Member {
    id: string;
    nombre: string;
    foto?: string;
    estado: string;
}

const GroupDetails: React.FC<GroupDetailsProps> = ({ navigation, route }) => {
    const { group } = route.params;
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [groupImage, setGroupImage] = useState<string | null>(group.image as any); // Type cast for now
    // Actually group from params might not have image URL updated if we just fetch it.
    // We should fetch full group details including fresh image and code.
    const [fullGroup, setFullGroup] = useState<any>(null);

    useEffect(() => {
        fetchGroupDetails();
        fetchMembers();
    }, []);

    const fetchGroupDetails = async () => {
        try {
            const response = await api.get(`/grupos/detalle/${group.id}`);
            setFullGroup(response.data);
            if (response.data.imagen) {
                // Construct full URL if relative
                const baseURL = api.defaults.baseURL || '';
                setGroupImage(`${baseURL}${response.data.imagen}`);
            }
        } catch (error) {
            console.error('Error fetching group details:', error);
        }
    };

    const fetchMembers = async () => {
        try {
            const response = await api.get(`/grupos/miembros/${group.id}`);
            setMembers(response.data);
        } catch (error) {
            console.error('Error fetching members:', error);
        } finally {
            setLoading(false);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled) {
            uploadImage(result.assets[0].uri);
        }
    };

    const uploadImage = async (uri: string) => {
        const formData = new FormData();
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', { uri, name: filename, type } as any);

        try {
            setLoading(true);
            const response = await api.post(`/grupos/foto/${group.id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            Alert.alert('Éxito', 'Foto de grupo actualizada');
            fetchGroupDetails(); // Refresh
        } catch (error) {
            Alert.alert('Error', 'No se pudo subir la imagen');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const renderMember = ({ item }: { item: Member }) => {
        // Fix photo URL
        const baseURL = api.defaults.baseURL || '';
        const photoUrl = item.foto ? `${baseURL}${item.foto}` : null;

        return (
            <View style={styles.memberItem}>
                {photoUrl ? (
                    <Image source={{ uri: photoUrl }} style={styles.memberAvatar} />
                ) : (
                    <View style={[styles.memberAvatar, { backgroundColor: '#ccc', justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="person" size={20} color="#fff" />
                    </View>
                )}
                <Text style={styles.memberName}>{item.nombre}</Text>
                {item.estado === 'admin' && <Ionicons name="star" size={16} color="gold" />}
            </View>
        );
    };

    return (
        <LinearGradient
            colors={theme.colors.gradientBackground}
            style={styles.container}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
        >
            <SafeAreaView style={{ flex: 1 }}>
                <Header
                    customTitle="Detalles del Grupo"
                    showBackButton
                    onBackPress={() => navigation.goBack()}
                />

                <View style={styles.content}>
                    <View style={styles.headerInfo}>
                        <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
                            {fullGroup?.imagen ? (
                                <Image source={{ uri: `${api.defaults.baseURL}${fullGroup.imagen}` }} style={styles.groupImage} />
                            ) : (
                                <View style={[styles.groupImage, { backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' }]}>
                                    <Ionicons name="camera" size={40} color="#fff" />
                                </View>
                            )}
                            <View style={styles.editIcon}>
                                <Ionicons name="pencil" size={12} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        <Text style={styles.groupName}>{fullGroup?.nombre || group.name}</Text>
                        <Text style={styles.groupDesc}>{fullGroup?.descripcion || 'Sin descripción'}</Text>

                        {fullGroup?.codigo && (
                            <View style={styles.codeContainer}>
                                <Text style={styles.codeLabel}>Código de Acceso:</Text>
                                <Text style={styles.codeValue}>{fullGroup.codigo}</Text>
                            </View>
                        )}
                    </View>

                    <Text style={styles.sectionTitle}>Miembros ({members.length})</Text>

                    {loading ? (
                        <ActivityIndicator color="#fff" style={{ marginTop: 20 }} />
                    ) : (
                        <FlatList
                            data={members}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={renderMember}
                            style={styles.list}
                        />
                    )}
                </View>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { flex: 1, padding: 20 },
    headerInfo: { alignItems: 'center', marginBottom: 30 },
    imageContainer: { position: 'relative', marginBottom: 15 },
    groupImage: { width: 100, height: 100, borderRadius: 50, borderWidth: 2, borderColor: '#fff' },
    editIcon: {
        position: 'absolute', bottom: 0, right: 0,
        backgroundColor: '#007AFF', borderRadius: 12, width: 24, height: 24,
        justifyContent: 'center', alignItems: 'center'
    },
    groupName: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
    groupDesc: { fontSize: 14, color: '#ccc', textAlign: 'center', marginBottom: 15 },
    codeContainer: {
        backgroundColor: 'rgba(0,0,0,0.3)', paddingHorizontal: 20, paddingVertical: 10,
        borderRadius: 10, alignItems: 'center'
    },
    codeLabel: { color: '#aaa', fontSize: 12, marginBottom: 2 },
    codeValue: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 10, marginTop: 10 },
    list: { flex: 1 },
    memberItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.1)'
    },
    memberAvatar: { width: 40, height: 40, borderRadius: 20, marginRight: 15 },
    memberName: { color: '#fff', fontSize: 16 }
});

export default GroupDetails;
