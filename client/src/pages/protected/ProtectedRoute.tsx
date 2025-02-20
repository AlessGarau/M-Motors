import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!user || !token) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />
};

export default ProtectedRoute;
