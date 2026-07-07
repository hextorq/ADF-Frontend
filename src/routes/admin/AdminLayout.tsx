import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Megaphone, FileText, Activity, BookOpen, Settings, Layers, Calendar, Users, BarChart3, Star } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_LINKS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/admin/publications", icon: FileText, label: "Publications" },
  { to: "/admin/chapters", icon: Layers, label: "Chapters" },
  { to: "/admin/journals", icon: BookOpen, label: "Journals" },
  { to: "/admin/activities", icon: Activity, label: "Recent Activity" },
  { to: "/admin/events", icon: Calendar, label: "Events" },
  { to: "/admin/editorial", icon: Users, label: "Editorial Updates" },
  { to: "/admin/statistics", icon: BarChart3, label: "Statistics" },
  { to: "/admin/featured", icon: Star, label: "Featured Content" },
];

export default function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-white">
        <div className="flex h-14 items-center border-b border-slate-200 px-4">
          <Link to="/" className="flex items-center gap-2 font-bold text-[var(--primary)]">
            <span className="bg-[var(--primary)] text-white p-1 rounded">ADF</span>
            Admin Panel
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.to || (link.to !== "/admin" && pathname.startsWith(link.to));
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <h1 className="text-sm font-semibold text-slate-800">Content Management System</h1>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{email ?? "Admin"}</span>
            <Link to="/" className="text-[var(--primary)] hover:underline">View Site</Link>
            <button onClick={handleLogout} className="text-[var(--primary)] hover:underline">Log Out</button>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
