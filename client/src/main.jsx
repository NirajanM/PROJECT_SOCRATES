// src/main.jsx
import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import MapPage from "./routes/map";
import HomePage from "./routes/home";
import UsersPage from "./routes/users";
import LoginPage from "./routes/LoginPage";
import SignupPage from "./routes/SignupPage";
import ProtectedRoute from "./components/protectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useAuthStore from "./store/authStore"; // Zustand store for authentication

const queryClient = new QueryClient();

// Define routes with protected paths
const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Root layout or main layout component
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <LoginPage />, // Login page component
      },
      {
        path: "signup",
        element: <SignupPage />, // Signup page component
      },
      {
        path: "/",
        element: <ProtectedRoute />, // Protects the main routes
        children: [
          {
            index: true,
            element: <HomePage />, // Home page component
          },
          {
            path: "map",
            element: <MapPage />, // Map page component
          },
          {
            path: "users",
            element: <UsersPage />, // Users page component
          },
        ],
      },
    ],
  },
]);

// Check for existing authentication on initial load
const authStore = useAuthStore.getState();
authStore.checkAuth(); // Verifies if the user is authenticated

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
