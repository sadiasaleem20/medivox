import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  BellOff,
  Check,
  Clock,
  LogOut,
  Menu,
  Activity,
  MessageSquare,
  Stethoscope,
  FileText,
  Play,
  Pause,
  ChevronRight,
  AlertCircle,
  Pill,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import api from "../../lib/axios";
import toast from "react-hot-toast";

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
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
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

function MedicineCard({ medicine, onTake, taken }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="card transition-all"
      style={{
        borderLeft: `4px solid ${taken ? "#1D9E75" : "#185FA5"}`,
        opacity: taken ? 0.7 : 1,
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: taken ? "#E1F5EE" : "#E6F1FB" }}
          >
            <Pill size={18} style={{ color: taken ? "#1D9E75" : "#0C447C" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-midnight">{medicine.name}</h3>
            {medicine.dosage && (
              <p className="text-xs text-slate mt-0.5">{medicine.dosage}</p>
            )}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {medicine.times?.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-lg font-medium"
                  style={{ background: "#E6F1FB", color: "#0C447C" }}
                >
                  {t}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-2">
              {medicine.frequency && (
                <span className="text-xs text-slate">{medicine.frequency}</span>
              )}
              {medicine.withFood && (
                <span
                  className="text-xs font-medium"
                  style={{ color: "#1D9E75" }}
                >
                  With food
                </span>
              )}
              {medicine.duration && (
                <span className="text-xs text-slate">
                  · {medicine.duration}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={() => onTake(medicine.name)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                     flex-shrink-0 transition-all active:scale-95"
          style={{
            background: taken ? "#E1F5EE" : "#0C447C",
            color: taken ? "#1D9E75" : "white",
          }}
        >
          {taken ? (
            <>
              <Check size={13} /> Taken
            </>
          ) : (
            "Mark taken"
          )}
        </button>
      </div>
    </motion.div>
  );
}

function NotificationBanner({ medicine, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed top-4 right-4 z-50 bg-white border border-sky-light rounded-2xl
                 shadow-xl p-4 max-w-sm w-full flex items-start gap-3"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: "#E6F1FB" }}
      >
        <Bell size={18} style={{ color: "#0C447C" }} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-bold text-midnight">
          Time for your medicine
        </p>
        <p className="text-xs text-slate mt-0.5">
          {medicine.name} {medicine.dosage} —{" "}
          {medicine.withFood ? "Take with food" : "Take as directed"}
        </p>
      </div>
      <button
        onClick={onDismiss}
        className="text-slate hover:text-midnight transition-colors p-1"
      >
        ×
      </button>
    </motion.div>
  );
}

export default function MedicineScheduler() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(false);
  const [takenMeds, setTakenMeds] = useState({});
  const [notification, setNotification] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notifPermission, setNotifPermission] = useState("default");
  const intervalsRef = useRef([]);

  useEffect(() => {
    api
      .get("/user/prescriptions")
      .then((res) => {
        const activePres = res.data.prescriptions.filter((p) => p.isActive);
        setPrescriptions(activePres);
      })
      .catch(console.error)
      .finally(() => setLoading(false));

    const tick = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    if ("Notification" in window) {
      setNotifPermission(Notification.permission);
    }
  }, []);

  useEffect(() => {
    if (!active) {
      intervalsRef.current.forEach(clearInterval);
      intervalsRef.current = [];
      return;
    }
    startScheduler();
    return () => {
      intervalsRef.current.forEach(clearInterval);
    };
  }, [active, prescriptions]);

  const requestNotifications = async () => {
    if ("Notification" in window) {
      const perm = await Notification.requestPermission();
      setNotifPermission(perm);
      if (perm === "granted") toast.success("Notifications enabled");
      else toast.error("Notifications blocked. Reminders will show on screen.");
    }
  };

  const startScheduler = () => {
    const allMedicines = prescriptions.flatMap((p) => p.medicines || []);

    allMedicines.forEach((med) => {
      med.times?.forEach((time) => {
        const interval = setInterval(() => {
          const now = new Date();
          const [hourStr, rest] = time.split(":");
          const [minStr, meridiem] = rest.split(" ");
          let hour = parseInt(hourStr);
          const min = parseInt(minStr);
          if (meridiem === "PM" && hour !== 12) hour += 12;
          if (meridiem === "AM" && hour === 12) hour = 0;

          if (now.getHours() === hour && now.getMinutes() === min) {
            fireReminder(med);
          }
        }, 60000);
        intervalsRef.current.push(interval);
      });
    });
  };

  const fireReminder = (medicine) => {
    setNotification(medicine);

    if (notifPermission === "granted") {
      new Notification("Medivox — Medicine Reminder", {
        body: `Time to take ${medicine.name} ${medicine.dosage || ""}`,
        icon: "/favicon.svg",
      });
    }

    toast.custom(
      () => (
        <div className="bg-white border border-sky-light rounded-xl px-4 py-3 shadow-lg flex items-center gap-3">
          <Bell size={16} style={{ color: "#0C447C" }} />
          <div>
            <p className="text-sm font-semibold text-midnight">
              Medicine reminder
            </p>
            <p className="text-xs text-slate">
              {medicine.name} {medicine.dosage}
            </p>
          </div>
        </div>
      ),
      { duration: 8000 },
    );
  };

  const markTaken = (name) => {
    const key = `${name}-${new Date().toDateString()}`;
    setTakenMeds((prev) => ({ ...prev, [key]: !prev[key] }));
    if (!takenMeds[`${name}-${new Date().toDateString()}`]) {
      toast.success(`${name} marked as taken`);
    }
  };

  const isTaken = (name) => {
    return !!takenMeds[`${name}-${new Date().toDateString()}`];
  };

  const allMedicines = prescriptions.flatMap((p) => p.medicines || []);
  const takenCount = allMedicines.filter((m) => isTaken(m.name)).length;

  const getNextDue = () => {
    const now = new Date();
    const nowMins = now.getHours() * 60 + now.getMinutes();
    let next = null;
    let diff = Infinity;

    allMedicines.forEach((med) => {
      med.times?.forEach((time) => {
        const [hourStr, rest] = time.split(":");
        const [minStr, meridiem] = rest.split(" ");
        let hour = parseInt(hourStr);
        const min = parseInt(minStr);
        if (meridiem === "PM" && hour !== 12) hour += 12;
        if (meridiem === "AM" && hour === 12) hour = 0;
        const medMins = hour * 60 + min;
        const d =
          medMins >= nowMins ? medMins - nowMins : 24 * 60 - nowMins + medMins;
        if (d < diff && !isTaken(med.name)) {
          diff = d;
          next = { medicine: med, time, minsAway: d };
        }
      });
    });
    return next;
  };

  const nextDue = getNextDue();
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-cloud flex">
      <Sidebar
        active="/medicines"
        onLogout={handleLogout}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <AnimatePresence>
        {notification && (
          <NotificationBanner
            medicine={notification}
            onDismiss={() => setNotification(null)}
          />
        )}
      </AnimatePresence>

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header className="bg-white border-b border-sky-light px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate"
          >
            <Menu size={22} />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-midnight">
              Medicine schedule
            </h1>
            <p className="text-xs text-slate">
              {currentTime.toLocaleDateString("en-PK", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
          </div>
          {notifPermission !== "granted" && (
            <button
              onClick={requestNotifications}
              className="flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-xl transition-all"
              style={{ background: "#E6F1FB", color: "#0C447C" }}
            >
              <Bell size={13} /> Enable notifications
            </button>
          )}
        </header>

        <main className="flex-1 p-6 space-y-5">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
            </div>
          ) : allMedicines.length === 0 ? (
            <div className="card text-center py-20">
              <Pill size={40} className="mx-auto mb-3 opacity-20 text-navy" />
              <p className="text-base font-semibold text-midnight mb-1">
                No active medicines
              </p>
              <p className="text-sm text-slate mb-5">
                Upload a prescription to start your medicine schedule
              </p>
              <Link
                to="/prescription"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#0C447C" }}
              >
                Upload prescription <ChevronRight size={15} />
              </Link>
            </div>
          ) : (
            <>
              {/* Stats row */}
              <div className="grid grid-cols-3 gap-4">
                <div className="card text-center">
                  <p className="text-2xl font-extrabold text-midnight">
                    {allMedicines.length}
                  </p>
                  <p className="text-xs text-slate mt-0.5">Total medicines</p>
                </div>
                <div className="card text-center">
                  <p
                    className="text-2xl font-extrabold"
                    style={{ color: "#1D9E75" }}
                  >
                    {takenCount}
                  </p>
                  <p className="text-xs text-slate mt-0.5">Taken today</p>
                </div>
                <div className="card text-center">
                  <p
                    className="text-2xl font-extrabold"
                    style={{ color: "#854F0B" }}
                  >
                    {allMedicines.length - takenCount}
                  </p>
                  <p className="text-xs text-slate mt-0.5">Remaining</p>
                </div>
              </div>

              {/* Next due banner */}
              {nextDue && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-2xl p-5 flex items-center justify-between"
                  style={{
                    background: "linear-gradient(135deg, #042C53, #0C447C)",
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "rgba(255,255,255,0.15)" }}
                    >
                      <Clock size={22} className="text-white" />
                    </div>
                    <div>
                      <p className="text-white/70 text-xs mb-0.5">
                        Next medicine due
                      </p>
                      <p className="text-white font-bold text-base">
                        {nextDue.medicine.name}
                      </p>
                      <p className="text-white/70 text-xs">
                        {nextDue.time} ·{" "}
                        {nextDue.minsAway < 60
                          ? `${nextDue.minsAway} min away`
                          : `${Math.floor(nextDue.minsAway / 60)}h ${nextDue.minsAway % 60}m away`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActive(!active)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{
                      background: active ? "#E24B4A" : "#1D9E75",
                      color: "white",
                    }}
                  >
                    {active ? (
                      <>
                        <Pause size={15} /> Stop
                      </>
                    ) : (
                      <>
                        <Play size={15} /> Start scheduler
                      </>
                    )}
                  </button>
                </motion.div>
              )}

              {/* Scheduler status */}
              {!active && (
                <div
                  className="card flex items-center gap-3"
                  style={{ borderLeft: "4px solid #854F0B" }}
                >
                  <AlertCircle
                    size={18}
                    style={{ color: "#854F0B" }}
                    className="flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-midnight">
                      Scheduler is off
                    </p>
                    <p className="text-xs text-slate">
                      Press Start to activate medicine reminders
                    </p>
                  </div>
                  <button
                    onClick={() => setActive(true)}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl text-white transition-all"
                    style={{ background: "#0C447C" }}
                  >
                    <Play size={13} /> Start
                  </button>
                </div>
              )}

              {active && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="card flex items-center gap-3"
                  style={{ borderLeft: "4px solid #1D9E75" }}
                >
                  <div className="w-2 h-2 rounded-full bg-teal animate-pulse-slow flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-midnight">
                      Scheduler is active
                    </p>
                    <p className="text-xs text-slate">
                      You will be reminded at each medicine time
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Medicine list */}
              <div>
                <h2 className="text-base font-bold text-midnight mb-3">
                  Today's medicines
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {allMedicines.map((med, i) => (
                      <MedicineCard
                        key={`${med.name}-${i}`}
                        medicine={med}
                        onTake={markTaken}
                        taken={isTaken(med.name)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Progress */}
              {allMedicines.length > 0 && (
                <div className="card">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-midnight">
                      Today's progress
                    </p>
                    <p
                      className="text-sm font-bold"
                      style={{ color: "#1D9E75" }}
                    >
                      {Math.round((takenCount / allMedicines.length) * 100)}%
                    </p>
                  </div>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ background: "#E6F1FB" }}
                  >
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: "#1D9E75" }}
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(takenCount / allMedicines.length) * 100}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeOut" }}
                    />
                  </div>
                  <p className="text-xs text-slate mt-2">
                    {takenCount} of {allMedicines.length} medicines taken today
                  </p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
