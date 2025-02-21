import { fetchWithAuth } from '@/lib/queries';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';


interface IAuthContext {
    user: Record<string, any> | null;
    setUser: (user: Record<string, any> | null) => void;
    isAdmin: boolean;
    handleLogout: () => void
    getUser: () => Record<string, any>
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<Record<string, any> | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const isAdmin = user?.is_admin ?? false;
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        setUser(null);
        navigate("/");
    };

    const getUser = async () => {
        try {
            const response = await fetchWithAuth(import.meta.env.VITE_API_URL + "user/me/");
            const data = await response.json();
            if (data.user) {
                setUser(data.user);
            }
            setLoading(false)
            return data.user
        } catch (error) {
            console.error("Failed to fetch user:", error);
            setUser(null);
        }
    };

    useEffect(() => {
        if (!user) {
            getUser();
        }
    }, [])

    if (loading) return <p>Loading...</p>

    return <AuthContext.Provider value={{ user, setUser, isAdmin, handleLogout, getUser }}>
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

