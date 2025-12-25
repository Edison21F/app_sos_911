import { useState } from 'react';
import { container } from '../../infrastructure/di/container';
import { Alert } from 'react-native';

export const useAddGroupViewModel = (navigation: any) => {
    const [loading, setLoading] = useState(false);

    const createGroup = async (name: string, description: string) => {
        if (!name.trim()) {
            Alert.alert('Error', 'Por favor ingresa un nombre para el grupo');
            return;
        }

        setLoading(true);
        try {
            const user = await container.getCurrentUserUseCase.execute();
            if (!user) throw new Error('No session');

            const group = await container.createGroupUseCase.execute({
                name,
                description,
                userId: String(user.id)
            });

            // Group entity might need to have 'code' if it's returned by create
            // The API response returns { codigo: ... }
            // Repository mapToGroup maps it.
            // So group.code shoud be available if defined in Entity.

            Alert.alert('Grupo Creado', `Código de acceso: ${group.code}`, [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            console.error('Create group error:', error);
            Alert.alert('Error', error.message || 'No se pudo crear el grupo');
        } finally {
            setLoading(false);
        }
    };

    const joinGroup = async (code: string) => {
        if (!code.trim() || code.length !== 6) {
            Alert.alert('Error', 'Ingresa un código válido de 6 dígitos');
            return;
        }

        setLoading(true);
        try {
            const user = await container.getCurrentUserUseCase.execute();
            if (!user) throw new Error('No session');

            await container.joinGroupUseCase.execute(code, String(user.id));

            Alert.alert('Éxito', `Te has unido al grupo correctamente`, [
                { text: 'Ir a Grupos', onPress: () => navigation.goBack() }
            ]);

        } catch (error: any) {
            console.error('Join group error:', error);
            Alert.alert('Error', error.response?.data?.message || 'No se pudo unir al grupo');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        createGroup,
        joinGroup
    };
};
