import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Menu, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import UserSidebar from "../../components/shared/UserSidebar";
import api from "../../lib/axios";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: { bg: "#FAEEDA", color: "#854F0B", label: "Pending" },
  confirmed: { bg: "#E1F5EE", color: "#085041", label: "Confirmed" },
  cancelled: { bg: "#FCEBEB", color: "#A32D2D", label: "Cancelled" },
  completed: { bg: "#E6F1FB", color: "#0C447C", label: "Completed" },
};

export default function MyAppointments() {
  const { user } = useAuthStore();
  const id = user?._id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");

  useEffect(() => {
    api
      .get("/appointments/my")
      .then((res) => setAppointments(res.data.appointments))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (aptId) => {
    try {
      await api.patch(`/appointments/${aptId}/cancel`);
      setAppointments((prev) =>
        prev.map((a) => (a._id === aptId ? { ...a, status: "cancelled" } : a)),
      );
      toast.success("Appointment cancelled");
    } catch {
      toast.error("Could not cancel appointment");
    }
  };

  const filtered = appointments.filter(
    (a) => tab === "all" || a.status === tab,
  );

  const TABS = ["all", "pending", "confirmed", "completed", "cancelled"];

  return (
    <div className="min-h-screen bg-cloud flex">
      <UserSidebar
        active={`/user/${id}/appointments`}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <div className="flex-1 lg:ml-64 flex flex-col">
        <header
          className="bg-white border-b border-sky-light px-6 py-4
                           flex items-center gap-4 sticky top-0 z-10"
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-slate"
          >
            <Menu size={22} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-midnight">My appointments</h1>
            <p className="text-xs text-slate">
              {appointments.length} total bookings
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5">
          <div className="flex gap-2 flex-wrap">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all"
                style={{
                  background: tab === t ? "#0C447C" : "white",
                  color: tab === t ? "white" : "#888780",
                  border: tab === t ? "none" : "1px solid #E6F1FB",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="card text-center py-16">
              <Calendar
                size={36}
                className="mx-auto mb-3 opacity-20 text-navy"
              />
              <p className="text-base font-semibold text-midnight mb-1">
                No appointments yet
              </p>
              <p className="text-sm text-slate mb-5">
                Browse verified doctors and book your first appointment
              </p>
              <Link
                to={`/user/${id}/doctors`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#0C447C" }}
              >
                Find a doctor
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((apt, i) => {
                const sc = STATUS_COLORS[apt.status];
                const doc = apt.doctor;
                return (
                  <motion.div
                    key={apt._id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="card hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
                          style={{ background: "#E6F1FB" }}
                        >
                          {doc?.profilePicture ? (
                            <img
                              src={doc.profilePicture}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div
                              className="w-full h-full flex items-center justify-center font-bold"
                              style={{ color: "#0C447C" }}
                            >
                              {doc?.user?.name?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-midnight">
                            {doc?.user?.name}
                          </p>
                          <p className="text-xs text-slate">
                            {doc?.specialization}
                          </p>
                          <div className="flex items-center gap-1 mt-0.5">
                            <MapPin size={11} className="text-slate" />
                            <p className="text-xs text-slate">
                              {doc?.user?.city}
                            </p>
                          </div>
                        </div>
                      </div>
                      <span
                        className="text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0"
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {sc.label}
                      </span>
                    </div>

                    <div className="flex items-center gap-6 py-3 border-t border-b border-sky-light mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="text-slate" />
                        <p className="text-sm font-medium text-midnight">
                          {new Date(apt.date + "T00:00:00").toLocaleDateString(
                            "en-PK",
                            {
                              weekday: "short",
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-slate" />
                        <p className="text-sm font-medium text-midnight">
                          {apt.time}
                        </p>
                      </div>
                    </div>

                    {apt.reason && (
                      <p className="text-xs text-slate mb-4">
                        Reason: {apt.reason}
                      </p>
                    )}

                    {apt.status === "pending" && (
                      <button
                        onClick={() => handleCancel(apt._id)}
                        className="flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl
                                   border transition-all"
                        style={{ borderColor: "#E24B4A", color: "#A32D2D" }}
                      >
                        <X size={13} /> Cancel appointment
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
