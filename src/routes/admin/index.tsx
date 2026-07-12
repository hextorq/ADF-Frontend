import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  FileText,
  Image,
  LogOut,
  MousePointerClick,
  Pencil,
  ShieldCheck,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";

const QUICK_ACTIONS = [
  {
    title: "Edit live website",
    description: "Open the public site and use hover pencils on text and images.",
    to: "/",
    icon: Eye,
    tone: "bg-slate-950 text-white",
  },
  {
    title: "Review public pages",
    description: "Check the visitor experience after making CMS edits.",
    to: "/",
    icon: MousePointerClick,
    tone: "bg-white text-slate-950",
  },
];

const WORKFLOW = [
  { icon: Eye, title: "Open page", text: "Go to the public page that needs a content change." },
  { icon: Pencil, title: "Click pencil", text: "Hover editable content and click the edit control." },
  { icon: CheckCircle2, title: "Save", text: "Changes are stored in the backend and shown to visitors." },
];

const COVERAGE = [
  { icon: FileText, label: "Text blocks", value: "Editable" },
  { icon: Image, label: "Images", value: "Upload or URL" },
  { icon: Database, label: "Storage", value: "PostgreSQL" },
  { icon: ShieldCheck, label: "Access", value: "Admin only" },
];

export default function AdminDashboard() {
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        <div className="grid gap-0 lg:grid-cols-[1.35fr_0.65fr]">
          <div className="p-6 sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-md bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              CMS session active
            </div>
            <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Manage ADF content from the live website.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
              Signed in as {email ?? "admin"}. Use the live site editor for copy, images, links, and page content without opening a separate content table.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/"
                className="inline-flex h-11 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Edit Live Site
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-11 items-center gap-2 rounded-md border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />
                End Session
              </button>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-950 p-6 text-white lg:border-l lg:border-t-0 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Editing behavior</div>
            <p className="mt-4 text-sm leading-6 text-slate-200">
              Saves are sent to the backend CMS API and stored in PostgreSQL. Visitors receive the saved version automatically.
            </p>
            <div className="mt-6 rounded-md border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <Database className="h-5 w-5 text-emerald-300" />
                <div>
                  <div className="text-sm font-semibold">Safe seed mode</div>
                  <div className="mt-0.5 text-xs text-slate-400">New keys insert without overwriting edited content.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          const isDark = action.tone.includes("slate-950");
          return (
            <Link
              key={action.title}
              to={action.to}
              className={`group rounded-lg border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-200/70 ${action.tone}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className={`grid h-11 w-11 place-items-center rounded-md ${isDark ? "bg-white/10" : "bg-slate-100"}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 opacity-60 transition group-hover:translate-x-0.5" />
              </div>
              <h3 className="mt-5 text-base font-semibold">{action.title}</h3>
              <p className={`mt-1 text-sm leading-6 ${isDark ? "text-slate-300" : "text-slate-500"}`}>{action.description}</p>
            </Link>
          );
        })}
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-slate-950">CMS coverage</h3>
              <p className="mt-1 text-sm text-slate-500">Current editable content areas.</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {COVERAGE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-md border border-slate-200 p-4">
                  <Icon className="h-5 w-5 text-slate-500" />
                  <div className="mt-3 text-sm font-semibold text-slate-950">{item.value}</div>
                  <div className="mt-0.5 text-xs text-slate-500">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="text-base font-semibold text-slate-950">Editing workflow</h3>
          <div className="mt-5 grid gap-3">
            {WORKFLOW.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="flex gap-4 rounded-md border border-slate-200 p-4">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">Step {index + 1}</div>
                    <div className="mt-1 text-sm font-semibold text-slate-950">{step.title}</div>
                    <div className="mt-1 text-sm leading-5 text-slate-500">{step.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
