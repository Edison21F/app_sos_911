import { useState, useCallback } from 'react';
import { container } from '../../infrastructure/di/container';
import { Client, ClientPhone } from '../../domain/entities/Client';
import { UpdateClientData } from '../../application/ports/repositories/IClientRepository';
import { Alert } from 'react-native';

export const useProfileViewModel = () => {
    const [client, setClient] = useState<Client | null>(null);
    const [phones, setPhones] = useState<ClientPhone[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        getCurrentUserUseCase,
        logoutUseCase,
        getClientProfileUseCase,
        updateClientProfileUseCase,
        uploadProfileImageUseCase,
        manageClientPhonesUseCase
    } = container;

    const loadProfile = useCallback(async () => {
        setIsLoading(true);
        try {
            const user = await getCurrentUserUseCase.execute();
            if (user) {
                const clientData = await getClientProfileUseCase.execute(user.id.toString());
                setClient(clientData);
                const phoneData = await manageClientPhonesUseCase.getPhones(user.id.toString());
                setPhones(phoneData);
            }
        } catch (error) {
            console.error('Error loading profile:', error);
            Alert.alert('Error', 'No se pudo cargar el perfil');
        } finally {
            setIsLoading(false);
        }
    }, [getCurrentUserUseCase, getClientProfileUseCase, manageClientPhonesUseCase]);

    const updateProfile = async (data: UpdateClientData) => {
        if (!client) return;
        setIsSaving(true);
        try {
            await updateClientProfileUseCase.execute(client.id.toString(), data);
            await loadProfile(); // Reload to get fresh data
            Alert.alert('Éxito', 'Perfil actualizado correctamente');
            return true;
        } catch (error) {
            console.error('Error updating profile:', error);
            Alert.alert('Error', 'No se pudo actualizar el perfil');
            return false;
        } finally {
            setIsSaving(false);
        }
    };

    const uploadImage = async (uri: string) => {
        if (!client) return;
        try {
            const newImageUrl = await uploadProfileImageUseCase.execute(client.id.toString(), uri);
            setClient(prev => prev ? { ...prev, profileImage: newImageUrl } : null);
            return true;
        } catch (error) {
            console.error('Error uploading image:', error);
            Alert.alert('Error', 'Falló subida de imagen');
            return false;
        }
    };

    const addPhone = async (detail: string, number: string) => {
        if (!client) return;
        try {
            const newPhone = await manageClientPhonesUseCase.addPhone(client.id.toString(), detail, number);
            setPhones(prev => [...prev, newPhone]);
            return true;
        } catch (error) {
            console.error('Error adding phone:', error);
            Alert.alert('Error', 'Falló guardar teléfono');
            return false;
        }
    };

    const updatePhone = async (phoneId: string | number, detail: string, number: string) => {
        try {
            await manageClientPhonesUseCase.updatePhone(phoneId, detail, number);
            setPhones(prev => prev.map(p => p.id === phoneId ? { ...p, detail, number } : p));
            return true;
        } catch (error) {
            console.error('Error updating phone:', error);
            Alert.alert('Error', 'Falló actualizar teléfono');
            return false;
        }
    };

    const deletePhone = async (phoneId: string | number) => {
        try {
            await manageClientPhonesUseCase.deletePhone(phoneId);
            setPhones(prev => prev.filter(p => p.id !== phoneId));
            return true;
        } catch (error) {
            console.error('Error deleting phone:', error);
            Alert.alert('Error', 'Falló eliminar teléfono');
            return false;
        }
    };

    const logout = async () => {
        await logoutUseCase.execute();
    }

    return {
        client,
        phones,
        isLoading,
        isSaving,
        loadProfile,
        updateProfile,
        uploadImage,
        addPhone,
        updatePhone,
        deletePhone,
        logout
    };
};
