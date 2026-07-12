import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, LogOut, Pencil } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";

export function AdminLiveToolbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isAdmin = useAuthStore((s) => s.isAdmin);
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  if (!isAdmin || pathname.startsWith("/admin")) return null;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out");
      navigate("/");
    } catch {
      toast.error("Logout failed");
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 rounded-lg border border-slate-200 bg-white/95 p-2 shadow-2xl shadow-slate-950/15 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2 px-2">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-950 text-white">
            <Pencil className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <div className="text-sm font-semibold leading-5 text-slate-950">Live edit mode</div>
            <div className="truncate text-xs text-slate-500">{email ?? "Admin session active"}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            to="/admin"
            className="inline-flex h-9 items-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            <LayoutDashboard className="h-4 w-4" />
            Admin
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
