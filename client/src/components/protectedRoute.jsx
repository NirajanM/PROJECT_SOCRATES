import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../store/authStore";
import Cookies from "js-cookie";

const ProtectedRoute = () => {
  const { user } = useAuthStore();
  const token = Cookies.get("authToken");

  return user && token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
