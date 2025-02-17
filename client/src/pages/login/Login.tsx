import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useAuth } from "../../contexts/auth";
import { Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()
    const auth = useAuth();

    const requestLogin = async () => {
        setLoading(true);
        try {
            const response = await fetch(import.meta.env.VITE_API_URL + "user/login/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Login failed");
            auth.setUser(data.user);
            auth.setToken(data.access);
            navigate("/")
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        requestLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">

            <Card className="w-96 p-6 shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Login</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="rounded-lg"
                        />
                        <Input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="rounded-lg"
                        />
                        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Login
                        </Button>
                    </form>
                    <div className="mt-4 text-center">
                        <Link to="/register" className="text-blue-600 hover:underline">
                            Register here if you don't have an account
                        </Link>
                    </div>  
                </CardContent>
            </Card>
        </div>
    );
};

export { LoginForm };
