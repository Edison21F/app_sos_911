import { useState, useCallback, useEffect } from 'react';
import { Group } from '../../domain/entities/Group';
import { container } from '../../infrastructure/di/container';
import { API_URL } from '../../config/constants';

export const useGroupDetailsViewModel = (initialGroup: Group) => {
    const [group, setGroup] = useState<Group>(initialGroup);
    // TODO: Define Member entity properly in Domain
    const [members, setMembers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchDetails = useCallback(async () => {
        try {
            const fetchedGroup = await container.getGroupDetailsUseCase.execute(initialGroup.id);
            setGroup(fetchedGroup);

            const fetchedMembers = await container.getGroupMembersUseCase.execute(initialGroup.id);
            setMembers(fetchedMembers);
        } catch (err) {
            console.error('Error fetching group details:', err);
            setError('No se pudieron cargar los detalles del grupo');
        } finally {
            setIsLoading(false);
        }
    }, [initialGroup.id]);

    useEffect(() => {
        fetchDetails();
    }, [fetchDetails]);

    const uploadImage = async (uri: string) => {
        try {
            setIsLoading(true);
            const formData = new FormData();
            const filename = uri.split('/').pop();
            const match = /\.(\w+)$/.exec(filename || '');
            const type = match ? `image/${match[1]}` : `image`;

            // @ts-ignore
            formData.append('image', { uri, name: filename, type });

            await container.uploadGroupImageUseCase.execute(group.id, formData);
            await fetchDetails(); // Refresh details to get new image
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Error al subir la imagen');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getImageUrl = (path: string | undefined | null) => {
        if (!path) return null;
        if (path.startsWith('http')) return path;
        return `${API_URL}${path}`;
    };

    return {
        group,
        members,
        isLoading,
        error,
        uploadImage,
        refresh: fetchDetails,
        getImageUrl
    };
};
