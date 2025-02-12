import { createBrowserRouter, RouteObject } from "react-router-dom";
import { CollectionsPage } from "./features/public/collections/CollectionsPage";
import { HomePage } from "./features/public/home/HomePage";

const routes: RouteObject[] = [
  { path: "/", element: <HomePage /> },
  {
    path: "/collections",
    element: <CollectionsPage />,
  },
  {
    path: "authentication/login",
  },
  {
    path: "authentication/register",
  },
];

export const router = createBrowserRouter(routes);
