import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlobalHeaderWrapper from '../../components/Header/GlobalHeaderWrapper';
import { GroupsScreenProps } from '../../navigation/Navigator';
import styles from './GroupsStyles';
import { LinearGradient } from 'expo-linear-gradient';
import { theme } from '../../styles/theme';
import { Group } from '../../../domain/entities/Group';
import { useGroupsViewModel } from '../../hooks/useGroupsViewModel';

export const GroupsScreen: React.FC<GroupsScreenProps> = ({ navigation }) => {
  const { groups, isLoading, refreshing, onRefresh } = useGroupsViewModel();

  const renderGroup = ({ item }: { item: Group }) => (
    <TouchableOpacity
      style={styles.groupItem}
      activeOpacity={0.8}
      onPress={() => {
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
          {item.memberCount} {item.memberCount === 1 ? 'miembro' : 'miembros'}
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