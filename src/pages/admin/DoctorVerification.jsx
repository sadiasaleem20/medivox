import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserCheck,
  XCircle,
  Clock,
  CheckCircle,
  Search,
  Filter,
  ChevronLeft,
  LogOut,
  Menu,
  Users,
  Activity,
  Eye,
  X,
  FileText,
  Download,
  AlertCircle,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import api from "../../lib/axios";
import toast from "react-hot-toast";

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
        className={`fixed top-0 left-0 h-full w-64 z-30 flex flex-col transition-transform duration-300
                        ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
        style={{ background: "#042C53" }}
      >
        <div className="p-6 border-b border-white/10">
          <Logo size="md" />
          <div
            className="mt-3 px-2 py-1 rounded-lg text-xs font-medium inline-block"
            style={{ background: "#E1F5EE", color: "#085041" }}
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

function DoctorModal({ doctor, onClose, onAction }) {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);

  const handleAction = async (status) => {
    setLoading(true);
    await onAction(doctor._id, status, reason);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-sky-light flex-shrink-0">
          <h2 className="text-lg font-bold text-midnight">
            Doctor application
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-cloud transition-colors"
          >
            <X size={18} className="text-slate" />
          </button>
        </div>

        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0 border border-sky-light"
              style={{ background: "#E6F1FB" }}
            >
              {doctor.profilePicture ? (
                <img
                  src={doctor.profilePicture}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-xl font-bold"
                  style={{ color: "#0C447C" }}
                >
                  {doctor.user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <h3 className="font-bold text-midnight text-base">
                {doctor.user?.name}
              </h3>
              <p className="text-sm text-slate">{doctor.user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Specialization", value: doctor.specialization },
              { label: "Experience", value: `${doctor.experience} years` },
              { label: "Fee", value: `Rs. ${doctor.fee}` },
              { label: "City", value: doctor.user?.city },
              { label: "Phone", value: doctor.user?.phone },
              { label: "Place", value: doctor.consultancyPlace },
              {
                label: "Hours",
                value:
                  doctor.startTime && doctor.endTime
                    ? `${doctor.startTime} — ${doctor.endTime}`
                    : "—",
              },
              {
                label: "Available",
                value: doctor.availableDays?.join(", ") || "—",
              },
            ].map(({ label, value }) => (
              <div key={label} className="bg-cloud rounded-xl p-3">
                <p className="text-xs text-slate mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-midnight">
                  {value || "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div>
            <p className="text-sm font-bold text-midnight mb-2">
              Uploaded documents ({doctor.documents?.length || 0})
            </p>
            {!doctor.documents || doctor.documents.length === 0 ? (
              <div
                className="text-center py-6 rounded-xl border border-dashed"
                style={{ borderColor: "#B5D4F4" }}
              >
                <FileText
                  size={20}
                  className="mx-auto mb-1 text-slate opacity-30"
                />
                <p className="text-xs text-slate">No documents uploaded</p>
              </div>
            ) : (
              <div className="space-y-2">
                {doctor.documents.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-xl border border-sky-light"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ background: "#E6F1FB" }}
                    >
                      <FileText size={14} style={{ color: "#0C447C" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-midnight truncate">
                        {doc.name}
                      </p>
                      <p className="text-xs text-slate">
                        {doc.size
                          ? `${(doc.size / 1024).toFixed(1)} KB · `
                          : ""}
                        {new Date(doc.uploadedAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}{" "}
                        {new Date(doc.uploadedAt).toLocaleTimeString("en-PK", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setViewDoc(doc)}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                        style={{ background: "#E6F1FB", color: "#0C447C" }}
                      >
                        <Eye size={12} /> View
                      </button>
                      <a
                        href={doc.url}
                        download={doc.name}
                        className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                        style={{ background: "#E1F5EE", color: "#085041" }}
                      >
                        <Download size={12} /> Save
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {doctor.status === "pending" && (
            <div>
              <label className="block text-sm font-medium text-midnight mb-1.5">
                Rejection reason (required if rejecting)
              </label>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="e.g. License document unclear, please resubmit..."
                className="input-field resize-none h-20 text-sm"
              />
            </div>
          )}
        </div>

        {doctor.status === "pending" && (
          <div className="flex gap-3 p-6 pt-0 flex-shrink-0">
            <button
              onClick={() => handleAction("rejected")}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl border text-sm font-semibold transition-all disabled:opacity-50"
              style={{ borderColor: "#E24B4A", color: "#A32D2D" }}
            >
              Reject
            </button>
            <button
              onClick={() => handleAction("approved")}
              disabled={loading}
              className="flex-1 py-2.5 rounded-xl text-white text-sm font-semibold transition-all disabled:opacity-50"
              style={{ background: "#1D9E75" }}
            >
              {loading ? "Processing..." : "Approve"}
            </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {viewDoc && (
          <div className="fixed inset-0 bg-black/70 z-60 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white rounded-2xl w-full max-w-xl shadow-xl overflow-hidden"
            >
              <div className="flex items-center justify-between px-5 py-4 border-b border-sky-light">
                <p className="text-sm font-bold text-midnight">
                  {viewDoc.name}
                </p>
                <div className="flex items-center gap-2">
                  <a
                    href={viewDoc.url}
                    download={viewDoc.name}
                    className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                    style={{ background: "#E1F5EE", color: "#085041" }}
                  >
                    <Download size={13} /> Download
                  </a>
                  <button
                    onClick={() => setViewDoc(null)}
                    className="p-2 rounded-xl hover:bg-cloud"
                  >
                    <X size={16} className="text-slate" />
                  </button>
                </div>
              </div>
              <div className="p-4 max-h-96 overflow-auto bg-cloud">
                {viewDoc.name?.endsWith(".pdf") ? (
                  <div className="text-center py-10">
                    <FileText
                      size={36}
                      className="mx-auto mb-2 text-slate opacity-30"
                    />
                    <p className="text-sm text-slate mb-3">
                      Download to view PDF
                    </p>
                    <a
                      href={viewDoc.url}
                      download={viewDoc.name}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                      style={{ background: "#0C447C" }}
                    >
                      <Download size={14} /> Download
                    </a>
                  </div>
                ) : (
                  <img
                    src={viewDoc.url}
                    alt={viewDoc.name}
                    className="w-full rounded-xl object-contain"
                  />
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TABS = ["all", "pending", "approved", "rejected"];

export default function DoctorVerification() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/doctors");
      setDoctors(res.data.doctors);
    } catch {
      toast.error("Failed to load doctors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleAction = async (id, status, rejectionReason) => {
    try {
      await api.patch(`/admin/doctors/${id}`, { status, rejectionReason });
      toast.success(
        status === "approved" ? "Doctor approved" : "Doctor rejected",
      );
      fetchDoctors();
    } catch {
      toast.error("Action failed");
    }
  };

  const filtered = doctors
    .filter((d) => tab === "all" || d.status === tab)
    .filter(
      (d) =>
        !search ||
        d.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization?.toLowerCase().includes(search.toLowerCase()),
    );

  const statusBadge = (status) => {
    if (status === "approved")
      return <span className="badge-teal">Approved</span>;
    if (status === "rejected")
      return <span className="badge-red">Rejected</span>;
    return <span className="badge-amber">Pending</span>;
  };

  return (
    <div className="min-h-screen bg-cloud flex">
      <Sidebar
        active="/admin/doctors"
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
            <h1 className="text-lg font-bold text-midnight">
              Doctor verification
            </h1>
            <p className="text-xs text-slate">
              Review and manage doctor applications
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5">
          {/* Search and tabs */}
          <div className="flex flex-col sm:flex-row gap-3">
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
            <div className="flex gap-2">
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
          </div>

          {/* Table */}
          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <UserCheck
                  size={36}
                  className="mx-auto mb-2 opacity-20 text-navy"
                />
                <p className="text-sm text-slate">No doctors found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sky-light bg-cloud">
                      {[
                        "Doctor",
                        "Specialization",
                        "City",
                        "Fee",
                        "Status",
                        "Action",
                      ].map((h) => (
                        <th
                          key={h}
                          className="text-left text-xs font-semibold text-slate px-5 py-3"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((doc, i) => (
                      <motion.tr
                        key={doc._id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-sky-light hover:bg-cloud transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: "#185FA5" }}
                            >
                              {doc.user?.name?.charAt(0)}
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-midnight">
                                {doc.user?.name}
                              </p>
                              <p className="text-xs text-slate">
                                {doc.user?.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-midnight">
                          {doc.specialization}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate">
                          {doc.user?.city}
                        </td>
                        <td className="px-5 py-4 text-sm text-midnight">
                          Rs. {doc.fee}
                        </td>
                        <td className="px-5 py-4">{statusBadge(doc.status)}</td>
                        <td className="px-5 py-4">
                          <button
                            onClick={() => setSelected(doc)}
                            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                            style={{ background: "#E6F1FB", color: "#0C447C" }}
                          >
                            <Eye size={13} /> Review
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </main>
      </div>

      <AnimatePresence>
        {selected && (
          <DoctorModal
            doctor={selected}
            onClose={() => setSelected(null)}
            onAction={handleAction}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
