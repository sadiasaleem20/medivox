import { Navigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({ children, role }) {
  const { user, token } = useAuthStore();

  if (!token || !user) return <Navigate to="/login" replace />;

  if (role && user.role !== role) {
    if (user.role === "admin") return <Navigate to="/admin" replace />;
    if (user.role === "doctor")
      return <Navigate to={`/doctor/${user._id}/dashboard`} replace />;
    return <Navigate to={`/user/${user._id}/dashboard`} replace />;
  }

  return children;
}
