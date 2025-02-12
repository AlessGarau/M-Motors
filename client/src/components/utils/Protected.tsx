import { Navigate } from "react-router-dom";

type ProtectedRouteProps = {
    user: {user: string} | null;
    children: React.ReactNode;
  };

export default function Protected({user, children}: ProtectedRouteProps) {
    if (!user)
        return <Navigate to="/" replace />
    return children
}