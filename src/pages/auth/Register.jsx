import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Stethoscope,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import { SPECIALIZATIONS, CITIES } from "../../constants";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const ROLES = [
  {
    id: "user",
    label: "Patient",
    desc: "Find doctors, get AI consultation, manage prescriptions",
    color: "#0C447C",
    bg: "#E6F1FB",
  },
  {
    id: "doctor",
    label: "Doctor",
    desc: "Register your practice and connect with patients",
    color: "#1D9E75",
    bg: "#E1F5EE",
  },
];

export default function Register() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setAuth } = useAuthStore();

  const defaultRole = searchParams.get("role") === "doctor" ? "doctor" : "user";

  const [step, setStep] = useState(1);
  const [role, setRole] = useState(defaultRole);
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    specialization: "",
    experience: "",
    fee: "",
    consultancyPlace: "",
    availableDays: [],
    startTime: "",
    endTime: "",
    profilePicture: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const validateStep1 = () => {
    if (!form.name || !form.email || !form.password || !form.confirmPassword)
      return "Please fill in all fields.";
    if (form.password.length < 6)
      return "Password must be at least 6 characters.";
    if (form.password !== form.confirmPassword)
      return "Passwords do not match.";
    return null;
  };

  const validateStep2 = () => {
    if (!form.phone || !form.city) return "Please fill in all fields.";
    if (role === "doctor") {
      if (
        !form.specialization ||
        !form.experience ||
        !form.fee ||
        !form.consultancyPlace
      )
        return "Please fill in all doctor fields.";
    }
    return null;
  };

  const nextStep = () => {
    const err = validateStep1();
    if (err) {
      setError(err);
      return;
    }
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validateStep2();
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    try {
      const payload = { ...form, role };
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      setAuth(data.user, data.token);
      if (data.user.role === "doctor")
        navigate(`/doctor/${data.user._id}/dashboard`);
      else navigate(`/user/${data.user._id}/dashboard`);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          background:
            "linear-gradient(135deg, #042C53 0%, #0C447C 60%, #185FA5 100%)",
        }}
      >
        <Logo size="lg" />

        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-extrabold text-white mb-3 leading-tight">
              Join Pakistan's smartest health platform
            </h2>
            <p className="text-white/60 text-sm leading-relaxed">
              Whether you are a patient looking for care or a doctor wanting to
              grow your practice — Medivox is built for you.
            </p>
          </div>

          <div className="space-y-3">
            {[
              "AI-powered symptom analysis",
              "Verified doctors across 40+ specialties",
              "Smart medicine reminder system",
              "Secure health record storage",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{ background: "#1D9E75" }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 10" fill="none">
                    <path
                      d="M1 5l3.5 3.5L11 1"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex -space-x-3 mt-4">
            {[
              "photo-1559839734-2b71ea197ec2",
              "photo-1612349317150-e413f6a5b16d",
              "photo-1594824476967-48c8b964273f",
            ].map((id, i) => (
              <img
                key={i}
                src={`https://images.unsplash.com/${id}?w=80&q=80`}
                className="w-9 h-9 rounded-full border-2 object-cover"
                style={{ borderColor: "#0C447C" }}
              />
            ))}
            <div
              className="w-9 h-9 rounded-full border-2 flex items-center justify-center text-xs font-bold"
              style={{
                borderColor: "#0C447C",
                background: "#185FA5",
                color: "white",
              }}
            >
              +8K
            </div>
          </div>
        </div>

        <p className="text-white/40 text-xs">
          2025 Medivox · AI Health Platform
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-6 bg-cloud min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-3 mb-8">
            {[1, 2].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                  style={{
                    background: step >= s ? "#0C447C" : "#E6F1FB",
                    color: step >= s ? "white" : "#888780",
                  }}
                >
                  {s}
                </div>
                {s < 2 && (
                  <div
                    className="w-12 h-px transition-all"
                    style={{ background: step > 1 ? "#0C447C" : "#E6F1FB" }}
                  />
                )}
              </div>
            ))}
            <span className="text-xs text-slate ml-2">Step {step} of 2</span>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-extrabold text-midnight mb-1">
              {step === 1 ? "Create account" : "Your details"}
            </h1>
            <p className="text-slate text-sm">
              {step === 1
                ? "Set up your Medivox account"
                : role === "doctor"
                  ? "Tell us about your practice"
                  : "A few more details to get started"}
            </p>
          </div>

          {/* Role selector — only on step 1 */}
          {step === 1 && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {ROLES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className="text-left p-4 rounded-xl border transition-all"
                  style={{
                    borderColor: role === r.id ? r.color : "#E6F1FB",
                    borderWidth: role === r.id ? "2px" : "1px",
                    backgroundColor: role === r.id ? r.bg : "white",
                  }}
                >
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: role === r.id ? r.color : "#042C53" }}
                  >
                    {r.label}
                  </p>
                  <p
                    className="text-xs leading-relaxed"
                    style={{ color: "#888780" }}
                  >
                    {r.desc}
                  </p>
                </button>
              ))}
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-red-50 border border-red-200
                         text-red-700 rounded-xl px-4 py-3 mb-5 text-sm"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-midnight mb-1.5">
                    Full name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder={
                        role === "doctor" ? "Dr. Ahmed Khan" : "Your full name"
                      }
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight mb-1.5">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <input
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight mb-1.5">
                    Password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <input
                      name="password"
                      type={showPass ? "text" : "password"}
                      value={form.password}
                      onChange={handleChange}
                      placeholder="At least 6 characters"
                      className="input-field pl-11 pr-11"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate hover:text-navy transition-colors"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight mb-1.5">
                    Confirm password
                  </label>
                  <div className="relative">
                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <input
                      name="confirmPassword"
                      type="password"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-3 rounded-lg font-semibold text-sm text-white
                             flex items-center justify-center gap-2 transition-all active:scale-95"
                  style={{ backgroundColor: "#0C447C" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#185FA5")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "#0C447C")
                  }
                >
                  Continue <ChevronRight size={16} />
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="step2"
                onSubmit={handleSubmit}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-midnight mb-1.5">
                    Phone number
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      placeholder="+92 300 1234567"
                      className="input-field pl-11"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-midnight mb-1.5">
                    City
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                    />
                    <select
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="input-field pl-11 appearance-none"
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

                {role === "doctor" && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-midnight mb-1.5">
                        Profile picture
                      </label>
                      <div className="flex items-center gap-4">
                        <div
                          className="w-14 h-14 rounded-2xl flex-shrink-0 overflow-hidden border border-sky-light"
                          style={{ background: "#E6F1FB" }}
                        >
                          {form.profilePicture ? (
                            <img
                              src={form.profilePicture}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate text-xs">
                              Photo
                            </div>
                          )}
                        </div>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          id="profile-pic-upload"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setForm((f) => ({
                                ...f,
                                profilePicture: reader.result,
                              }));
                            reader.readAsDataURL(file);
                          }}
                        />
                        <label
                          htmlFor="profile-pic-upload"
                          className="text-xs font-medium px-4 py-2 rounded-lg cursor-pointer transition-all"
                          style={{ background: "#E6F1FB", color: "#0C447C" }}
                        >
                          Upload photo
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight mb-1.5">
                        Specialization
                      </label>
                      <div className="relative">
                        <Stethoscope
                          size={16}
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
                        />
                        <select
                          name="specialization"
                          value={form.specialization}
                          onChange={handleChange}
                          className="input-field pl-11 appearance-none"
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
                        <label className="block text-sm font-medium text-midnight mb-1.5">
                          Experience (years)
                        </label>
                        <input
                          name="experience"
                          type="number"
                          min="0"
                          max="60"
                          value={form.experience}
                          onChange={handleChange}
                          placeholder="e.g. 8"
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-midnight mb-1.5">
                          Fee (Rs.)
                        </label>
                        <input
                          name="fee"
                          type="number"
                          min="0"
                          value={form.fee}
                          onChange={handleChange}
                          placeholder="e.g. 2000"
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight mb-1.5">
                        Consultancy place
                      </label>
                      <input
                        name="consultancyPlace"
                        value={form.consultancyPlace}
                        onChange={handleChange}
                        placeholder="e.g. Shaukat Khanum Hospital, Lahore"
                        className="input-field"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-midnight mb-1.5">
                          Start time
                        </label>
                        <input
                          name="startTime"
                          type="time"
                          value={form.startTime}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-midnight mb-1.5">
                          End time
                        </label>
                        <input
                          name="endTime"
                          type="time"
                          value={form.endTime}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-midnight mb-2">
                        Available days
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                          (day) => (
                            <button
                              key={day}
                              type="button"
                              onClick={() => {
                                const days = form.availableDays || [];
                                const updated = days.includes(day)
                                  ? days.filter((d) => d !== day)
                                  : [...days, day];
                                setForm((f) => ({
                                  ...f,
                                  availableDays: updated,
                                }));
                              }}
                              className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                              style={{
                                background: (form.availableDays || []).includes(
                                  day,
                                )
                                  ? "#0C447C"
                                  : "#F8FAFC",
                                color: (form.availableDays || []).includes(day)
                                  ? "white"
                                  : "#888780",
                                border: `1px solid ${(form.availableDays || []).includes(day) ? "#0C447C" : "#E6F1FB"}`,
                              }}
                            >
                              {day}
                            </button>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="bg-sky-light border border-sky rounded-xl p-4">
                      <p className="text-xs font-semibold text-navy mb-1">
                        Document verification
                      </p>
                      <p className="text-xs text-slate leading-relaxed">
                        After registration you will be asked to upload your
                        medical license and credentials from your profile page.
                      </p>
                    </div>
                  </>
                )}

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setError("");
                    }}
                    className="flex items-center gap-1 px-5 py-3 rounded-lg border text-sm font-medium transition-all"
                    style={{ borderColor: "#E6F1FB", color: "#888780" }}
                  >
                    <ChevronLeft size={15} /> Back
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 py-3 rounded-lg font-semibold text-sm text-white
                               flex items-center justify-center gap-2 transition-all
                               active:scale-95 disabled:opacity-60"
                    style={{
                      backgroundColor:
                        role === "doctor" ? "#1D9E75" : "#0C447C",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
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
                        Creating account...
                      </span>
                    ) : role === "doctor" ? (
                      "Register as Doctor"
                    ) : (
                      "Create Account"
                    )}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-6 pt-6 border-t border-sky-light text-center">
            <p className="text-sm text-slate">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold hover:underline"
                style={{ color: "#0C447C" }}
              >
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
