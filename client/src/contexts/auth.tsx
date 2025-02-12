import { createContext, useContext, useState, useEffect } from 'react';


interface IAuthContext {
    user: Record<string, any> | null;
    setUser: (user: Record<string, any> | null) => void;
    setToken: (token: string | null) => void;
    token: string | null
}

interface AuthContextProviderProps {
    children: React.ReactNode
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [user, setUser] = useState<Record<string, any> | null>(null);
    const [token, setToken] = useState<string | null>(null);

    function getCookie(name: string | Record<string, any>) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts && parts.length === 2) return parts.pop().split(';').shift();
      }

    useEffect(() => {
        const accessToken = getCookie('access_token');
        const storedUser = getCookie('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        } else if (accessToken) {
            const getUser = async () => {
                try {
                    const response = await fetch(import.meta.env.VITE_API_URL + "user/me/", {
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    });
                    const data = await response.json();
                    setUser(data.user);
                    document.cookie = `user=${JSON.stringify(data.user)}; path=/`;
                } catch (error) {
                    console.error("Failed to fetch user:", error);
                    setUser(null);
                }
            };
            getUser();
        }
    }, []);

    return <AuthContext.Provider value={{ user, setUser, token, setToken }}>
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

export { AuthContextProvider, useAuth }
