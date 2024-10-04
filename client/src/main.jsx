import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import Root from "./routes/root";
import ErrorPage from "./error-page";
import MapPage from "./routes/map";
import HomePage from "./routes/home";
import UsersPage from "./routes/users";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />, // Root contains Layout
    errorElement: <ErrorPage />,
    children: [
      {
        index: true, // This means it will render for the root `/`
        element: <HomePage />, // Define HomePage to be shown at the root
      },
      {
        path: "map", // This is `/map-page`
        element: <MapPage />, // Renders MapPage inside Layout
      },
      {
        path: "users",
        element: <UsersPage />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
