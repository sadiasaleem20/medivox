import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Users, Search, Menu, LogOut, UserCheck, Activity } from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import Logo from "../../components/shared/Logo";
import api from "../../lib/axios";

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

export default function UserList() {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    api
      .get("/admin/users")
      .then((res) => setUsers(res.data.users))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const filtered = users.filter(
    (u) =>
      !search ||
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.city?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-cloud flex">
      <Sidebar
        active="/admin/users"
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
            <h1 className="text-lg font-bold text-midnight">Users</h1>
            <p className="text-xs text-slate">
              {users.length} registered patients
            </p>
          </div>
        </header>

        <main className="flex-1 p-6 space-y-5">
          <div className="relative max-w-sm">
            <Search
              size={15}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="input-field pl-10 text-sm"
            />
          </div>

          <div className="card p-0 overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center h-48">
                <div className="w-7 h-7 rounded-full border-2 border-sky-light border-t-navy animate-spin" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16">
                <Users
                  size={36}
                  className="mx-auto mb-2 opacity-20 text-navy"
                />
                <p className="text-sm text-slate">No users found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-sky-light bg-cloud">
                      {["User", "Email", "Phone", "City", "Joined"].map((h) => (
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
                    {filtered.map((u, i) => (
                      <motion.tr
                        key={u._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="border-b border-sky-light hover:bg-cloud transition-colors"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                              style={{ background: "#1D9E75" }}
                            >
                              {u.name?.charAt(0)}
                            </div>
                            <p className="text-sm font-semibold text-midnight">
                              {u.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-sm text-slate">
                          {u.email}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate">
                          {u.phone || "—"}
                        </td>
                        <td className="px-5 py-4 text-sm text-slate">
                          {u.city || "—"}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate">
                          {new Date(u.createdAt).toLocaleDateString("en-PK", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
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
    </div>
  );
}
