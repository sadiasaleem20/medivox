import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setAuth(data.user, data.token);
      if (data.user.role === "admin") navigate("/admin");
      if (data.user.role === "doctor")
        navigate(`/doctor/${data.user._id}/dashboard`);
      if (data.user.role === "user")
        navigate(`/user/${data.user._id}/dashboard`);
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

        <div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white/10 backdrop-blur border border-white/20 rounded-2xl p-6 mb-6"
          >
            <div className="flex items-center gap-3 mb-4">
              <img
                src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=80&q=80"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-white font-semibold text-sm">
                  Dr. Ayesha Raza
                </p>
                <p className="text-white/60 text-xs">
                  Pediatrician · Islamabad
                </p>
              </div>
              <span
                className="ml-auto text-xs font-medium px-2.5 py-1 rounded-full"
                style={{ background: "#E1F5EE", color: "#085041" }}
              >
                Verified
              </span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              "Medivox made it easy for my patients to reach me. The
              verification process was smooth and the platform is genuinely
              useful."
            </p>
            <div className="flex gap-1 mt-3">
              {[1, 2, 3, 4, 5].map((s) => (
                <svg
                  key={s}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="#FBBF24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-4">
            {[
              { value: "12K+", label: "Patients" },
              { value: "850+", label: "Doctors" },
              { value: "98%", label: "Satisfaction" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="bg-white/10 rounded-xl p-4 text-center border border-white/10"
              >
                <p className="text-white font-extrabold text-xl">{value}</p>
                <p className="text-white/60 text-xs mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-white/40 text-xs">
          2026 Medivox · AI Health Platform
        </p>
      </div>

      {/* Right panel */}
      <div className="flex items-center justify-center p-6 bg-cloud">
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8">
            <Logo size="md" />
          </div>

          <motion.div variants={fadeUp} className="mb-8">
            <h1 className="text-3xl font-extrabold text-midnight mb-2">
              Welcome back
            </h1>
            <p className="text-slate text-sm">
              Sign in to your Medivox account
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5 bg-red-50 border border-red-200 text-red-700
                         rounded-xl px-4 py-3 mb-6 text-sm"
            >
              <AlertCircle size={16} className="flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <motion.form
            variants={stagger}
            initial="hidden"
            animate="show"
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <motion.div variants={fadeUp}>
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
            </motion.div>

            <motion.div variants={fadeUp}>
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
                  placeholder="Enter your password"
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
            </motion.div>

            <motion.div
              variants={fadeUp}
              className="flex items-center justify-between"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-sky accent-navy"
                />
                <span className="text-sm text-slate">Remember me</span>
              </label>
              <a
                href="#"
                className="text-sm font-medium hover:underline"
                style={{ color: "#185FA5" }}
              >
                Forgot password?
              </a>
            </motion.div>

            <motion.div variants={fadeUp}>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-lg font-semibold text-sm text-white
                           transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#0C447C" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#185FA5")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#0C447C")
                }
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
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
                    Signing in...
                  </span>
                ) : (
                  "Sign in"
                )}
              </button>
            </motion.div>
          </motion.form>

          <motion.div
            variants={fadeUp}
            className="mt-6 pt-6 border-t border-sky-light text-center"
          >
            <p className="text-sm text-slate">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold hover:underline"
                style={{ color: "#0C447C" }}
              >
                Create one free
              </Link>
            </p>
          </motion.div>

          <motion.div variants={fadeUp} className="mt-4 text-center">
            <p className="text-xs text-slate">
              Are you a doctor?{" "}
              <Link
                to="/register?role=doctor"
                className="font-medium hover:underline"
                style={{ color: "#1D9E75" }}
              >
                Register your practice
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
