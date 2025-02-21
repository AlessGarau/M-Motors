import { useAuth } from "@/contexts/auth";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
    const { isAdmin } = useAuth()
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />
};

export default AdminRoute;
