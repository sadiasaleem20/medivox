import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Stethoscope,
  FileText,
  Bell,
  LogOut,
  Menu,
  Activity,
  User,
  ChevronRight,
  Clock,
  Shield,
  Plus,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import UserSidebar from "../../components/shared/UserSidebar";
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
    { to: "/dashboard", label: "Overview", icon: Activity },
    { to: "/consult", label: "AI Consultation", icon: MessageSquare },
    { to: "/doctors", label: "Find Doctors", icon: Stethoscope },
    { to: "/prescription", label: "Prescriptions", icon: FileText },
    { to: "/medicines", label: "Medicines", icon: Bell },
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

export default function UserDashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [chats, setChats] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [chatsRes, presRes] = await Promise.all([
          api.get("/chat"),
          api.get("/user/prescriptions"),
        ]);
        setChats(chatsRes.data.chats.slice(0, 3));
        setPrescriptions(presRes.data.prescriptions.slice(0, 3));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const QUICK_ACTIONS = [
    {
      to: "/consult",
      label: "Start AI consultation",
      desc: "Describe your symptoms to our AI",
      icon: MessageSquare,
      bg: "#E6F1FB",
      color: "#0C447C",
    },
    {
      to: "/doctors",
      label: "Find a doctor",
      desc: "Browse verified specialists near you",
      icon: Stethoscope,
      bg: "#E1F5EE",
      color: "#1D9E75",
    },
    {
      to: "/prescription",
      label: "Upload prescription",
      desc: "Let AI read and manage your medicines",
      icon: FileText,
      bg: "#E6F1FB",
      color: "#0C447C",
    },
    {
      to: "/medicines",
      label: "Medicine schedule",
      desc: "View your daily medicine reminders",
      icon: Bell,
      bg: "#E1F5EE",
      color: "#1D9E75",
    },
  ];

  return (
    <div className="min-h-screen bg-cloud flex">
      <UserSidebar
        active={`/user/${user?._id}/dashboard`}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header
          className="bg-white border-b border-sky-light px-6 py-4
                           flex items-center justify-between sticky top-0 z-10"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-slate"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-midnight">
                Good{" "}
                {new Date().getHours() < 12
                  ? "morning"
                  : new Date().getHours() < 17
                    ? "afternoon"
                    : "evening"}
                , {user?.name?.split(" ")[0]}
              </h1>
              <p className="text-xs text-slate">How are you feeling today?</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/medicines"
              className="relative p-2 rounded-xl hover:bg-sky-light transition-colors"
            >
              <Bell size={18} className="text-slate" />
            </Link>
            <Link
              to="/profile"
              className="w-9 h-9 rounded-xl flex items-center justify-center
                         text-sm font-bold text-white flex-shrink-0"
              style={{ background: "#0C447C" }}
            >
              {user?.name?.charAt(0)}
            </Link>
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
              {/* Welcome banner */}
              <motion.div
                variants={fadeUp}
                className="rounded-2xl p-6 flex items-center justify-between overflow-hidden relative"
                style={{
                  background: "linear-gradient(135deg, #042C53, #0C447C)",
                }}
              >
                <div
                  className="absolute right-0 top-0 w-48 h-48 rounded-full opacity-10"
                  style={{
                    background: "radial-gradient(circle, #1D9E75, transparent)",
                    transform: "translate(30%, -30%)",
                  }}
                />
                <div>
                  <p className="text-white/70 text-sm mb-1">
                    Your health score
                  </p>
                  <p className="text-white text-3xl font-extrabold mb-3">
                    Good
                  </p>
                  <Link
                    to="/consult"
                    className="inline-flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-lg transition-all"
                    style={{ background: "#1D9E75", color: "white" }}
                  >
                    Start consultation <ChevronRight size={14} />
                  </Link>
                </div>
                <div className="hidden sm:flex items-center gap-2 opacity-60">
                  <div className="flex items-end gap-1 h-12">
                    {[0.4, 0.7, 1, 0.6, 0.9, 1.2, 0.8].map((h, i) => (
                      <motion.div
                        key={i}
                        className="w-1.5 rounded-full bg-white"
                        style={{ height: `${h * 40}px` }}
                        animate={{ scaleY: [1, h * 1.3, 1] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.1,
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Quick actions */}
              <motion.div variants={fadeUp}>
                <h2 className="text-base font-bold text-midnight mb-3">
                  Quick actions
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {QUICK_ACTIONS.map(
                    ({ to, label, desc, icon: Icon, bg, color }) => (
                      <Link
                        key={to}
                        to={to}
                        className="card hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                      >
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: bg }}
                        >
                          <Icon size={20} style={{ color }} />
                        </div>
                        <p className="text-sm font-semibold text-midnight leading-tight mb-1">
                          {label}
                        </p>
                        <p className="text-xs text-slate leading-relaxed">
                          {desc}
                        </p>
                      </Link>
                    ),
                  )}
                </div>
              </motion.div>

              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent chats */}
                <motion.div variants={fadeUp} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-midnight">
                      Recent consultations
                    </h2>
                    <Link
                      to="/consult"
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: "#185FA5" }}
                    >
                      <Plus size={13} /> New
                    </Link>
                  </div>

                  {chats.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageSquare
                        size={28}
                        className="mx-auto mb-2 opacity-20 text-navy"
                      />
                      <p className="text-sm text-slate mb-3">
                        No consultations yet
                      </p>
                      <Link
                        to="/consult"
                        className="text-xs font-semibold px-4 py-2 rounded-lg inline-block"
                        style={{ background: "#E6F1FB", color: "#0C447C" }}
                      >
                        Start your first
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {chats.map((chat) => (
                        <Link
                          key={chat._id}
                          to={`/consult?id=${chat._id}`}
                          className="flex items-center gap-3 p-3 rounded-xl border border-sky-light
                                     hover:bg-cloud transition-colors"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "#E6F1FB" }}
                          >
                            <MessageSquare
                              size={14}
                              style={{ color: "#0C447C" }}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-midnight truncate">
                              {chat.title}
                            </p>
                            <p className="text-xs text-slate">
                              {new Date(chat.updatedAt).toLocaleDateString(
                                "en-PK",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </p>
                          </div>
                          <ChevronRight
                            size={14}
                            className="text-slate flex-shrink-0"
                          />
                        </Link>
                      ))}
                    </div>
                  )}
                </motion.div>

                {/* Recent prescriptions */}
                <motion.div variants={fadeUp} className="card">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-base font-bold text-midnight">
                      Recent prescriptions
                    </h2>
                    <Link
                      to="/prescription"
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: "#185FA5" }}
                    >
                      <Plus size={13} /> Upload
                    </Link>
                  </div>

                  {prescriptions.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText
                        size={28}
                        className="mx-auto mb-2 opacity-20 text-navy"
                      />
                      <p className="text-sm text-slate mb-3">
                        No prescriptions uploaded
                      </p>
                      <Link
                        to="/prescription"
                        className="text-xs font-semibold px-4 py-2 rounded-lg inline-block"
                        style={{ background: "#E6F1FB", color: "#0C447C" }}
                      >
                        Upload first prescription
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {prescriptions.map((p) => (
                        <div
                          key={p._id}
                          className="flex items-center gap-3 p-3 rounded-xl border border-sky-light"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "#E1F5EE" }}
                          >
                            <FileText size={14} style={{ color: "#1D9E75" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-midnight truncate">
                              {p.medicines?.length} medicine
                              {p.medicines?.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-xs text-slate">
                              {new Date(p.createdAt).toLocaleDateString(
                                "en-PK",
                                {
                                  day: "numeric",
                                  month: "short",
                                },
                              )}
                            </p>
                          </div>
                          <span className="badge-teal flex-shrink-0">
                            Active
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Health tips */}
              <motion.div
                variants={fadeUp}
                className="card border-l-4"
                style={{ borderLeftColor: "#1D9E75" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "#E1F5EE" }}
                  >
                    <Shield size={16} style={{ color: "#1D9E75" }} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-midnight mb-1">
                      Health tip of the day
                    </p>
                    <p className="text-sm text-slate leading-relaxed">
                      Drink at least 8 glasses of water daily. Staying hydrated
                      helps maintain energy levels, supports kidney function,
                      and improves concentration.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}
