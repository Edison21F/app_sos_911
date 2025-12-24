import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  SafeAreaView,
  TextInput,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import GlobalHeaderWrapper from '../../components/Header/GlobalHeaderWrapper';
import { GroupsScreenProps } from '../../navigation/Navigator';
import styles from './GroupsStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../theme/theme';
import api from '../../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

interface Group {
  id: string;
  name: string;
  description: string;
  miembros: number;
  image?: any;
}

export const GroupsScreen: React.FC<GroupsScreenProps> = ({ navigation }) => {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchGroups = async () => {
    try {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) return;

      const response = await api.get('/grupos/listar', {
        params: { clienteId }
      });

      setGroups(response.data.map((g: any) => ({
        id: g.id.toString(),
        name: g.nombre,
        description: g.descripcion,
        miembros: g.miembros || 0,
        image: null // Placeholder
      })));
    } catch (error) {
      console.error('Error fetching groups:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchGroups();
    }, [])
  );

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchGroups();
  }, []);

  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      activeOpacity={0.8}
      onPress={() => {
        // Navigate to Chat
        navigation.navigate('GroupChat', { group: item });
      }}
    >
      <View style={styles.groupImageContainer}>
        <View style={styles.groupImagePlaceholder}>
          <Text style={styles.groupImagePlaceholderText}>
            {item.name.charAt(0).toUpperCase()}
          </Text>
        </View>
      </View>
      <View style={styles.groupInfo}>
        <Text style={styles.groupName}>{item.name}</Text>
        <Text style={styles.groupDescription} numberOfLines={1}>
          {item.description}
        </Text>
        <Text style={styles.groupMembers}>
          {item.miembros} {item.miembros === 1 ? 'miembro' : 'miembros'}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={theme.colors.gradientBackground}
      style={styles.backgroundImage}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <SafeAreaView style={styles.container}>
        <GlobalHeaderWrapper showBackButton={true} />

        {isLoading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#FFF" />
          </View>
        ) : groups.length > 0 ? (
          <FlatList
            data={groups}
            keyExtractor={(item) => item.id}
            renderItem={renderGroup}
            style={styles.content}
            showsVerticalScrollIndicator={false}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#FFF" />}
          />
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No perteneces a ningún grupo</Text>
            <Text style={styles.emptyStateSubtext}>
              Únete a uno con un código o crea el tuyo.
            </Text>
          </View>
        )}

        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('AddGroup')}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default GroupsScreen;