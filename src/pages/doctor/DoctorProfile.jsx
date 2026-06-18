import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  MapPin,
  Stethoscope,
  Clock,
  DollarSign,
  FileText,
  Upload,
  Save,
  LogOut,
  Menu,
  CheckCircle,
  X,
  Download,
  Eye,
  Trash2,
  Plus,
  Edit,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import DoctorSidebar from "../../components/shared/DoctorSidebar";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { SPECIALIZATIONS } from "../../constants";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function DocumentViewModal({ doc, onClose }) {
  const isPdf =
    doc.url?.startsWith("data:application/pdf") || doc.name?.endsWith(".pdf");
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-xl overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-sky-light">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "#E6F1FB" }}
            >
              <FileText size={15} style={{ color: "#0C447C" }} />
            </div>
            <div>
              <p className="text-sm font-bold text-midnight">{doc.name}</p>
              <p className="text-xs text-slate">
                {doc.size ? `${(doc.size / 1024).toFixed(1)} KB · ` : ""}
                {new Date(doc.uploadedAt).toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={doc.url}
              download={doc.name}
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
              style={{ background: "#E1F5EE", color: "#085041" }}
            >
              <Download size={13} /> Download
            </a>
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-cloud transition-colors"
            >
              <X size={16} className="text-slate" />
            </button>
          </div>
        </div>
        <div className="p-4 max-h-[70vh] overflow-auto bg-cloud">
          {isPdf ? (
            <div className="text-center py-12">
              <FileText
                size={40}
                className="mx-auto mb-3 text-slate opacity-40"
              />
              <p className="text-sm text-slate mb-3">
                PDF preview not available in browser
              </p>
              <a
                href={doc.url}
                download={doc.name}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white"
                style={{ background: "#0C447C" }}
              >
                <Download size={15} /> Download to view
              </a>
            </div>
          ) : (
            <img
              src={doc.url}
              alt={doc.name}
              className="w-full rounded-xl object-contain"
            />
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function DoctorProfile() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const docFileRef = useRef();
  const picRef = useRef();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [docUploading, setDocUploading] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);

  const [form, setForm] = useState({
    specialization: "",
    experience: "",
    fee: "",
    consultancyPlace: "",
    startTime: "",
    endTime: "",
    availableDays: [],
    about: "",
  });

  const id = user?._id;

  useEffect(() => {
    api
      .get("/doctor/me")
      .then((res) => {
        const d = res.data.doctor;
        setDoctor(d);
        setForm({
          specialization: d.specialization || "",
          experience: d.experience || "",
          fee: d.fee || "",
          consultancyPlace: d.consultancyPlace || "",
          startTime: d.startTime || "",
          endTime: d.endTime || "",
          availableDays: d.availableDays || [],
          about: d.about || "",
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const toggleDay = (day) => {
    if (!editing) return;
    setForm((p) => ({
      ...p,
      availableDays: p.availableDays.includes(day)
        ? p.availableDays.filter((d) => d !== day)
        : [...p.availableDays, day],
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/doctor/me", form);
      setDoctor(res.data.doctor);
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (doctor) {
      setForm({
        specialization: doctor.specialization || "",
        experience: doctor.experience || "",
        fee: doctor.fee || "",
        consultancyPlace: doctor.consultancyPlace || "",
        startTime: doctor.startTime || "",
        endTime: doctor.endTime || "",
        availableDays: doctor.availableDays || [],
        about: doctor.about || "",
      });
    }
    setEditing(false);
  };

  const handleProfilePic = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await api.put("/doctor/me", {
          profilePicture: reader.result,
        });
        setDoctor(res.data.doctor);
        toast.success("Profile picture updated");
      } catch {
        toast.error("Failed to upload picture");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDocUpload = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!allowed.includes(file.type)) {
      toast.error("Only images and PDFs allowed");
      return;
    }
    setDocUploading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const res = await api.post("/doctor/me/documents", {
          name: file.name,
          size: file.size,
          url: reader.result,
        });
        setDoctor(res.data.doctor);
        toast.success("Document uploaded");
      } catch {
        toast.error("Upload failed");
      } finally {
        setDocUploading(false);
        if (docFileRef.current) docFileRef.current.value = "";
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDeleteDoc = async (docId) => {
    try {
      const res = await api.delete(`/doctor/me/documents/${docId}`);
      setDoctor(res.data.doctor);
      toast.success("Document removed");
    } catch {
      toast.error("Failed to remove document");
    }
  };

  const inputClass = (extra = "") =>
    `input-field text-sm ${!editing ? "bg-cloud cursor-not-allowed opacity-70" : ""} ${extra}`;

  return (
    <div className="min-h-screen bg-cloud flex">
      <DoctorSidebar
        active={`/doctor/${id}/profile`}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />

      <AnimatePresence>
        {viewDoc && (
          <DocumentViewModal doc={viewDoc} onClose={() => setViewDoc(null)} />
        )}
      </AnimatePresence>

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
          <div className="flex-1">
            <h1 className="text-lg font-bold text-midnight">My profile</h1>
            <p className="text-xs text-slate">
              Update your information and documents
            </p>
          </div>

          {editing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all border"
                style={{ borderColor: "#E6F1FB", color: "#888780" }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                           text-white transition-all active:scale-95 disabled:opacity-60"
                style={{ background: "#1D9E75" }}
              >
                {saving ? (
                  <svg
                    className="animate-spin w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="white"
                      strokeWidth="3"
                      strokeOpacity="0.3"
                    />
                    <path
                      d="M12 2a10 10 0 0 1 10 10"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                ) : (
                  <Save size={16} />
                )}
                {saving ? "Saving..." : "Save changes"}
              </button>
            </div>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                         text-white transition-all active:scale-95"
              style={{ background: "#0C447C" }}
            >
              <Edit size={16} /> Edit profile
            </button>
          )}
        </header>

        <main className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="w-8 h-8 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
            </div>
          ) : (
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Left column */}
              <div className="space-y-5">
                {/* Profile picture */}
                <div className="card">
                  <h2 className="text-base font-bold text-midnight mb-4">
                    Profile picture
                  </h2>
                  <div className="flex items-center gap-5">
                    <div
                      className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 border border-sky-light"
                      style={{ background: "#E6F1FB" }}
                    >
                      {doctor?.profilePicture ? (
                        <img
                          src={doctor.profilePicture}
                          className="w-full h-full object-cover"
                          alt="Profile"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center
                                        text-2xl font-bold"
                          style={{ color: "#0C447C" }}
                        >
                          {user?.name?.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-midnight">
                        {user?.name}
                      </p>
                      <p className="text-xs text-slate mb-3">
                        {doctor?.specialization || "Doctor"}
                      </p>
                      <input
                        ref={picRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleProfilePic(e.target.files[0])}
                      />
                      <button
                        onClick={() => picRef.current?.click()}
                        className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg transition-all"
                        style={{ background: "#E6F1FB", color: "#0C447C" }}
                      >
                        <Upload size={13} />
                        {doctor?.profilePicture
                          ? "Change photo"
                          : "Upload photo"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Personal info */}
                <div className="card space-y-4">
                  <h2 className="text-base font-bold text-midnight">
                    Personal information
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-midnight mb-1.5">
                      Full name
                    </label>
                    <div className="relative">
                      <User
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                      />
                      <input
                        value={user?.name}
                        disabled
                        className="input-field pl-10 text-sm bg-cloud cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-midnight mb-1.5">
                      Email
                    </label>
                    <div className="relative">
                      <Mail
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                      />
                      <input
                        value={user?.email}
                        disabled
                        className="input-field pl-10 text-sm bg-cloud cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-midnight mb-1.5">
                      Specialization
                    </label>
                    <div className="relative">
                      <Stethoscope
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                      />
                      <select
                        name="specialization"
                        value={form.specialization}
                        onChange={handleChange}
                        disabled={!editing}
                        className={inputClass("pl-10")}
                      >
                        <option value="">Select specialization</option>
                        {SPECIALIZATIONS.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-midnight mb-1.5">
                        Experience (years)
                      </label>
                      <input
                        name="experience"
                        type="number"
                        value={form.experience}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="e.g. 8"
                        className={inputClass()}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-midnight mb-1.5">
                        Fee (Rs.)
                      </label>
                      <div className="relative">
                        <DollarSign
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                        />
                        <input
                          name="fee"
                          type="number"
                          value={form.fee}
                          onChange={handleChange}
                          disabled={!editing}
                          placeholder="e.g. 2000"
                          className={inputClass("pl-10")}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-midnight mb-1.5">
                      About you
                    </label>
                    <textarea
                      name="about"
                      value={form.about}
                      onChange={handleChange}
                      disabled={!editing}
                      placeholder="Brief description about your practice..."
                      rows={3}
                      className={inputClass("resize-none")}
                    />
                  </div>
                </div>

                {/* Documents */}
                <div className="card space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-base font-bold text-midnight">
                        Uploaded documents
                      </h2>
                      <p className="text-xs text-slate mt-0.5">
                        License, degree, and credentials
                      </p>
                    </div>
                    <div>
                      <input
                        ref={docFileRef}
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => handleDocUpload(e.target.files[0])}
                      />
                      <button
                        onClick={() => docFileRef.current?.click()}
                        disabled={docUploading}
                        className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-all"
                        style={{ background: "#E6F1FB", color: "#0C447C" }}
                      >
                        {docUploading ? (
                          <svg
                            className="animate-spin w-3 h-3"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <circle
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="#0C447C"
                              strokeWidth="3"
                              strokeOpacity="0.3"
                            />
                            <path
                              d="M12 2a10 10 0 0 1 10 10"
                              stroke="#0C447C"
                              strokeWidth="3"
                              strokeLinecap="round"
                            />
                          </svg>
                        ) : (
                          <Plus size={13} />
                        )}
                        Add document
                      </button>
                    </div>
                  </div>

                  {!doctor?.documents || doctor.documents.length === 0 ? (
                    <div
                      className="text-center py-8 border-2 border-dashed rounded-xl"
                      style={{ borderColor: "#B5D4F4" }}
                    >
                      <FileText
                        size={24}
                        className="mx-auto mb-2 text-slate opacity-40"
                      />
                      <p className="text-xs text-slate">
                        No documents uploaded yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {doctor.documents.map((doc, i) => (
                        <motion.div
                          key={doc._id || i}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-3 p-3 rounded-xl border border-sky-light
                                     hover:bg-cloud transition-colors"
                        >
                          <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ background: "#E6F1FB" }}
                          >
                            <FileText size={16} style={{ color: "#0C447C" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-midnight truncate">
                              {doc.name}
                            </p>
                            <p className="text-xs text-slate">
                              {doc.size
                                ? `${(doc.size / 1024).toFixed(1)} KB · `
                                : ""}
                              {new Date(doc.uploadedAt).toLocaleDateString(
                                "en-PK",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                              {" · "}
                              {new Date(doc.uploadedAt).toLocaleTimeString(
                                "en-PK",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                },
                              )}
                            </p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <button
                              onClick={() => setViewDoc(doc)}
                              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                              style={{
                                background: "#E6F1FB",
                                color: "#0C447C",
                              }}
                            >
                              <Eye size={12} /> View
                            </button>
                            <a
                              href={doc.url}
                              download={doc.name}
                              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg"
                              style={{
                                background: "#E1F5EE",
                                color: "#085041",
                              }}
                            >
                              <Download size={12} /> Save
                            </a>
                            <button
                              onClick={() => handleDeleteDoc(doc._id)}
                              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                            >
                              <Trash2 size={13} className="text-red-400" />
                            </button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Right column */}
              <div className="space-y-5">
                {/* Practice details */}
                <div className="card space-y-4">
                  <h2 className="text-base font-bold text-midnight">
                    Practice details
                  </h2>

                  <div>
                    <label className="block text-xs font-medium text-midnight mb-1.5">
                      Consultancy place
                    </label>
                    <div className="relative">
                      <MapPin
                        size={15}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                      />
                      <input
                        name="consultancyPlace"
                        value={form.consultancyPlace}
                        onChange={handleChange}
                        disabled={!editing}
                        placeholder="e.g. Shaukat Khanum Hospital, Lahore"
                        className={inputClass("pl-10")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-midnight mb-1.5">
                        Start time
                      </label>
                      <div className="relative">
                        <Clock
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                        />
                        <input
                          name="startTime"
                          type="time"
                          value={form.startTime}
                          onChange={handleChange}
                          disabled={!editing}
                          className={inputClass("pl-10")}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-midnight mb-1.5">
                        End time
                      </label>
                      <div className="relative">
                        <Clock
                          size={15}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                        />
                        <input
                          name="endTime"
                          type="time"
                          value={form.endTime}
                          onChange={handleChange}
                          disabled={!editing}
                          className={inputClass("pl-10")}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-midnight mb-2">
                      Available days
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {DAYS.map((day) => (
                        <button
                          key={day}
                          type="button"
                          onClick={() => toggleDay(day)}
                          className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                          style={{
                            background: form.availableDays.includes(day)
                              ? "#0C447C"
                              : "#F8FAFC",
                            color: form.availableDays.includes(day)
                              ? "white"
                              : "#888780",
                            border: `1px solid ${form.availableDays.includes(day) ? "#0C447C" : "#E6F1FB"}`,
                            opacity: !editing ? 0.7 : 1,
                            cursor: !editing ? "not-allowed" : "pointer",
                          }}
                        >
                          {day}
                        </button>
                      ))}
                    </div>
                    {!editing && (
                      <p className="text-xs text-slate mt-2">
                        Click Edit profile to change available days
                      </p>
                    )}
                  </div>
                </div>

                {/* Verification status */}
                <div className="card">
                  <h2 className="text-sm font-bold text-midnight mb-3">
                    Verification status
                  </h2>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        doctor?.status === "approved"
                          ? "bg-teal"
                          : doctor?.status === "rejected"
                            ? "bg-red-500"
                            : "bg-amber-400"
                      }`}
                    />
                    <div>
                      <p className="text-sm font-semibold text-midnight capitalize">
                        {doctor?.status || "Pending"}
                      </p>
                      <p className="text-xs text-slate">
                        {doctor?.status === "approved" &&
                          "Your profile is live and visible to patients"}
                        {doctor?.status === "rejected" &&
                          (doctor?.rejectionReason ||
                            "Please update your documents")}
                        {doctor?.status === "pending" &&
                          "Under review by admin team"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Tips when pending */}
                {doctor?.status === "pending" && (
                  <div
                    className="card"
                    style={{ borderLeft: "4px solid #1D9E75" }}
                  >
                    <p className="text-sm font-semibold text-midnight mb-1">
                      While you wait
                    </p>
                    <p className="text-xs text-slate leading-relaxed">
                      Make sure your profile is complete and your license
                      document is uploaded clearly. Our admin team will review
                      your application and notify you once approved.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
