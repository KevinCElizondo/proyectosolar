
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from '@/types';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => {},
    register: async () => {},
    logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        if (token) {
            // TODO: Validate token and get user data
            setUser({
                id: '1',
                email: 'demo@example.com',
                fullName: 'Demo User',
                role: 'user',
                createdAt: new Date(),
                updatedAt: new Date(),
            });
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try {
            // TODO: Implement actual login logic
            const mockUser = {
                id: '1',
                email,
                fullName: 'Demo User',
                role: 'user' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setUser(mockUser);
            localStorage.setItem('token', 'mock-token');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, name: string) => {
        try {
            // TODO: Implement actual registration logic
            const mockUser = {
                id: '1',
                email,
                fullName: name,
                role: 'user' as const,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            setUser(mockUser);
            localStorage.setItem('token', 'mock-token');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
