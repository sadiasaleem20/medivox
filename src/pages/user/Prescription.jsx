import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  X,
  CheckCircle,
  AlertCircle,
  LogOut,
  Menu,
  Activity,
  MessageSquare,
  Stethoscope,
  Bell,
  Brain,
  Eye,
  Trash2,
  Plus,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import UserSidebar from "../../components/shared/UserSidebar";
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

const FREQ_OPTIONS = [
  "Once daily",
  "Twice daily",
  "Three times daily",
  "Every 8 hours",
  "Every 6 hours",
  "As needed",
];
const TIME_OPTIONS = [
  "6:00 AM",
  "7:00 AM",
  "8:00 AM",
  "9:00 AM",
  "12:00 PM",
  "2:00 PM",
  "6:00 PM",
  "8:00 PM",
  "10:00 PM",
];

export default function Prescription() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [rawText, setRawText] = useState("");
  const [step, setStep] = useState("upload");
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    api
      .get("/user/prescriptions")
      .then((res) => setPrescriptions(res.data.prescriptions))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleFile = (file) => {
    if (!file) return;
    const allowed = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowed.includes(file.type)) {
      toast.error("Please upload a JPG or PNG image");
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setStep("preview");
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyzeWithAI = async () => {
    if (!image) return;
    setAnalyzing(true);

    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result.split(",")[1];
        const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are a medical prescription reader. Extract all medicines from this prescription image.
Return ONLY a valid JSON array. No explanation, no markdown, just the JSON array.
Format:
[
  {
    "name": "Medicine name",
    "dosage": "500mg",
    "frequency": "Twice daily",
    "times": ["8:00 AM", "8:00 PM"],
    "withFood": true,
    "duration": "7 days"
  }
]
If you cannot read the prescription clearly, return an empty array: []`,
                    },
                    {
                      inline_data: { mime_type: image.type, data: base64 },
                    },
                  ],
                },
              ],
              generationConfig: { maxOutputTokens: 1000, temperature: 0.1 },
            }),
          },
        );

        const data = await res.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
        setRawText(text);

        try {
          const clean = text.replace(/```json|```/g, "").trim();
          const parsed = JSON.parse(clean);
          setMedicines(parsed.length > 0 ? parsed : getDefaultMedicines());
        } catch {
          setMedicines(getDefaultMedicines());
          toast.error(
            "Could not auto-read prescription. Please fill in manually.",
          );
        }

        setStep("review");
        setAnalyzing(false);
      };
      reader.readAsDataURL(image);
    } catch (err) {
      toast.error("AI analysis failed");
      setAnalyzing(false);
      setMedicines(getDefaultMedicines());
      setStep("review");
    }
  };

  const getDefaultMedicines = () => [
    {
      name: "",
      dosage: "",
      frequency: "Twice daily",
      times: ["8:00 AM", "8:00 PM"],
      withFood: false,
      duration: "",
    },
  ];

  const addMedicine = () => {
    setMedicines((prev) => [
      ...prev,
      {
        name: "",
        dosage: "",
        frequency: "Once daily",
        times: ["8:00 AM"],
        withFood: false,
        duration: "",
      },
    ]);
  };

  const removeMedicine = (i) => {
    setMedicines((prev) => prev.filter((_, idx) => idx !== i));
  };

  const updateMedicine = (i, field, value) => {
    setMedicines((prev) =>
      prev.map((m, idx) => (idx === i ? { ...m, [field]: value } : m)),
    );
  };

  const savePrescription = async () => {
    const valid = medicines.filter((m) => m.name.trim());
    if (valid.length === 0) {
      toast.error("Please add at least one medicine");
      return;
    }

    setUploading(true);
    try {
      await api.post("/user/prescription", {
        medicines: valid,
        rawText,
        imageUrl: preview,
        notes: "",
      });
      toast.success("Prescription saved successfully");
      const res = await api.get("/user/prescriptions");
      setPrescriptions(res.data.prescriptions);
      setStep("upload");
      setImage(null);
      setPreview(null);
      setMedicines([]);
      navigate("/medicines");
    } catch (err) {
      toast.error("Failed to save prescription");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-cloud flex">
      <UserSidebar
        active={`/user/${user?._id}/dashboard`}
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
            <h1 className="text-lg font-bold text-midnight">Prescriptions</h1>
            <p className="text-xs text-slate">
              Upload and manage your prescriptions
            </p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Upload / Review panel */}
            <div className="space-y-4">
              <AnimatePresence mode="wait">
                {step === "upload" && (
                  <motion.div
                    key="upload"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragOver(true);
                      }}
                      onDragLeave={() => setDragOver(false)}
                      onDrop={handleDrop}
                      onClick={() => fileRef.current?.click()}
                      className="card border-2 border-dashed cursor-pointer transition-all text-center py-14"
                      style={{
                        borderColor: dragOver ? "#0C447C" : "#B5D4F4",
                        background: dragOver ? "#E6F1FB" : "white",
                      }}
                    >
                      <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFile(e.target.files[0])}
                      />
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                        style={{ background: "#E6F1FB" }}
                      >
                        <Upload size={24} style={{ color: "#0C447C" }} />
                      </div>
                      <p className="text-base font-semibold text-midnight mb-1">
                        Upload prescription
                      </p>
                      <p className="text-sm text-slate mb-4">
                        Drag and drop or click to browse
                      </p>
                      <p className="text-xs text-slate">JPG, PNG up to 5MB</p>
                    </div>

                    <div
                      className="card mt-4"
                      style={{ borderLeft: "4px solid #1D9E75" }}
                    >
                      <div className="flex items-start gap-3">
                        <Brain
                          size={18}
                          style={{ color: "#1D9E75" }}
                          className="flex-shrink-0 mt-0.5"
                        />
                        <div>
                          <p className="text-sm font-semibold text-midnight mb-1">
                            AI prescription reader
                          </p>
                          <p className="text-xs text-slate leading-relaxed">
                            Upload a clear photo of your prescription. Medivox
                            AI will automatically extract all medicines,
                            dosages, and schedules. You can review and edit
                            before saving.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === "preview" && (
                  <motion.div
                    key="preview"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="card space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-midnight">
                        Prescription preview
                      </h2>
                      <button
                        onClick={() => {
                          setStep("upload");
                          setImage(null);
                          setPreview(null);
                        }}
                        className="p-2 rounded-xl hover:bg-cloud transition-colors"
                      >
                        <X size={16} className="text-slate" />
                      </button>
                    </div>

                    <img
                      src={preview}
                      alt="Prescription"
                      className="w-full rounded-xl object-contain max-h-72 border border-sky-light"
                    />

                    <button
                      onClick={analyzeWithAI}
                      disabled={analyzing}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white
                                 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                      style={{ background: "#0C447C" }}
                    >
                      {analyzing ? (
                        <>
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
                          AI is reading your prescription...
                        </>
                      ) : (
                        <>
                          <Brain size={16} /> Analyze with AI
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setMedicines(getDefaultMedicines());
                        setStep("review");
                      }}
                      className="w-full py-2.5 rounded-xl text-sm font-medium transition-all"
                      style={{
                        background: "#F8FAFC",
                        color: "#888780",
                        border: "1px solid #E6F1FB",
                      }}
                    >
                      Enter medicines manually
                    </button>
                  </motion.div>
                )}

                {step === "review" && (
                  <motion.div
                    key="review"
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <h2 className="text-base font-bold text-midnight">
                        Review medicines
                      </h2>
                      <button
                        onClick={() => setStep("preview")}
                        className="text-xs font-medium px-3 py-1.5 rounded-lg transition-all"
                        style={{ background: "#E6F1FB", color: "#0C447C" }}
                      >
                        Back
                      </button>
                    </div>

                    {medicines.map((med, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-navy uppercase tracking-wide">
                            Medicine {i + 1}
                          </span>
                          <button
                            onClick={() => removeMedicine(i)}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={13} className="text-red-400" />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-midnight mb-1">
                              Name
                            </label>
                            <input
                              value={med.name}
                              onChange={(e) =>
                                updateMedicine(i, "name", e.target.value)
                              }
                              placeholder="e.g. Paracetamol"
                              className="input-field text-sm"
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-midnight mb-1">
                              Dosage
                            </label>
                            <input
                              value={med.dosage}
                              onChange={(e) =>
                                updateMedicine(i, "dosage", e.target.value)
                              }
                              placeholder="e.g. 500mg"
                              className="input-field text-sm"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-medium text-midnight mb-1">
                              Frequency
                            </label>
                            <select
                              value={med.frequency}
                              onChange={(e) =>
                                updateMedicine(i, "frequency", e.target.value)
                              }
                              className="input-field text-sm"
                            >
                              {FREQ_OPTIONS.map((f) => (
                                <option key={f} value={f}>
                                  {f}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="block text-xs font-medium text-midnight mb-1">
                              Duration
                            </label>
                            <input
                              value={med.duration}
                              onChange={(e) =>
                                updateMedicine(i, "duration", e.target.value)
                              }
                              placeholder="e.g. 7 days"
                              className="input-field text-sm"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-midnight mb-1">
                            Times
                          </label>
                          <div className="flex flex-wrap gap-2">
                            {TIME_OPTIONS.map((t) => (
                              <button
                                key={t}
                                type="button"
                                onClick={() => {
                                  const times = med.times.includes(t)
                                    ? med.times.filter((x) => x !== t)
                                    : [...med.times, t];
                                  updateMedicine(i, "times", times);
                                }}
                                className="text-xs px-2.5 py-1 rounded-lg transition-all"
                                style={{
                                  background: med.times.includes(t)
                                    ? "#0C447C"
                                    : "#F8FAFC",
                                  color: med.times.includes(t)
                                    ? "white"
                                    : "#888780",
                                  border: `1px solid ${med.times.includes(t) ? "#0C447C" : "#E6F1FB"}`,
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={med.withFood}
                            onChange={(e) =>
                              updateMedicine(i, "withFood", e.target.checked)
                            }
                            className="w-4 h-4 rounded accent-navy"
                          />
                          <span className="text-xs text-slate">
                            Take with food
                          </span>
                        </label>
                      </motion.div>
                    ))}

                    <button
                      onClick={addMedicine}
                      className="w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                      style={{
                        background: "#E6F1FB",
                        color: "#0C447C",
                        border: "1px dashed #B5D4F4",
                      }}
                    >
                      <Plus size={15} /> Add medicine
                    </button>

                    <button
                      onClick={savePrescription}
                      disabled={uploading}
                      className="w-full py-3 rounded-xl text-sm font-semibold text-white
                                 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-60"
                      style={{ background: "#1D9E75" }}
                    >
                      {uploading ? (
                        <>
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
                          Saving...
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} /> Save and start schedule
                        </>
                      )}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Past prescriptions */}
            <div>
              <h2 className="text-base font-bold text-midnight mb-4">
                Past prescriptions
              </h2>
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-7 h-7 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
                </div>
              ) : prescriptions.length === 0 ? (
                <div className="card text-center py-12">
                  <FileText
                    size={32}
                    className="mx-auto mb-2 opacity-20 text-navy"
                  />
                  <p className="text-sm text-slate">No prescriptions yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {prescriptions.map((p, i) => (
                    <motion.div
                      key={p._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="card hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: "#E1F5EE" }}
                          >
                            <FileText size={16} style={{ color: "#1D9E75" }} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-midnight">
                              {p.medicines?.length} medicine
                              {p.medicines?.length !== 1 ? "s" : ""}
                            </p>
                            <p className="text-xs text-slate">
                              {new Date(p.createdAt).toLocaleDateString(
                                "en-PK",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </p>
                          </div>
                        </div>
                        <span
                          className={p.isActive ? "badge-teal" : "badge-gray"}
                        >
                          {p.isActive ? "Active" : "Completed"}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {p.medicines?.slice(0, 4).map((m, j) => (
                          <span key={j} className="badge-blue">
                            {m.name}
                          </span>
                        ))}
                        {p.medicines?.length > 4 && (
                          <span className="badge-gray">
                            +{p.medicines.length - 4} more
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
