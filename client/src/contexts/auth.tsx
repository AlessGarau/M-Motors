import { fetchWithAuth } from '@/lib/queries';
import { createContext, useContext, useEffect, useState } from 'react';


interface IAuthContext {
    user: Record<string, any> | null;
    setUser: (user: Record<string, any> | null) => void;
    setToken: (token: string | null) => void;
    token: string | null;
    isAdmin: boolean;
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<Record<string, any> | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isAdmin, setIsAdmin] = useState<boolean>(false);

    useEffect(() => {
        if (!user) {
            const getUser = async () => {
                try {
                    const response = await fetchWithAuth(import.meta.env.VITE_API_URL + "user/me/");
                    const data = await response.json();
                    setUser(data.user);
                    setIsAdmin(data.user.is_admin)
                    document.cookie = `user=${JSON.stringify(data.user)}; path=/`;
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    setUser(null);
                }
            };
            getUser();
        }
    }, []);

    return <AuthContext.Provider value={{ user, setUser, token, setToken, isAdmin }}>
        {children}
    </AuthContext.Provider>

}

const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
};

export { AuthContextProvider, useAuth };

