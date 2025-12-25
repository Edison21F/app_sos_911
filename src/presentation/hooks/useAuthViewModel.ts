import { useState, useEffect } from 'react';
import { container } from '../../infrastructure/di/container';
import { User } from '../../domain/entities/User';

export const useAuthViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const currentUser = await container.getCurrentUserUseCase.execute();
            setUser(currentUser);
        } catch (err) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial check
    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: any) => {
        setIsLoading(true);
        setError(null);
        try {
            const loggedUser = await container.loginUseCase.execute(credentials);
            setUser(loggedUser);
            return true;
        } catch (err: any) {
            setError(err.message || 'Login failed');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await container.logoutUseCase.execute();
            setUser(null);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const getCsrfToken = async () => {
        return container.getCsrfTokenUseCase.execute();
    };

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
        getCsrfToken
    };
};
