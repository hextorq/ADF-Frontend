import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  Eye,
  FileText,
  Image,
  LogOut,
  MousePointerClick,
  Pencil,
  ShieldCheck,
  Lock,
  MonitorPlay,
  Wand2,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchRecentContentEdits, type ContentAuditLog } from "@/lib/api";

const QUICK_ACTIONS = [
  {
    title: "Edit live website",
    description: "Open the public site and use hover pencils on text and images.",
    to: "/",
    icon: Eye,
    tone: "bg-[#f8faff] text-[#1d4ed8]",
    iconTone: "bg-[#eff6ff] text-[#1d4ed8]",
  },
  {
    title: "Review public pages",
    description: "Check the visitor experience after making CMS edits.",
    to: "/",
    icon: Wand2,
    tone: "bg-[#faf8ff] text-[#7e22ce]",
    iconTone: "bg-[#f3e8ff] text-[#a855f7]",
  },
];

const WORKFLOW = [
  { icon: Eye, title: "Open page", text: "Go to the public page that needs a content change.", tone: "text-[#1d4ed8] bg-[#eff6ff]" },
  { icon: Pencil, title: "Click pencil", text: "Hover editable content and click the edit control.", tone: "text-emerald-600 bg-emerald-50" },
  { icon: CheckCircle2, title: "Save", text: "Changes are stored in the backend and shown to visitors.", tone: "text-[#7e22ce] bg-[#f3e8ff]" },
];

const COVERAGE = [
  { icon: FileText, label: "Text blocks", value: "Editable", tone: "bg-[#eff6ff] text-[#1d4ed8]" },
  { icon: Image, label: "Images", value: "Upload or URL", tone: "bg-emerald-50 text-emerald-600" },
  { icon: Database, label: "Storage", value: "PostgreSQL", tone: "bg-[#f3e8ff] text-[#a855f7]" },
  { icon: ShieldCheck, label: "Access", value: "Admin only", tone: "bg-orange-50 text-orange-500" },
];

function formatEditTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function previewValue(value: string | null) {
  if (!value) return "Empty";
  return value.length > 90 ? `${value.slice(0, 90)}...` : value;
}

