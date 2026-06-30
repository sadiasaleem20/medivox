import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mic,
  Brain,
  UserCheck,
  Bell,
  Shield,
  Star,
  ArrowRight,
  ChevronDown,
  MapPin,
  Clock,
  DollarSign,
  Activity,
  Users,
  Award,
  HeartPulse,
} from "lucide-react";
import Logo from "../components/shared/Logo";
import { useAuthStore } from "../store/authStore";
import { SPECIALIZATIONS } from "../constants";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const DOCTORS = [
  {
    name: "Dr. Sara Malik",
    field: "Cardiologist",
    exp: "12 years",
    city: "Lahore",
    fee: "Rs. 2,000",
    rating: 4.9,
    reviews: 214,
    img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
    avail: "Available today",
  },
  {
    name: "Dr. Ahmed Khan",
    field: "Neurologist",
    exp: "9 years",
    city: "Karachi",
    fee: "Rs. 2,500",
    rating: 4.8,
    reviews: 178,
    img: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
    avail: "Available tomorrow",
  },
  {
    name: "Dr. Ayesha Raza",
    field: "Pediatrician",
    exp: "7 years",
    city: "Islamabad",
    fee: "Rs. 1,500",
    rating: 4.9,
    reviews: 302,
    img: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&q=80",
    avail: "Available today",
  },
];

const FEATURES = [
  {
    icon: Mic,
    color: "#E6F1FB",
    icolor: "#185FA5",
    title: "Voice-first AI consultation",
    desc: "Describe your symptoms naturally in English or Urdu. Our AI listens, understands, and builds a complete triage report instantly.",
  },
  {
    icon: Brain,
    color: "#E1F5EE",
    icolor: "#1D9E75",
    title: "Intelligent doctor matching",
    desc: "AI extracts your condition and matches you with verified specialists in your city — filtered by specialty, availability, and fee.",
  },
  {
    icon: UserCheck,
    color: "#E6F1FB",
    icolor: "#185FA5",
    title: "Verified doctors only",
    desc: "Every doctor on Medivox is manually verified by our admin team. Real credentials, real licenses, real care.",
  },
  {
    icon: Bell,
    color: "#E1F5EE",
    icolor: "#1D9E75",
    title: "Medicine reminder system",
    desc: "Upload your prescription. AI reads it, extracts medicines and schedules, and reminds you at the exact right time every day.",
  },
  {
    icon: Shield,
    color: "#E6F1FB",
    icolor: "#185FA5",
    title: "Your health history, safe",
    desc: "All your reports, prescriptions, and consultations stored securely in one place. Your personal health record, always accessible.",
  },
  {
    icon: HeartPulse,
    color: "#E1F5EE",
    icolor: "#1D9E75",
    title: "AI caretaker mode",
    desc: "Once your prescription is uploaded, Medivox becomes your daily health companion — tracking medicines, meals, and recovery.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Describe your symptoms",
    desc: "Talk or type. Tell the AI how you feel in your own words.",
  },
  {
    num: "02",
    title: "AI analyzes and matches",
    desc: "Medivox understands your condition and finds the right specialists near you.",
  },
  {
    num: "03",
    title: "Book a verified doctor",
    desc: "Browse matched doctors, see their credentials, fee, and availability. Book instantly.",
  },
  {
    num: "04",
    title: "Upload prescription",
    desc: "After your visit, upload your prescription. AI starts your medicine schedule automatically.",
  },
];

const STATS = [
  { value: "12,000+", label: "Patients helped", icon: Users },
  { value: "850+", label: "Verified doctors", icon: UserCheck },
  { value: "40+", label: "Specializations", icon: Award },
  { value: "98%", label: "Satisfaction rate", icon: Star },
];

