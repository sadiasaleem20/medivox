import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  MapPin,
  Clock,
  DollarSign,
  Star,
  Filter,
  LogOut,
  Menu,
  Activity,
  MessageSquare,
  FileText,
  Bell,
  Stethoscope,
  ChevronDown,
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import api from "../../lib/axios";
import { SPECIALIZATIONS, CITIES } from "../../constants";
import { useParams } from "react-router-dom";

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

function DoctorCard({ doctor }) {
  const { user: docUser } = doctor;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
          style={{ background: "#0C447C" }}
        >
          {docUser?.name?.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-midnight text-base truncate">
            {docUser?.name}
          </h3>
          <p className="text-sm text-slate">{doctor.specialization}</p>
          <div className="flex items-center gap-1 mt-1">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={11}
                className={
                  s <= Math.round(doctor.rating || 4.5)
                    ? "fill-amber-400 text-amber-400"
                    : "text-gray-200 fill-gray-200"
                }
              />
            ))}
            <span className="text-xs font-semibold text-midnight ml-1">
              {doctor.rating || "4.5"}
            </span>
            <span className="text-xs text-slate">({doctor.reviews || 0})</span>
          </div>
        </div>
        <span className="badge-teal flex-shrink-0">Verified</span>
      </div>

      <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-sky-light mb-4">
        <div className="text-center">
          <MapPin size={13} className="text-slate mx-auto mb-1" />
          <p className="text-xs text-slate truncate">{docUser?.city || "—"}</p>
        </div>
        <div className="text-center">
          <Clock size={13} className="text-slate mx-auto mb-1" />
          <p className="text-xs text-slate">{doctor.experience} yrs</p>
        </div>
        <div className="text-center">
          <DollarSign size={13} className="text-slate mx-auto mb-1" />
          <p className="text-xs text-slate">Rs. {doctor.fee}</p>
        </div>
      </div>

      {doctor.consultancyPlace && (
        <p className="text-xs text-slate mb-4 truncate">
          {doctor.consultancyPlace}
        </p>
      )}

      {doctor.startTime && doctor.endTime && (
        <p className="text-xs font-medium mb-4" style={{ color: "#1D9E75" }}>
          Available {doctor.startTime} — {doctor.endTime}
        </p>
      )}

      <button
        className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
        style={{ background: "#0C447C" }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "#185FA5")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "#0C447C")}
      >
        Book appointment
      </button>
    </motion.div>
  );
}

export default function DoctorMatch() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [city, setCity] = useState("");
  const [specialization, setSpec] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDoctors();
  }, [city, specialization]);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (specialization) params.append("specialization", specialization);
      const res = await api.get(`/doctor?${params.toString()}`);
      setDoctors(res.data.doctors);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = doctors.filter(
    (d) =>
      !search ||
      d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      d.specialization?.toLowerCase().includes(search.toLowerCase()),
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-cloud flex">
      <Sidebar
        active="/doctors"
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
          <div className="flex-1">
            <h1 className="text-lg font-bold text-midnight">Find a doctor</h1>
            <p className="text-xs text-slate">
              Browse verified specialists near you
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5">
          {/* Search and filters */}
          <div className="flex flex-col gap-3">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search
                  size={15}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or specialization..."
                  className="input-field pl-10 text-sm"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all"
                style={{
                  borderColor: showFilters ? "#0C447C" : "#E6F1FB",
                  background: showFilters ? "#E6F1FB" : "white",
                  color: showFilters ? "#0C447C" : "#888780",
                }}
              >
                <Filter size={15} /> Filters
                <ChevronDown
                  size={14}
                  className={`transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </button>
            </div>

            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid sm:grid-cols-2 gap-3 p-4 bg-white rounded-xl border border-sky-light"
              >
                <div>
                  <label className="block text-xs font-medium text-midnight mb-1.5">
                    City
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">All cities</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-midnight mb-1.5">
                    Specialization
                  </label>
                  <select
                    value={specialization}
                    onChange={(e) => setSpec(e.target.value)}
                    className="input-field text-sm"
                  >
                    <option value="">All specializations</option>
                    {SPECIALIZATIONS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                {(city || specialization) && (
                  <button
                    onClick={() => {
                      setCity("");
                      setSpec("");
                    }}
                    className="text-xs font-medium sm:col-span-2"
                    style={{ color: "#A32D2D" }}
                  >
                    Clear filters
                  </button>
                )}
              </motion.div>
            )}
          </div>

          {/* Results count */}
          {!loading && (
            <p className="text-sm text-slate">
              {filtered.length} doctor{filtered.length !== 1 ? "s" : ""} found
              {city && ` in ${city}`}
              {specialization && ` · ${specialization}`}
            </p>
          )}

          {/* Doctor grid */}
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <Stethoscope
                size={40}
                className="mx-auto mb-3 opacity-20 text-navy"
              />
              <p className="text-base font-semibold text-midnight mb-1">
                No doctors found
              </p>
              <p className="text-sm text-slate">
                Try adjusting your filters or search
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map((doc) => (
                <DoctorCard key={doc._id} doctor={doc} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
