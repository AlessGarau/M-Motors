import { createBrowserRouter, RouteObject } from "react-router-dom";
import { CollectionsPage } from "./features/public/collections/CollectionsPage";
import { HomePage } from "./features/public/home/HomePage";
import { LoginForm } from "./features/public/login/Login";
import AuthLayout from "./features/auth/AuthLayout";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <AuthLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "/login", element: <LoginForm /> },
      { path: "/collections", element: <CollectionsPage /> },
    ],
  },
];

export const router = createBrowserRouter(routes);
