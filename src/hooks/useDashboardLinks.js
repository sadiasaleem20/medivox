import { useAuthStore } from "../store/authStore";

export function useUserLinks() {
  const { user } = useAuthStore();
  const id = user?._id;
  return [
    { to: `/user/${id}/dashboard`, label: "Overview", icon: "Activity" },
    {
      to: `/user/${id}/consult`,
      label: "AI Consultation",
      icon: "MessageSquare",
    },
    { to: `/user/${id}/doctors`, label: "Find Doctors", icon: "Stethoscope" },
    {
      to: `/user/${id}/prescription`,
      label: "Prescriptions",
      icon: "FileText",
    },
    { to: `/user/${id}/medicines`, label: "Medicines", icon: "Bell" },
  ];
}

export function useDoctorLinks() {
  const { user } = useAuthStore();
  const id = user?._id;
  return [
    { to: `/doctor/${id}/dashboard`, label: "Overview", icon: "Activity" },
    { to: `/doctor/${id}/profile`, label: "My Profile", icon: "User" },
    {
      to: `/doctor/${id}/appointments`,
      label: "Appointments",
      icon: "Calendar",
    },
  ];
}
