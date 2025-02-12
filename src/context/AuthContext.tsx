import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (userData: Partial<User> & { password: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Verificar token almacenado y cargar usuario
        checkAuth();
    }, []);

    const checkAuth = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            // Implementar llamada a API para verificar token
            // const response = await api.get('/auth/me');
            // setUser(response.data);
        } catch (error) {
            console.error('Error checking auth:', error);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            // Implementar llamada a API para login
            // const response = await api.post('/auth/login', { email, password });
            // localStorage.setItem('token', response.data.token);
            // setUser(response.data.user);
        } catch (error) {
            console.error('Error logging in:', error);
            throw error;
        }
    };

    const logout = async () => {
        try {
            // Implementar llamada a API para logout si es necesario
            localStorage.removeItem('token');
            setUser(null);
        } catch (error) {
            console.error('Error logging out:', error);
            throw error;
        }
    };

    const register = async (userData: Partial<User> & { password: string }) => {
        try {
            // Implementar llamada a API para registro
            // const response = await api.post('/auth/register', userData);
            // localStorage.setItem('token', response.data.token);
            // setUser(response.data.user);
        } catch (error) {
            console.error('Error registering:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