function PulseWave() {
  return (
    <div className="flex items-center gap-1 h-10">
      {[0.4, 0.7, 1, 1.4, 1, 0.7, 0.4, 0.6, 1.2, 0.8, 0.5, 1.1, 0.9, 0.4].map(
        (h, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-navy-light"
            style={{ height: `${h * 28}px` }}
            animate={{ scaleY: [1, h * 1.5, 1] }}
            transition={{
              duration: 1.4,
              repeat: Infinity,
              delay: i * 0.08,
              ease: "easeInOut",
            }}
          />
        ),
      )}
    </div>
  );
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [specOpen, setSpecOpen] = useState(false);
  const { user, token } = useAuthStore();

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "doctor") return `/doctor/${user._id}/dashboard`;
    return `/user/${user._id}/dashboard`;
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur border-b border-sky-light shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="md" />

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-midnight/70">
          <a href="#features" className="hover:text-navy transition-colors">
            Features
          </a>
          <a href="#how" className="hover:text-navy transition-colors">
            How it works
          </a>

          <div
            className="relative"
            onMouseEnter={() => setSpecOpen(true)}
            onMouseLeave={() => setSpecOpen(false)}
          >
            <button className="flex items-center gap-1 hover:text-navy transition-colors">
              Doctors
              <ChevronDown
                size={14}
                className={`transition-transform ${specOpen ? "rotate-180" : ""}`}
              />
            </button>

            {specOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-56 bg-white
                           rounded-2xl shadow-xl border border-sky-light p-2 z-50"
              >
                <div className="max-h-72 overflow-y-auto">
                  {SPECIALIZATIONS.map((spec) => (
                    <Link
                      key={spec}
                      to={
                        token && user?.role === "user"
                          ? `/user/${user._id}/doctors?specialization=${encodeURIComponent(spec)}`
                          : "/register"
                      }
                      className="block px-3 py-2 rounded-xl text-sm text-midnight
                                 hover:bg-sky-light transition-colors"
                      onClick={() => setSpecOpen(false)}
                    >
                      {spec}
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {token && user ? (
            <Link
              to={getDashboardLink()}
              className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all"
              style={{ background: "#0C447C" }}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-navy hover:text-navy-light transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                className="text-sm font-semibold px-5 py-2.5 rounded-lg text-white transition-all"
                style={{ background: "#0C447C" }}
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default function Landing() {
  const [verifiedDoctors, setVerifiedDoctors] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/doctor`)
      .then((res) => res.json())
      .then((data) => setVerifiedDoctors(data.doctors?.slice(0, 3) || []))
      .catch(() => setVerifiedDoctors([]));
  }, []);
  return (
    <div className="min-h-screen bg-cloud overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="relative min-h-screen flex items-center pt-16">
        {/* <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, #E6F1FB 0%, transparent 70%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
            style={{
              background:
                "radial-gradient(circle, #E1F5EE 0%, transparent 70%)",
            }}
          />
        </div> */}

        <div className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-16 items-center">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.div
              variants={fadeUp}
              className="inline-flex items-center gap-2 bg-sky-light text-navy text-xs font-medium px-4 py-1.5 rounded-full mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse-slow" />
              AI-powered health platform
            </motion.div>

            <motion.h1
              variants={fadeUp}
              className="text-5xl lg:text-6xl font-extrabold text-midnight leading-tight mb-6"
            >
              Your health,
              <br />
              <span className="text-navy">your voice,</span>
              <br />
              <span className="text-teal">your doctor.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg text-slate leading-relaxed mb-8 max-w-lg"
            >
              Describe your symptoms in plain words. Medivox AI understands,
              triages, and connects you with verified specialists near you —
              then becomes your daily medicine companion.
            </motion.p>

            <motion.div
              variants={fadeUp}
              className="flex flex-wrap gap-4 mb-10"
            >
              <Link
                to="/register"
                className="btn-primary flex items-center gap-2 text-base px-8 py-3"
              >
                Start for free <ArrowRight size={16} />
              </Link>
              <Link
                to="/register?role=doctor"
                className="btn-outline flex items-center gap-2 text-base px-8 py-3"
              >
                Join as doctor
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[
                  "photo-1559839734-2b71ea197ec2",
                  "photo-1612349317150-e413f6a5b16d",
                  "photo-1594824476967-48c8b964273f",
                ].map((id, i) => (
                  <img
                    key={i}
                    src={`https://images.unsplash.com/${id}?w=80&q=80`}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={13}
                      className="fill-amber-400 text-amber-400"
                    />
                  ))}
                  <span className="text-sm font-semibold text-midnight ml-1">
                    4.9
                  </span>
                </div>
                <p className="text-xs text-slate">
                  Trusted by 12,000+ patients
                </p>
              </div>
            </motion.div>
          </motion.div>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="relative"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-sky-light max-w-sm mx-auto"
            >
              <div className="flex items-center gap-3 mb-5">
                <Logo variant="icon" size="sm" />
                <div>
                  <p className="text-sm font-semibold text-midnight">
                    Medivox AI
                  </p>
                  <p className="text-xs text-slate">Health Assistant</p>
                </div>
                <div className="ml-auto flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-teal animate-pulse-slow" />
                  <span className="text-xs text-teal font-medium">Online</span>
                </div>
              </div>

              <div className="bg-sky-light rounded-xl p-4 mb-4">
                <p className="text-sm text-midnight/80 leading-relaxed">
                  "I have had a headache for 3 days, mostly on the left side,
                  and I feel nauseous in the morning..."
                </p>
              </div>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-navy flex items-center justify-center flex-shrink-0">
                  <Brain size={14} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-slate mb-1">
                    Analyzing symptoms...
                  </p>
                  <div className="h-1.5 bg-sky-light rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-navy rounded-full"
                      animate={{ width: ["0%", "100%"] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="border border-sky-light rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-navy mb-2">
                  AI Triage Result
                </p>
                <div className="flex gap-2 flex-wrap">
                  <span className="badge-blue">Possible migraine</span>
                  <span className="badge-teal">See Neurologist</span>
                </div>
              </div>

              <PulseWave />

              <div className="mt-4 pt-4 border-t border-sky-light">
                <p className="text-xs font-semibold text-midnight mb-3">
                  Matched doctors near you
                </p>
                <div className="flex items-center gap-3 p-3 bg-cloud rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=80&q=80"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-midnight truncate">
                      Dr. Ahmed Khan
                    </p>
                    <p className="text-xs text-slate">Neurologist · Karachi</p>
                  </div>
                  <span className="badge-teal text-xs">Available</span>
                </div>
              </div>
            </motion.div>

            {/* Floating pill notifications */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5,
              }}
              className="absolute -left-8 top-1/3 bg-white border border-sky-light rounded-xl px-4 py-2.5 shadow-md flex items-center gap-2"
            >
              <Bell size={14} className="text-teal" />
              <span className="text-xs font-medium text-midnight">
                Medicine due in 15 min
              </span>
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -right-4 bottom-1/4 bg-white border border-sky-light rounded-xl px-4 py-2.5 shadow-md flex items-center gap-2"
            >
              <UserCheck size={14} className="text-navy" />
              <span className="text-xs font-medium text-midnight">
                Doctor verified
              </span>
            </motion.div>
          </motion.div>
        </div>

        <a
          href="#features"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-slate hover:text-navy transition-colors"
        >
          <span className="text-xs font-medium">Scroll to explore</span>
          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </a>
      </section>

      {/* Stats */}
      <section className="bg-navy py-14">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {STATS.map(({ value, label, icon: Icon }) => (
              <motion.div key={label} variants={fadeUp} className="text-center">
                <Icon size={22} className="text-teal mx-auto mb-2" />
                <div className="text-3xl font-extrabold text-white mb-1">
                  {value}
                </div>
                <div className="text-sky-light text-sm">{label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal text-sm font-semibold uppercase tracking-widest mb-3"
            >
              What Medivox does
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-extrabold text-midnight mb-4"
            >
              Everything you need,
              <br />
              nothing you don't
            </motion.h2>
            <motion.p
              variants={fadeUp}
              className="text-slate text-lg max-w-xl mx-auto"
            >
              Built for patients, designed for simplicity, powered by the best
              AI available.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {FEATURES.map(({ icon: Icon, color, icolor, title, desc }) => (
              <motion.div
                key={title}
                variants={fadeUp}
                className="card hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: color }}
                >
                  <Icon size={22} style={{ color: icolor }} />
                </div>
                <h3 className="text-base font-semibold text-midnight mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-teal text-sm font-semibold uppercase tracking-widest mb-3"
            >
              Simple process
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-extrabold text-midnight"
            >
              How Medivox works
            </motion.h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          >
            <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-sky-light" />
            {STEPS.map(({ num, title, desc }) => (
              <motion.div
                key={num}
                variants={fadeUp}
                className="relative text-center"
              >
                <div
                  className="w-14 h-14 rounded-2xl bg-navy text-white text-lg font-extrabold
                                flex items-center justify-center mx-auto mb-5 relative z-10"
                >
                  {num}
                </div>
                <h3 className="text-base font-semibold text-midnight mb-2">
                  {title}
                </h3>
                <p className="text-sm text-slate leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Doctors */}
      <section id="doctors" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4"
          >
            <div>
              <motion.p
                variants={fadeUp}
                className="text-teal text-sm font-semibold uppercase tracking-widest mb-3"
              >
                Our specialists
              </motion.p>
              <motion.h2
                variants={fadeUp}
                className="text-4xl font-extrabold text-midnight"
              >
                Meet verified doctors
              </motion.h2>
            </div>
            <motion.div variants={fadeUp}>
              <Link
                to="/register"
                className="btn-outline flex items-center gap-2"
              >
                View all doctors <ArrowRight size={15} />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {(verifiedDoctors.length > 0 ? verifiedDoctors : DOCTORS).map(
              (doc) => {
                const isReal = !!doc.user;
                const name = isReal ? doc.user?.name : doc.name;
                const field = isReal ? doc.specialization : doc.field;
                const city = isReal ? doc.user?.city : doc.city;
                const exp = isReal ? `${doc.experience} yrs` : doc.exp;
                const fee = isReal ? `Rs. ${doc.fee}` : doc.fee;
                const rating = doc.rating || 4.8;
                const reviews = doc.reviews || 0;
                const avail = doc.startTime
                  ? `${doc.startTime} — ${doc.endTime}`
                  : "Available today";
                const pic = isReal ? doc.profilePicture : doc.img;

                return (
                  <motion.div
                    key={doc._id || doc.name}
                    variants={fadeUp}
                    className="card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 border border-sky-light"
                        style={{ background: "#E6F1FB" }}
                      >
                        {pic ? (
                          <img
                            src={pic}
                            className="w-full h-full object-cover"
                            alt={name}
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center text-2xl font-bold"
                            style={{ color: "#0C447C" }}
                          >
                            {name?.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-midnight text-base">
                          {name}
                        </h3>
                        <p className="text-sm text-slate">{field}</p>
                        <div className="flex items-center gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              className="fill-amber-400 text-amber-400"
                            />
                          ))}
                          <span className="text-sm font-semibold text-midnight ml-1">
                            {rating}
                          </span>
                          {reviews > 0 && (
                            <span className="text-xs text-slate">
                              ({reviews})
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="badge-teal">Verified</span>
                      <span className="badge-blue">{avail}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-3 py-4 border-t border-b border-sky-light mb-4">
                      <div className="text-center">
                        <MapPin size={13} className="text-slate mx-auto mb-1" />
                        <p className="text-xs text-slate">{city}</p>
                      </div>
                      <div className="text-center">
                        <Clock size={13} className="text-slate mx-auto mb-1" />
                        <p className="text-xs text-slate">{exp}</p>
                      </div>
                      <div className="text-center">
                        <DollarSign
                          size={13}
                          className="text-slate mx-auto mb-1"
                        />
                        <p className="text-xs text-slate">{fee}</p>
                      </div>
                    </div>

                    <Link
                      to="/register"
                      className="w-full py-2.5 rounded-xl text-sm font-semibold text-white text-center block transition-all"
                      style={{ background: "#0C447C" }}
                    >
                      Book appointment
                    </Link>
                  </motion.div>
                );
              },
            )}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-96 h-96 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #1D9E75, transparent)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full opacity-10"
            style={{
              background: "radial-gradient(circle, #378ADD, transparent)",
            }}
          />
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto px-6 text-center relative z-10"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl lg:text-5xl font-extrabold text-white mb-6 leading-tight"
          >
            Take control of your
            <br />
            health today
          </motion.h2>
          <motion.p variants={fadeUp} className="text-sky-light text-lg mb-10">
            Join thousands of patients already using Medivox to find better
            care, faster.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link
              to="/register"
              className="bg-teal text-white px-10 py-3.5 rounded-lg font-semibold text-base
                         hover:opacity-90 transition-all active:scale-95 flex items-center gap-2"
            >
              Get started free <ArrowRight size={16} />
            </Link>
            <Link
              to="/register?role=doctor"
              className="bg-white/10 text-white border border-white/20 px-10 py-3.5 rounded-lg
                         font-semibold text-base hover:bg-white/20 transition-all"
            >
              Join as doctor
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="bg-midnight py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div>
              <Logo size="md" />
              <p className="text-sky-light/60 text-sm mt-3 max-w-xs leading-relaxed">
                AI-powered health platform connecting patients with verified
                doctors across Pakistan.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-12 text-sm">
              <div>
                <p className="text-white font-semibold mb-4">Platform</p>
                <div className="flex flex-col gap-2.5 text-sky-light/60">
                  <a
                    href="#features"
                    className="hover:text-white transition-colors"
                  >
                    Features
                  </a>
                  <a href="#how" className="hover:text-white transition-colors">
                    How it works
                  </a>
                  <a
                    href="#doctors"
                    className="hover:text-white transition-colors"
                  >
                    Doctors
                  </a>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-4">Join us</p>
                <div className="flex flex-col gap-2.5 text-sky-light/60">
                  <Link
                    to="/register"
                    className="hover:text-white transition-colors"
                  >
                    Patient signup
                  </Link>
                  <Link
                    to="/register?role=doctor"
                    className="hover:text-white transition-colors"
                  >
                    Doctor signup
                  </Link>
                  <Link
                    to="/login"
                    className="hover:text-white transition-colors"
                  >
                    Sign in
                  </Link>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-sky-light/40 text-sm">
              2026 Medivox. All rights reserved.
            </p>
            <p className="text-sky-light/40 text-sm">
              Built with care for better healthcare.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
