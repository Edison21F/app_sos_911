import { useState, useCallback } from 'react';
import { Group } from '../../domain/entities/Group';
import { container } from '../../infrastructure/di/container';
import { useFocusEffect } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useGroupsViewModel = () => {
    const [groups, setGroups] = useState<Group[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchGroups = useCallback(async () => {
        try {
            const user = await container.getCurrentUserUseCase.execute();
            if (!user) return; // Should likely redirect to login if no user, but checked elsewhere

            const fetchedGroups = await container.getGroupsUseCase.execute(String(user.id));
            setGroups(fetchedGroups);
            setError(null);
        } catch (err) {
            console.error('Error fetching groups:', err);
            setError('No se pudieron cargar los grupos');
        } finally {
            setIsLoading(false);
            setRefreshing(false);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchGroups();
        }, [fetchGroups])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchGroups();
    }, [fetchGroups]);

    return {
        groups,
        isLoading,
        refreshing,
        error,
        onRefresh
    };
};
