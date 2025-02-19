import { fetchWithAuth } from '@/lib/queries';
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';


interface IAuthContext {
    user: Record<string, any> | null;
    setUser: (user: Record<string, any> | null) => void;
    setIsAdmin: (isAdmin: boolean) => void;
    isAdmin: boolean;
    handleLogout: () => void
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<Record<string, any> | null>(() => {
        const storedUser = localStorage.getItem("user");
        return storedUser ? JSON.parse(storedUser) : null;
    });
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        setIsAdmin(false);
        navigate("/");
    };

    useEffect(() => {
        if (!user) {
            const getUser = async () => {
                try {
                    const response = await fetchWithAuth(import.meta.env.VITE_API_URL + "user/me/");
                    const data = await response.json();
                    localStorage.setItem("user", JSON.stringify(data.user));
                    setUser(data.user);
                    setIsAdmin(data.user.is_admin)
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    setUser(null);
                }
            };
            getUser();
        }
    }, []);

    return <AuthContext.Provider value={{ user, setUser, isAdmin, setIsAdmin, handleLogout }}>
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

