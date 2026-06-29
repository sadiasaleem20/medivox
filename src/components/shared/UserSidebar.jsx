import { Link, useNavigate } from "react-router-dom";
import {
  LogOut,
  Activity,
  MessageSquare,
  Stethoscope,
  FileText,
  Bell,
  User,
  Calendar,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "./Logo";

export default function UserSidebar({ active, open, setOpen }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const id = user?._id;

  const links = [
    { to: `/user/${id}/dashboard`, label: "Overview", icon: Activity },
    {
      to: `/user/${id}/consult`,
      label: "AI Consultation",
      icon: MessageSquare,
    },
    { to: `/user/${id}/doctors`, label: "Find Doctors", icon: Stethoscope },
    { to: `/user/${id}/prescription`, label: "Prescriptions", icon: FileText },
    { to: `/user/${id}/medicines`, label: "Medicines", icon: Bell },
    { to: `/user/${id}/profile`, label: "My Profile", icon: User },
    { to: `/user/${id}/appointments`, label: "Appointments", icon: Calendar },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
                        transition-transform duration-300
                        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "#042C53" }}
      >
        <div className="p-6 border-b border-white/10">
          <Logo size="md" />
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: active === to ? "#0C447C" : "transparent",
                color: active === to ? "white" : "rgba(255,255,255,0.6)",
              }}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                       w-full hover:bg-white/10 transition-all"
            style={{ color: "rgba(255,255,255,0.6)" }}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
