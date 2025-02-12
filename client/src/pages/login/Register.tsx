import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router";

const RegisterForm = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate()

    const requestRegister = async () => {
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                throw new Error("Passwords do not match");
            }

            const response = await fetch(import.meta.env.VITE_API_URL + "user/register/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Registration failed");
            navigate("/login")
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        requestRegister();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100 w-full">
            <Card className="w-96 p-6 shadow-xl rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Register</CardTitle>
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
                            type="email" 
                            placeholder="Email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
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
                        <Input 
                            type="password" 
                            placeholder="Confirm Password" 
                            value={confirmPassword} 
                            onChange={(e) => setConfirmPassword(e.target.value)} 
                            required 
                            className="rounded-lg"
                        />
                        <Button type="submit" className="w-full flex items-center justify-center gap-2" disabled={loading}>
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />} Register
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export { RegisterForm };
