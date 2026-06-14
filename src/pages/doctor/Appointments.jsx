import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  LogOut,
  Menu,
  Activity,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";

function Sidebar({ active, onLogout, open, setOpen }) {
  const links = [
    { to: "/doctor/dashboard", label: "Overview", icon: Activity },
    { to: "/doctor/profile", label: "My Profile", icon: User },
    { to: "/doctor/appointments", label: "Appointments", icon: Calendar },
  ];
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
                        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "#042C53" }}
      >
        <div className="p-6 border-b border-white/10">
          <Logo size="md" />
          <div
            className="mt-3 px-2 py-1 rounded-lg text-xs font-medium inline-block"
            style={{ background: "#E6F1FB", color: "#0C447C" }}
          >
            Doctor Portal
          </div>
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
            onClick={onLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium w-full hover:bg-white/10 transition-all"
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

export default function Appointments() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-cloud flex">
      <Sidebar
        active="/doctor/appointments"
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-sky-light px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate"
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-midnight">Appointments</h1>
            <p className="text-xs text-slate">
              Your scheduled patient consultations
            </p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="card text-center py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#E6F1FB" }}
            >
              <Calendar size={28} style={{ color: "#0C447C" }} />
            </div>
            <h2 className="text-base font-bold text-midnight mb-2">
              Appointments coming soon
            </h2>
            <p className="text-sm text-slate max-w-sm mx-auto leading-relaxed">
              Once patients book appointments with you, they will appear here.
              Make sure your profile is complete and verified.
            </p>
            <Link
              to="/doctor/profile"
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#0C447C" }}
            >
              Complete profile
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
