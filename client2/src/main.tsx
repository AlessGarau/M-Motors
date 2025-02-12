import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import { Auth0Provider } from "@auth0/auth0-react";
import { Authenticated } from "./auth/Authenticated.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
