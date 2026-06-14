import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  Clock,
  LogOut,
  Menu,
  Activity,
  ChevronRight,
  Bell,
  Shield,
  AlertCircle,
  CheckCircle,
  FileText,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import api from "../../lib/axios";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

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

function StatusBanner({ status, rejectionReason }) {
  if (status === "approved")
    return (
      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-5 flex items-center gap-4"
        style={{ background: "linear-gradient(135deg, #085041, #1D9E75)" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          <CheckCircle size={24} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-base">
            Your profile is verified
          </p>
          <p className="text-white/70 text-sm">
            You are visible to patients on Medivox
          </p>
        </div>
      </motion.div>
    );

  if (status === "rejected")
    return (
      <motion.div
        variants={fadeUp}
        className="rounded-2xl p-5 flex items-start gap-4"
        style={{ background: "#FCEBEB", border: "1px solid #FECACA" }}
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: "#FEE2E2" }}
        >
          <AlertCircle size={24} style={{ color: "#A32D2D" }} />
        </div>
        <div className="flex-1">
          <p className="font-bold text-base" style={{ color: "#A32D2D" }}>
            Application rejected
          </p>
          {rejectionReason && (
            <p className="text-sm mt-1" style={{ color: "#7F1D1D" }}>
              Reason: {rejectionReason}
            </p>
          )}
          <Link
            to="/doctor/profile"
            className="inline-flex items-center gap-1 text-sm font-semibold mt-2"
            style={{ color: "#A32D2D" }}
          >
            Update your documents <ChevronRight size={14} />
          </Link>
        </div>
      </motion.div>
    );

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl p-5 flex items-center gap-4"
      style={{ background: "#FAEEDA", border: "1px solid #FDE68A" }}
    >
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ background: "#FEF3C7" }}
      >
        <Clock size={24} style={{ color: "#854F0B" }} />
      </div>
      <div>
        <p className="font-bold text-base" style={{ color: "#854F0B" }}>
          Verification pending
        </p>
        <p className="text-sm mt-0.5" style={{ color: "#92400E" }}>
          Our admin team is reviewing your application. This usually takes 24
          hours.
        </p>
      </div>
    </motion.div>
  );
}

export default function DoctorDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/doctor/me")
      .then((res) => setDoctor(res.data.doctor))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const STATS = [
    {
      label: "Status",
      value: doctor?.status || "—",
      icon: Shield,
      color: "#0C447C",
      bg: "#E6F1FB",
    },
    {
      label: "Experience",
      value: `${doctor?.experience || 0} yrs`,
      icon: Clock,
      color: "#1D9E75",
      bg: "#E1F5EE",
    },
    {
      label: "Consultancy fee",
      value: `Rs. ${doctor?.fee || 0}`,
      icon: FileText,
      color: "#0C447C",
      bg: "#E6F1FB",
    },
    {
      label: "Rating",
      value: `${doctor?.rating || 0} / 5`,
      icon: Activity,
      color: "#1D9E75",
      bg: "#E1F5EE",
    },
  ];

  return (
    <div className="min-h-screen bg-cloud flex">
      <Sidebar
        active="/doctor/dashboard"
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-sky-light px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-midnight">
                Welcome, {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-xs text-slate">Doctor portal</p>
            </div>
          </div>
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
            style={{ background: "#0C447C" }}
          >
            {user?.name?.charAt(0)}
          </div>
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
            </div>
          ) : (
            <motion.div
              variants={stagger}
              initial="hidden"
              animate="show"
              className="space-y-6"
            >
              <StatusBanner
                status={doctor?.status}
                rejectionReason={doctor?.rejectionReason}
              />

              {/* Stats */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {STATS.map(({ label, value, icon: Icon, color, bg }) => (
                  <div key={label} className="card">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                      style={{ background: bg }}
                    >
                      <Icon size={20} style={{ color }} />
                    </div>
                    <p className="text-lg font-extrabold text-midnight capitalize">
                      {value}
                    </p>
                    <p className="text-xs text-slate mt-0.5">{label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Profile summary */}
              <motion.div variants={fadeUp} className="card">
                <div className="flex items-start justify-between mb-5">
                  <h2 className="text-base font-bold text-midnight">
                    Profile summary
                  </h2>
                  <Link
                    to="/doctor/profile"
                    className="flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                    style={{ background: "#E6F1FB", color: "#0C447C" }}
                  >
                    Edit profile <ChevronRight size={13} />
                  </Link>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: "Full name", value: user?.name },
                    { label: "Email", value: user?.email },
                    { label: "Phone", value: user?.phone || "—" },
                    { label: "City", value: user?.city || "—" },
                    { label: "Specialization", value: doctor?.specialization },
                    {
                      label: "Consultancy place",
                      value: doctor?.consultancyPlace || "—",
                    },
                    {
                      label: "Working hours",
                      value:
                        doctor?.startTime && doctor?.endTime
                          ? `${doctor.startTime} — ${doctor.endTime}`
                          : "—",
                    },
                    {
                      label: "Consultation fee",
                      value: `Rs. ${doctor?.fee || 0}`,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex flex-col gap-0.5">
                      <p className="text-xs text-slate">{label}</p>
                      <p className="text-sm font-medium text-midnight">
                        {value}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Quick actions */}
              <motion.div
                variants={fadeUp}
                className="grid sm:grid-cols-2 gap-4"
              >
                <Link
                  to="/doctor/profile"
                  className="card hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-4"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#E6F1FB" }}
                  >
                    <User size={20} style={{ color: "#0C447C" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-midnight">
                      Update profile
                    </p>
                    <p className="text-xs text-slate">
                      Edit info and upload documents
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate" />
                </Link>

                <Link
                  to="/doctor/appointments"
                  className="card hover:shadow-md hover:-translate-y-1 transition-all flex items-center gap-4"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "#E1F5EE" }}
                  >
                    <Calendar size={20} style={{ color: "#1D9E75" }} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-midnight">
                      Appointments
                    </p>
                    <p className="text-xs text-slate">
                      View your scheduled patients
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-slate" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
