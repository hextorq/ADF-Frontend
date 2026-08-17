import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { ArrowUpRight, Eye, LayoutDashboard, LogOut, ShieldCheck, BookOpen, Users, ShoppingCart, ChevronsLeft, Headset, ArrowRight, UserCircle } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_LINKS = [
  { to: "/admin", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { to: "/admin/books", icon: BookOpen, label: "Book Management", exact: false },
  { to: "/admin/authors", icon: Users, label: "Author Management", exact: false },
  { to: "/admin/orders", icon: ShoppingCart, label: "Order Management", exact: false },
  { to: "/admin/publications/chapters", icon: BookOpen, label: "Chapter Publications", exact: false },
  { to: "/admin/publications/literary", icon: BookOpen, label: "Literary Publications", exact: false },
  { to: "/admin/programmes", icon: Users, label: "Academic Programmes", exact: false },
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
    <div className="min-h-screen bg-[#f8fafc] text-slate-950 font-sans flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[280px] flex-col border-r border-slate-200 bg-white h-screen sticky top-0 shrink-0">
        
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-6 py-6">
          <Link to="/admin" className="flex items-center gap-3">
            <div className="shrink-0">
              <img src="/logo.png" alt="ADF Logo" className="h-10 w-auto object-contain" />
            </div>
            <div>
              <div className="font-bold text-slate-900 leading-tight">ADF Admin</div>
              <div className="text-xs text-slate-500 font-medium">Admin Workspace</div>
            </div>
          </Link>
          <button className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
            <ChevronsLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-2 overflow-y-auto space-y-1 hide-scrollbar">
          {NAV_LINKS.map((link) => {
            const isActive = link.exact ? pathname === link.to : pathname.startsWith(link.to);
            const Icon = link.icon;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Bottom Box */}
        <div className="p-4 flex flex-col gap-2">
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100 relative overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-blue-600 mb-3 relative z-10">
              <Headset className="w-4 h-4" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-1 relative z-10">Need Help?</h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 relative z-10">Check our documentation or contact support.</p>
            <Link to="#" className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:text-blue-800 transition-colors relative z-10">
              View Docs <ArrowUpRight className="w-3 h-3" />
            </Link>
            
            {/* Decorative Books Illustration */}
            <div className="absolute -bottom-4 -right-4 w-28 h-28 opacity-40 pointer-events-none">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 80L90 80C92.7614 80 95 77.7614 95 75L95 70C95 67.2386 92.7614 65 90 65L10 65C7.23858 65 5 67.2386 5 70L5 75C5 77.7614 7.23858 80 10 80Z" fill="#3b82f6"/>
                <path d="M15 65L85 65C87.7614 65 90 62.7614 90 60L90 55C90 52.2386 87.7614 50 85 50L15 50C12.2386 50 10 52.2386 10 55L10 60C10 62.7614 12.2386 65 15 65Z" fill="#60a5fa"/>
                <path d="M25 50L80 50C82.7614 50 85 47.7614 85 45L85 40C85 37.2386 82.7614 35 80 35L25 35C22.2386 35 20 37.2386 20 40L20 45C20 47.7614 22.2386 50 25 50Z" fill="#93c5fd"/>
                <path d="M15 70L85 70" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M20 55L80 55" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <path d="M30 40L75 40" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold text-red-600 hover:bg-red-50 transition-colors w-full"
          >
            <LogOut className="w-[18px] h-[18px]" />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-6 sm:px-10 flex items-center justify-between shrink-0">
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Inline Admin</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5 hidden sm:block">Manage public website content directly on the live pages.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden sm:inline-flex h-10 items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 text-sm font-semibold text-blue-600 transition hover:bg-blue-100 shadow-sm"
            >
              <Eye className="h-4 w-4" />
              View Site
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6 sm:p-10">
          <Outlet />
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
}
