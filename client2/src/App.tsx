import {
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";

import { adminRouter } from "./pages/admin/admin-router";

const router = createBrowserRouter([
    ...adminRouter
]);

export function App() {
  return <RouterProvider router={router} />;
}
