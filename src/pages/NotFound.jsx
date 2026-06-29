import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";
import Logo from "../components/shared/Logo";
import doctorLost from "../assets/doctorlost.png";

export default function NotFound() {
  const { user, token } = useAuthStore();

  const getDashboardLink = () => {
    if (!token || !user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "doctor") return `/doctor/${user._id}/dashboard`;
    return `/user/${user._id}/dashboard`;
  };

  return (
    <div className="min-h-screen bg-cloud flex flex-col">
      {/* Simple navbar */}
      {/* <nav className="bg-white border-b border-sky-light px-6 py-4">
        <Logo size="md" />
      </nav> */}

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-md"
        >
          {/* Doctor illustration */}
          <motion.img
            src={doctorLost}
            alt="Lost doctor"
            className="w-52 h-52 object-contain mx-auto mb-4"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-8xl font-extrabold mb-4"
            style={{ color: "#0C447C", letterSpacing: "-4px" }}
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold text-midnight mb-3"
          >
            Page not found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate text-sm leading-relaxed mb-8"
          >
            The page you are looking for does not exist or has been moved. Let's
            get you back to health.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              to="/"
              className="px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all active:scale-95"
              style={{ background: "#0C447C" }}
            >
              Go to homepage
            </Link>
            <Link
              to={getDashboardLink()}
              className="px-6 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95 border"
              style={{
                borderColor: "#E6F1FB",
                color: "#0C447C",
                background: "white",
              }}
            >
              Go to dashboard
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 pt-6 border-t border-sky-light"
          >
            <p className="text-xs text-slate">
              Need help?{" "}
              <Link
                to="/"
                className="font-medium hover:underline"
                style={{ color: "#185FA5" }}
              >
                Contact Medivox support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center">
        <p className="text-xs text-slate">2026 Medivox · AI Health Platform</p>
      </div>
    </div>
  );
}
