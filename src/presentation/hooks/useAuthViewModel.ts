import { useState, useCallback, useEffect } from 'react';
import { AuthRepositoryApi } from '../../../infrastructure/repositories/AuthRepositoryApi';
import { LoginUseCase } from '../../../application/use-cases/auth/LoginUseCase';
import { LogoutUseCase } from '../../../application/use-cases/auth/LogoutUseCase';
import { GetCurrentUserUseCase } from '../../../application/use-cases/auth/GetCurrentUserUseCase';
import { LoginCredentials } from '../../../application/ports/repositories/IAuthRepository';
import { User } from '../../../domain/entities/User';

// Simple Composition Root (could be moved to a DI container later)
const authRepository = new AuthRepositoryApi();
const loginUseCase = new LoginUseCase(authRepository);
const logoutUseCase = new LogoutUseCase(authRepository);
const getCurrentUserUseCase = new GetCurrentUserUseCase(authRepository);

export const useAuthViewModel = () => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const checkAuth = useCallback(async () => {
        setIsLoading(true);
        try {
            const currentUser = await getCurrentUserUseCase.execute();
            setUser(currentUser);
        } catch (e) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial check
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);

    const login = async (credentials: LoginCredentials) => {
        setIsLoading(true);
        setError(null);
        try {
            const loggedUser = await loginUseCase.execute(credentials);
            setUser(loggedUser);
            return loggedUser;
        } catch (e: any) {
            setError(e.message || 'Login failed');
            throw e;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        setIsLoading(true);
        try {
            await logoutUseCase.execute();
            setUser(null);
        } catch (e: any) {
            setError(e.message || 'Logout failed');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        user,
        isLoading,
        error,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth
    };
};
