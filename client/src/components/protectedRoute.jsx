import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const { user, checkUserAuth } = useAuthStore();

  // Ensure auth is checked when the page loads
  useEffect(() => {
    checkUserAuth();
  }, [checkUserAuth]);

  const token = Cookies.get("authToken");

  // If no user or token, redirect to login page
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // Render the protected content if authenticated
  return <Outlet />;
};

export default ProtectedRoute;
