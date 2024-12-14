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
import LoginPage from "./routes/LoginPage";
import SignupPage from "./routes/SignupPage";
import Dashboard from "./routes/dashboard";
import EnumeratorGeofencing from "./components/layouts/EnumeratorGeofencing";
import ViewGeofencing from "./routes/ViewGeofencing";
import EditGeofencing from "./routes/EditGeofencing";
import LiveLocationsMap from "./routes/LiveLocations";
import CollectedDataView from "./routes/CollectedDataView";
import { Toaster } from "./components/ui/toaster";
import { ConfirmationDialog } from "./components/ConfirmationDialog";

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
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "live-locations",
        element: <LiveLocationsMap />,
      },
      {
        path: "enumerators/:enumeratorId/geofencing",
        element: <EnumeratorGeofencing />,
        children: [
          {
            path: "view",
            element: <ViewGeofencing />,
          },
          {
            path: "edit",
            element: <EditGeofencing />,
          },
          {
            path: ":geofenceId/collected-data",
            element: <CollectedDataView />,
          },
        ],
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
      <Toaster />
      <ConfirmationDialog />
      <ReactQueryDevtools />
    </QueryClientProvider>
  );
};

export default App;
