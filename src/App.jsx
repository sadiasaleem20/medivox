import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/authStore";

import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import UserDashboard from "./pages/user/UserDashboard";
import AIConsult from "./pages/user/AIConsult";
import DoctorMatch from "./pages/user/DoctorMatch";
import Prescription from "./pages/user/Prescription";
import MedicineScheduler from "./pages/user/MedicineScheduler";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorProfile from "./pages/doctor/DoctorProfile";
import Appointments from "./pages/doctor/Appointments";
import AdminDashboard from "./pages/admin/AdminDashboard";
import DoctorVerification from "./pages/admin/DoctorVerification";
import UserList from "./pages/admin/UserList";
import ProtectedRoute from "./components/shared/ProtectedRoute";

function SmartRedirect() {
  const { user, token } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "doctor")
    return <Navigate to={`/doctor/${user._id}/dashboard`} replace />;
  return <Navigate to={`/user/${user._id}/dashboard`} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* User routes */}
      <Route
        path="/user/:userId/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/consult"
        element={
          <ProtectedRoute role="user">
            <AIConsult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/doctors"
        element={
          <ProtectedRoute role="user">
            <DoctorMatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/prescription"
        element={
          <ProtectedRoute role="user">
            <Prescription />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/:userId/medicines"
        element={
          <ProtectedRoute role="user">
            <MedicineScheduler />
          </ProtectedRoute>
        }
      />

      {/* Doctor routes */}
      <Route
        path="/doctor/:doctorId/dashboard"
        element={
          <ProtectedRoute role="doctor">
            <DoctorDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/:doctorId/profile"
        element={
          <ProtectedRoute role="doctor">
            <DoctorProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="/doctor/:doctorId/appointments"
        element={
          <ProtectedRoute role="doctor">
            <Appointments />
          </ProtectedRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/doctors"
        element={
          <ProtectedRoute role="admin">
            <DoctorVerification />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute role="admin">
            <UserList />
          </ProtectedRoute>
        }
      />

      {/* Old routes — smart redirect */}
      <Route path="/dashboard" element={<SmartRedirect />} />
      <Route path="/consult" element={<SmartRedirect />} />
      <Route path="/doctors" element={<SmartRedirect />} />
      <Route path="/prescription" element={<SmartRedirect />} />
      <Route path="/medicines" element={<SmartRedirect />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
