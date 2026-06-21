import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, Menu } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import DoctorSidebar from "../../components/shared/DoctorSidebar";

export default function Appointments() {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-cloud flex">
      <DoctorSidebar
        active={`/doctor/${user?._id}/appointments`}
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
            <h1 className="text-lg font-bold text-midnight">Appointments</h1>
            <p className="text-xs text-slate">
              Your scheduled patient consultations
            </p>
          </div>
        </header>

        <main className="flex-1 p-6">
          <div className="card text-center py-20">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "#E6F1FB" }}
            >
              <Calendar size={28} style={{ color: "#0C447C" }} />
            </div>
            <h2 className="text-base font-bold text-midnight mb-2">
              Appointments coming soon
            </h2>
            <p className="text-sm text-slate max-w-sm mx-auto leading-relaxed">
              Once patients book appointments with you, they will appear here.
              Make sure your profile is complete and verified.
            </p>
            <Link
              to={`/doctor/${user?._id}/profile`}
              className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
              style={{ background: "#0C447C" }}
            >
              Complete profile
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
