import { useState } from 'react';
import { container } from '../../infrastructure/di/container';
import { RegisterData } from '../../application/ports/repositories/IAuthRepository';
import { Alert } from 'react-native';

export const useRegisterViewModel = (navigation: any) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);

            await container.registerUseCase.execute(data);

            Alert.alert('Éxito', 'Registro completado correctamente', [
                { text: 'OK', onPress: () => navigation.navigate('Login') }
            ]);
            return true;
        } catch (err: any) {
            console.error('Registration error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Error al registrar usuario';
            setError(errorMessage);
            Alert.alert('Error', errorMessage);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        register,
        isLoading,
        error
    };
};
