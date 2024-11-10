// App.jsx
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import useAuthStore from "./store/authStore";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import MapPage from "./routes/map";
import HomePage from "./routes/home";
import UsersPage from "./routes/users";
import LoginPage from "./routes/LoginPage";
import SignupPage from "./routes/SignupPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "map",
        element: <MapPage />,
      },
      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  },
]);

const queryClient = new QueryClient();

const App = () => {
  const { checkUserAuth } = useAuthStore();

  // Check user authentication on app load
  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
