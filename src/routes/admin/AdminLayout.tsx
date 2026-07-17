import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Eye, LayoutDashboard, LogOut, ShieldCheck, BookOpen, Users, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_LINKS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/books", icon: BookOpen, label: "Book Management", exact: false },
  { to: "/admin/authors", icon: Users, label: "Author Management", exact: false },
  { to: "/admin/orders", icon: ShoppingCart, label: "Order Management", exact: false },
  { to: "/admin/publications/chapters", icon: BookOpen, label: "Chapter Publications", exact: false },
  { to: "/admin/publications/literary", icon: BookOpen, label: "Literary Publications", exact: false },
  { to: "/", icon: Eye, label: "Edit Live Site", exact: true },
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
    <div className="min-h-screen bg-[#f5f7fb] text-slate-950">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-b border-slate-200 bg-white lg:border-b-0 lg:border-r">
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
              <Link to="/admin" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-md bg-slate-950 text-sm font-bold text-white">
                  ADF
                </span>
                <span>
                  <span className="block text-sm font-semibold leading-5">Inline CMS</span>
                  <span className="block text-xs text-slate-500">Admin workspace</span>
                </span>
              </Link>
              <Link
                to="/"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
                aria-label="Open live site"
              >
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <nav className="flex gap-2 overflow-x-auto px-4 py-3 lg:flex-col lg:gap-1 lg:overflow-visible lg:p-4">
              {NAV_LINKS.map((link) => {
                const isActive = link.exact ? pathname === link.to : pathname.startsWith(link.to);
                const Icon = link.icon;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`inline-flex shrink-0 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? "bg-slate-950 text-white shadow-sm"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto hidden border-t border-slate-200 p-4 lg:block">
              <div className="rounded-md bg-slate-50 p-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Signed in
                </div>
                <div className="mt-1 truncate text-sm text-slate-500">{email ?? "Admin"}</div>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-sm font-semibold text-slate-950">Inline editing mode</h1>
                <p className="mt-0.5 text-xs text-slate-500">Manage public website content directly on the live pages.</p>
              </div>
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                >
                  <Eye className="h-4 w-4" />
                  View Site
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </button>
              </div>
            </div>
          </header>

          <div className="flex-1 overflow-auto px-4 py-6 lg:px-8 lg:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
