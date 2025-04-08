import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
// import { ConvexClient } from 'convex/browser'; // Type might be inferred
import { getConvexClient, setupConvexAuth, executeConvexFunction } from '../services/convex/convexService';
import type { User } from '@/types'; // Assuming User type includes necessary fields

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGoogleToken: (googleToken: string) => Promise<void>;
    logout: () => Promise<void>; // Make logout async if needed
    convexClient: ReturnType<typeof getConvexClient> | null; // Use inferred type
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    loginWithGoogleToken: async () => {},
    logout: async () => {},
    convexClient: null, // Initial value
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [convexClientInstance, setConvexClientInstance] = useState<ReturnType<typeof getConvexClient> | null>(null);

    // Function to fetch user data from Convex after authentication
    const fetchAndSetUser = useCallback(async (client: ReturnType<typeof getConvexClient>) => {
        if (!client) return; // Add null check for client
        try {
            // TODO: Replace 'users:getCurrent' with the actual Convex query name
            const currentUser = await executeConvexFunction('users:getCurrent'); 
            if (currentUser) {
                 // TODO: Adapt mapping based on actual User type and Convex response
                setUser({
                    id: currentUser._id, 
                    email: currentUser.email,
                    fullName: currentUser.name,
                    // Add other fields as defined in your User type
                } as User); // Cast might be needed depending on types
            } else {
                setUser(null); // No user found or error
            }
        } catch (error) {
            console.error("Error fetching user data from Convex:", error);
            setUser(null); // Clear user on error
        }
    }, []);

    // Check authentication status on initial load
    useEffect(() => {
        const initializeAuth = async () => {
            setLoading(true);
            const client = getConvexClient();
            setConvexClientInstance(client);
            const googleToken = localStorage.getItem('googleToken');

            if (googleToken) {
                try {
                    // Attempt to authenticate Convex client with stored token
                    await client.setAuth(JSON.parse(googleToken).access_token); 
                    await fetchAndSetUser(client); // Fetch user data if auth succeeds
                } catch (error) {
                    console.warn("Failed to authenticate with stored Google token:", error);
                    localStorage.removeItem('googleToken'); // Clear invalid token
                    setUser(null);
                }
            } else {
                setUser(null); // No token found
            }
            setLoading(false);
        };
        initializeAuth();
    }, [fetchAndSetUser]);

    // Login function using Google Token
    const loginWithGoogleToken = async (googleToken: string) => {
        setLoading(true);
        const client = getConvexClient();
        try {
            // Authenticate Convex client
            await client.setAuth(googleToken); 
            // Fetch user data
            await fetchAndSetUser(client);
            // Store token (already done by GoogleAuthButton, but ensure consistency)
            // localStorage.setItem('googleToken', JSON.stringify({ access_token: googleToken })); // Adjust if needed
        } catch (error) {
            console.error('Google Token Login error:', error);
            setUser(null);
            localStorage.removeItem('googleToken'); // Clear token on error
            throw error; // Re-throw for handling in UI
        } finally {
            setLoading(false);
        }
    };

    // Logout function
    const logout = async () => {
        setLoading(true);
        const client = getConvexClient();
        try {
            // TODO: Call Convex logout function if available (e.g., client.logout())
            // Or simply clear local state and token
            setUser(null);
            localStorage.removeItem('googleToken');
            // Potentially clear Convex auth state if library provides a method
            // client.clearAuth(); // Example, check Convex docs
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGoogleToken, logout, convexClient: convexClientInstance }}>
            {children}
        </AuthContext.Provider>
    );
};
