import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Phone, MapPin, Menu, Save, Plus, X } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import UserSidebar from "../../components/shared/UserSidebar";
import api from "../../lib/axios";
import toast from "react-hot-toast";
import { CITIES } from "../../constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function UserProfile() {
  const { user, setAuth } = useAuthStore();
  const token = useAuthStore((s) => s.token);
  const id = user?._id;

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newHistory, setNewHistory] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    city: "",
    medicalHistory: [],
  });

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        phone: user.phone || "",
        city: user.city || "",
        medicalHistory: user.medicalHistory || [],
      });
    }
  }, [user]);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const addHistory = () => {
    if (!newHistory.trim()) return;
    setForm((p) => ({
      ...p,
      medicalHistory: [...p.medicalHistory, newHistory.trim()],
    }));
    setNewHistory("");
  };

  const removeHistory = (i) => {
    setForm((p) => ({
      ...p,
      medicalHistory: p.medicalHistory.filter((_, idx) => idx !== i),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put("/user/profile", form);
      setAuth(res.data.user, token);
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      phone: user.phone || "",
      city: user.city || "",
      medicalHistory: user.medicalHistory || [],
    });
    setEditing(false);
  };

  const inputClass = `input-field text-sm ${!editing ? "bg-cloud cursor-not-allowed opacity-70" : ""}`;

  return (
    <div className="min-h-screen bg-cloud flex">
      <UserSidebar
        active={`/user/${id}/profile`}
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
          <div className="flex-1">
            <h1 className="text-lg font-bold text-midnight">My profile</h1>
            <p className="text-xs text-slate">
              Manage your personal information
            </p>
          </div>

          {editing ? (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all"
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
              <User size={16} /> Edit profile
            </button>
          )}
        </header>

        <main className="flex-1 p-6">
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="max-w-2xl mx-auto space-y-5"
          >
            {/* Avatar */}
            <motion.div
              variants={fadeUp}
              className="card flex items-center gap-5"
            >
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center
                              text-3xl font-bold text-white flex-shrink-0"
                style={{ background: "#0C447C" }}
              >
                {user?.name?.charAt(0)}
              </div>
              <div>
                <p className="text-lg font-bold text-midnight">{user?.name}</p>
                <p className="text-sm text-slate">{user?.email}</p>
                <span className="badge-blue mt-1 inline-block">Patient</span>
              </div>
            </motion.div>

            {/* Personal info */}
            <motion.div variants={fadeUp} className="card space-y-4">
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
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="Your full name"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-midnight mb-1.5">
                  Email address
                </label>
                <input
                  value={user?.email}
                  disabled
                  className="input-field text-sm bg-cloud cursor-not-allowed opacity-70"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-midnight mb-1.5">
                  Phone number
                </label>
                <div className="relative">
                  <Phone
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                  />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    disabled={!editing}
                    placeholder="+92 300 1234567"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-midnight mb-1.5">
                  City
                </label>
                <div className="relative">
                  <MapPin
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                  />
                  <select
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    disabled={!editing}
                    className={`${inputClass} pl-10`}
                  >
                    <option value="">Select your city</option>
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>

            {/* Medical history */}
            <motion.div variants={fadeUp} className="card space-y-4">
              <div>
                <h2 className="text-base font-bold text-midnight">
                  Medical history
                </h2>
                <p className="text-xs text-slate mt-0.5">
                  Add conditions, allergies, or past surgeries for better AI
                  assistance
                </p>
              </div>

              {form.medicalHistory.length === 0 ? (
                <div
                  className="text-center py-6 border-2 border-dashed rounded-xl"
                  style={{ borderColor: "#B5D4F4" }}
                >
                  <p className="text-xs text-slate">
                    No medical history added yet
                  </p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {form.medicalHistory.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium"
                      style={{ background: "#E6F1FB", color: "#0C447C" }}
                    >
                      {item}
                      {editing && (
                        <button
                          onClick={() => removeHistory(i)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {editing && (
                <div className="flex gap-2">
                  <input
                    value={newHistory}
                    onChange={(e) => setNewHistory(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addHistory()}
                    placeholder="e.g. Diabetes, Hypertension, Penicillin allergy..."
                    className="input-field text-sm flex-1"
                  />
                  <button
                    onClick={addHistory}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold
                               text-white flex-shrink-0 transition-all"
                    style={{ background: "#0C447C" }}
                  >
                    <Plus size={15} /> Add
                  </button>
                </div>
              )}
            </motion.div>

            {/* Account info */}
            <motion.div variants={fadeUp} className="card">
              <h2 className="text-base font-bold text-midnight mb-4">
                Account information
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-slate">Member since</p>
                  <p className="text-sm font-medium text-midnight mt-0.5">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-PK", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate">Account type</p>
                  <p className="text-sm font-medium text-midnight mt-0.5 capitalize">
                    {user?.role || "Patient"}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </main>
      </div>
    </div>
  );
}