export default function AdminDashboard() {
  const email = useAuthStore((s) => s.email);
  const logout = useAuthStore((s) => s.logout);
  const [recentEdits, setRecentEdits] = useState<ContentAuditLog[]>([]);
  const [recentEditsStatus, setRecentEditsStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let isMounted = true;
    fetchRecentContentEdits()
      .then(({ edits }) => {
        if (!isMounted) return;
        setRecentEdits(edits);
        setRecentEditsStatus("ready");
      })
      .catch(() => {
        if (!isMounted) return;
        setRecentEditsStatus("error");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6 font-sans">
      
      {/* Top Section */}
      <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        
        {/* Left Hero Box */}
        <div className="relative rounded-2xl border border-slate-200 bg-white p-8 sm:p-10 overflow-hidden shadow-sm flex flex-col justify-center">
          <div className="relative z-10 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-[11px] font-bold text-green-700 uppercase tracking-wide border border-green-100">
              <span className="h-2 w-2 rounded-full bg-green-500" />
              CMS session active
            </div>
            
            <h2 className="mt-6 text-3xl sm:text-[34px] font-serif font-bold tracking-tight text-slate-900 leading-[1.15]">
              Manage ADF content from the live website.
            </h2>
            
            <p className="mt-4 text-[15px] leading-relaxed text-slate-500 max-w-md">
              Signed in as <strong className="text-slate-800 font-semibold">{email ?? "admin@adf.local"}</strong>. Use the live site editor for copy, images, links, and page content without opening a separate content table.
            </p>
            
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                to="/"
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-[#1d4ed8] px-6 text-[15px] font-bold text-white transition hover:bg-blue-800 shadow-md shadow-blue-900/10"
              >
                Edit Live Site
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button
                type="button"
                onClick={logout}
                className="inline-flex h-12 items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 text-[15px] font-bold text-slate-700 transition hover:bg-slate-50 shadow-sm"
              >
                <LogOut className="h-4 w-4" />
                End Session
              </button>
            </div>
          </div>
          
          {/* Feather Illustration */}
          <div className="absolute right-0 bottom-0 pointer-events-none opacity-90 hidden md:block">
            <svg width="400" height="300" viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M250 250C250 250 380 150 350 80C320 10 250 150 250 250Z" fill="url(#feather-grad)"/>
              <path d="M250 250L350 80" stroke="white" strokeWidth="4" strokeLinecap="round"/>
              <path d="M270 200L310 160" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <path d="M290 150L320 120" stroke="white" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
              <rect x="230" y="240" width="40" height="30" rx="4" fill="#1e3a8a"/>
              <path d="M235 240L265 240" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round"/>
              <circle cx="340" cy="110" r="3" fill="#3b82f6"/>
              <circle cx="210" cy="140" r="2" fill="#3b82f6"/>
              <circle cx="280" cy="80" r="4" fill="#93c5fd"/>
              <defs>
                <linearGradient id="feather-grad" x1="250" y1="250" x2="350" y2="80" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#1e3a8a" />
                  <stop offset="1" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>

        {/* Right Info Box */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 flex flex-col justify-center shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Editing Behavior</h3>
          </div>
          <p className="text-[15px] leading-relaxed text-slate-600 mb-8">
            Saves are sent to the backend CMS API and stored in PostgreSQL. Visitors receive the saved version automatically.
          </p>
          <div className="rounded-2xl border border-green-100 bg-[#f8fdf9] p-5">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <div className="text-[15px] font-bold text-slate-900 mb-0.5">Safe seed mode</div>
                <div className="text-sm text-slate-500 leading-relaxed">New keys insert without overwriting edited content.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Middle */}
      <section className="grid gap-6 md:grid-cols-2">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              to={action.to}
              className={`group flex items-center justify-between rounded-2xl border border-slate-100 p-6 sm:p-8 transition-all hover:shadow-md ${action.tone}`}
            >
              <div className="flex items-center gap-5">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl ${action.iconTone}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 text-slate-900">{action.title}</h3>
                  <p className="text-[14px] opacity-80">{action.description}</p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </section>

      {/* Bottom Grid: Coverage & Workflow */}
      <section className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        
        {/* Coverage */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">CMS coverage</h3>
              <p className="text-sm text-slate-500 mt-1">Current editable content areas.</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-green-50 text-green-600 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {COVERAGE.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="rounded-2xl border border-slate-100 p-5 flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.tone}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-slate-900 mb-0.5">{item.value}</div>
                    <div className="text-sm text-slate-500">{item.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Workflow */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-8">Editing workflow</h3>
          <div className="grid gap-4">
            {WORKFLOW.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.title} className="relative flex items-center gap-6 rounded-2xl border border-slate-100 p-5 pl-6 bg-slate-50/50">
                  <div className={`w-12 h-12 rounded-full shadow-sm flex items-center justify-center shrink-0 relative z-10 ${step.tone}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  {/* Vertical Line Connector */}
                  {index !== WORKFLOW.length - 1 && (
                    <div className="absolute left-[3.1rem] top-[4.5rem] w-px h-6 bg-slate-200 -translate-x-1/2"></div>
                  )}
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Step {index + 1}</div>
                    <div className="text-[15px] font-bold text-slate-900 mb-0.5">{step.title}</div>
                    <div className="text-sm text-slate-500">{step.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Keep existing recent edits underneath */}
      <section className="rounded-2xl border border-slate-200 bg-white shadow-sm mt-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-8 py-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Recent edits</h3>
            <p className="mt-1 text-sm text-slate-500">Latest saved CMS changes with value history.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-bold text-slate-600">
            <Clock3 className="h-4 w-4" />
            Last 20 changes
          </div>
        </div>

        {recentEditsStatus === "loading" && (
          <div className="p-8">
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="h-24 animate-pulse rounded-2xl bg-slate-50" />
              ))}
            </div>
          </div>
        )}

        {recentEditsStatus === "error" && (
          <div className="p-8">
            <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-[15px] font-medium text-red-700">
              Recent edits could not be loaded. Check that the backend is updated and migrations are applied.
            </div>
          </div>
        )}

        {recentEditsStatus === "ready" && recentEdits.length === 0 && (
          <div className="p-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
              <Clock3 className="h-8 w-8" />
            </div>
            <h4 className="mt-5 text-[17px] font-bold text-slate-900">No edits recorded yet</h4>
            <p className="mt-2 text-[15px] text-slate-500">Saved changes will appear here after admins edit live content.</p>
          </div>
        )}

        {recentEditsStatus === "ready" && recentEdits.length > 0 && (
          <div className="divide-y divide-slate-100">
            {recentEdits.map((edit) => (
              <article key={edit.id} className="grid gap-6 px-8 py-6 lg:grid-cols-[220px_1fr] hover:bg-slate-50/50 transition-colors">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {formatEditTime(edit.created_at)}
                  </div>
                  <div className="mt-2 truncate text-[15px] font-bold text-slate-900">{edit.admin_email}</div>
                  <div className="mt-3 inline-flex rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                    {edit.content_key}
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Before</div>
                    <p className="mt-3 break-words text-[14px] leading-relaxed text-slate-600">{previewValue(edit.old_value)}</p>
                  </div>
                  <div className="rounded-xl border border-green-200 bg-[#f8fdf9] p-4 shadow-sm">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-green-700">After</div>
                    <p className="mt-3 break-words text-[14px] leading-relaxed text-slate-900 font-medium">{previewValue(edit.new_value)}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
