import { RouterProvider, createBrowserRouter } from "react-router-dom";

import { adminRouter } from "./pages/admin/admin-router";
import { loginRouter } from "./pages/login/login-router";
import AuthLayout from "./auth/AuthLayout";
import { clientRouter } from "./pages/client/client-router";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [...loginRouter, ...clientRouter, ...adminRouter],
  },
]);

export function App() {
  return (
    <>
      <RouterProvider router={router} />;
    </>
  );
}
