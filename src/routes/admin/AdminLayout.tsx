import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { EditableText } from "@/components/cms/EditableText";

const NAV_LINKS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/", icon: Eye, label: "Edit Live Site" },
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
            <EditableText contentKey="admin.layout.brand" fallback="Inline CMS" as="span" label="Admin brand" />
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
                <EditableText contentKey={`admin.nav.${link.label}`} fallback={link.label} as="span" label="Admin nav" />
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
          <EditableText contentKey="admin.layout.title" fallback="Inline editing mode" as="h1" className="text-sm font-semibold text-slate-800" label="Admin title" />
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <span>{email ?? "Admin"}</span>
            <Link to="/" className="text-[var(--primary)] hover:underline"><EditableText contentKey="admin.layout.viewSite" fallback="View Site" as="span" label="Admin link" /></Link>
            <button onClick={handleLogout} className="text-[var(--primary)] hover:underline"><EditableText contentKey="admin.layout.logout" fallback="Log Out" as="span" label="Admin button" /></button>
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
