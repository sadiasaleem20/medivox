import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  Clock,
  XCircle,
  TrendingUp,
  Bell,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Activity,
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
    { to: "/admin", label: "Overview", icon: Activity },
    { to: "/admin/doctors", label: "Doctors", icon: UserCheck },
    { to: "/admin/users", label: "Users", icon: Users },
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
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col
                        transition-transform duration-300
                        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "#042C53" }}
      >
        <div className="p-6 border-b border-white/10">
          <Logo size="md" />
          <div
            className="mt-3 px-2 py-1 rounded-lg text-xs font-medium"
            style={{
              background: "#E1F5EE",
              color: "#085041",
              display: "inline-block",
            }}
          >
            Admin Panel
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                       w-full transition-all hover:bg-white/10"
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

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, doctorsRes] = await Promise.all([
          api.get("/admin/stats"),
          api.get("/admin/doctors/pending"),
        ]);
        setStats(statsRes.data);
        setPendingDoctors(doctorsRes.data.doctors.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const STAT_CARDS = [
    {
      label: "Total patients",
      value: stats?.totalUsers ?? "—",
      icon: Users,
      bg: "#E6F1FB",
      color: "#0C447C",
      sub: "Registered users",
    },
    {
      label: "Total doctors",
      value: stats?.totalDoctors ?? "—",
      icon: UserCheck,
      bg: "#E1F5EE",
      color: "#1D9E75",
      sub: "On platform",
    },
    {
      label: "Pending review",
      value: stats?.pendingDoctors ?? "—",
      icon: Clock,
      bg: "#FAEEDA",
      color: "#854F0B",
      sub: "Awaiting verification",
    },
    {
      label: "Approved doctors",
      value: stats?.approvedDoctors ?? "—",
      icon: TrendingUp,
      bg: "#E1F5EE",
      color: "#1D9E75",
      sub: "Active on platform",
    },
  ];

  return (
    <div className="min-h-screen bg-cloud flex">
      <Sidebar
        active="/admin"
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 min-h-screen flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-sky-light px-6 py-4 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate hover:text-navy transition-colors"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-midnight">Overview</h1>
              <p className="text-xs text-slate">Welcome back, {user?.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-xl hover:bg-sky-light transition-colors">
              <Bell size={18} className="text-slate" />
              {stats?.pendingDoctors > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-red-500" />
              )}
            </button>
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold text-white"
              style={{ background: "#0C447C" }}
            >
              {user?.name?.charAt(0)}
            </div>
          </div>
        </header>

        {/* Main content */}
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
              {/* Stat cards */}
              <motion.div
                variants={fadeUp}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
              >
                {STAT_CARDS.map(
                  ({ label, value, icon: Icon, bg, color, sub }) => (
                    <div
                      key={label}
                      className="card hover:shadow-md transition-all"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                        style={{ background: bg }}
                      >
                        <Icon size={20} style={{ color }} />
                      </div>
                      <p className="text-2xl font-extrabold text-midnight">
                        {value}
                      </p>
                      <p className="text-sm font-medium text-midnight mt-0.5">
                        {label}
                      </p>
                      <p className="text-xs text-slate mt-0.5">{sub}</p>
                    </div>
                  ),
                )}
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Pending doctors */}
                <motion.div variants={fadeUp} className="card">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-base font-bold text-midnight">
                        Pending verifications
                      </h2>
                      <p className="text-xs text-slate mt-0.5">
                        Doctors waiting for approval
                      </p>
                    </div>
                    <Link
                      to="/admin/doctors"
                      className="flex items-center gap-1 text-xs font-medium hover:underline"
                      style={{ color: "#185FA5" }}
                    >
                      View all <ChevronRight size={13} />
                    </Link>
                  </div>

                  {pendingDoctors.length === 0 ? (
                    <div className="text-center py-10">
                      <UserCheck
                        size={32}
                        className="mx-auto mb-2 text-teal opacity-40"
                      />
                      <p className="text-sm text-slate">
                        No pending verifications
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {pendingDoctors.map((doc) => (
                        <div
                          key={doc._id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-sky-light hover:bg-cloud transition-colors"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                            style={{ background: "#185FA5" }}
                          >
                            {doc.user?.name?.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-midnight truncate">
                              {doc.user?.name}
                            </p>
                            <p className="text-xs text-slate">
                              {doc.specialization} · {doc.user?.city}
                            </p>
                          </div>
                          <span className="badge-amber flex-shrink-0">
                            Pending
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Quick actions */}
                <motion.div variants={fadeUp} className="card">
                  <h2 className="text-base font-bold text-midnight mb-5">
                    Quick actions
                  </h2>
                  <div className="space-y-3">
                    {[
                      {
                        to: "/admin/doctors",
                        label: "Review doctor applications",
                        sub: `${stats?.pendingDoctors || 0} pending`,
                        icon: UserCheck,
                        color: "#0C447C",
                        bg: "#E6F1FB",
                      },
                      {
                        to: "/admin/users",
                        label: "Manage users",
                        sub: `${stats?.totalUsers || 0} registered`,
                        icon: Users,
                        color: "#1D9E75",
                        bg: "#E1F5EE",
                      },
                    ].map(({ to, label, sub, icon: Icon, color, bg }) => (
                      <Link
                        key={to}
                        to={to}
                        className="flex items-center gap-4 p-4 rounded-xl border border-sky-light
                                   hover:shadow-sm hover:-translate-y-0.5 transition-all"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                          style={{ background: bg }}
                        >
                          <Icon size={20} style={{ color }} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-midnight">
                            {label}
                          </p>
                          <p className="text-xs text-slate">{sub}</p>
                        </div>
                        <ChevronRight size={16} className="text-slate" />
                      </Link>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
