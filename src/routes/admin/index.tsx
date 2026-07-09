import { Link } from "react-router-dom";
import { Eye, LogOut, Pencil } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { EditableText } from "@/components/cms/EditableText";

export default function AdminDashboard() {
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <EditableText contentKey="admin.dashboard.title" fallback="Inline CMS is active" as="h2" className="text-2xl font-bold text-slate-900" label="Dashboard title" />
        <EditableText contentKey="admin.dashboard.description" fallback={`Signed in as ${email ?? "admin"}. Open the live website, hover editable text or images, click the pencil, make the change, and save. There is no separate content table to manage.`} as="p" multiline className="mt-2 text-sm leading-relaxed text-slate-600" label="Dashboard description" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          to="/"
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:border-[var(--primary)]"
        >
          <Eye className="h-6 w-6 text-[var(--primary)]" />
          <EditableText contentKey="admin.dashboard.edit.title" fallback="Edit live website" as="div" className="mt-4 font-semibold text-slate-900" label="Card title" />
          <EditableText contentKey="admin.dashboard.edit.description" fallback="Use hover pencils directly on public pages." as="p" className="mt-1 text-sm text-slate-500" label="Card description" />
        </Link>

        <button
          type="button"
          onClick={logout}
          className="rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:border-[var(--primary)]"
        >
          <LogOut className="h-6 w-6 text-[var(--primary)]" />
          <EditableText contentKey="admin.dashboard.logout.title" fallback="Log out" as="div" className="mt-4 font-semibold text-slate-900" label="Card title" />
          <EditableText contentKey="admin.dashboard.logout.description" fallback="End this editing session." as="p" className="mt-1 text-sm text-slate-500" label="Card description" />
        </button>
      </div>

      <div className="rounded-lg border border-blue-100 bg-blue-50 p-5 text-sm text-blue-900">
        <div className="flex items-center gap-2 font-semibold">
          <Pencil className="h-4 w-4" />
          <EditableText contentKey="admin.dashboard.behavior.title" fallback="Editing behavior" as="span" label="Behavior title" />
        </div>
        <p className="mt-2">
          <EditableText contentKey="admin.dashboard.behavior.description" fallback="Text edits, image URL edits, and uploaded images are saved through the backend CMS API into PostgreSQL. Visitors see the saved content automatically." as="span" multiline label="Behavior description" />
        </p>
      </div>
    </div>
  );
}
