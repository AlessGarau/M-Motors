import { Outlet } from "react-router-dom";
import { AuthContextProvider } from "../contexts/auth";

const AuthLayout = () => {
  return (
    <AuthContextProvider>
      <Outlet /> 
    </AuthContextProvider>
  );
};

export default AuthLayout;