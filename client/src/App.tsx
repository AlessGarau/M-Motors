import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { adminRouter } from "./pages/admin/admin-router";
import { loginRouter } from "./pages/login/login-router";
import AuthLayout from "./auth/AuthLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      ...loginRouter,
      ...adminRouter
    ],
  },
]);

export function App() {
  return <RouterProvider router={router} />;
}
