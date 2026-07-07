import { useState } from "react";
import { ArrowRight, Calendar, Tag, Activity, BookOpen, FileText, CheckCircle, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useCMSStore, Announcement, Publication, Activity as ActivityType } from "@/store/useCMSStore";

const TABS = [
  "Announcements",
  "Recent Publications",
  "Latest Chapters",
  "Journal Releases",
  "Recent Activity",
  "Programmes & Events",
];

export function AnnouncementHub() {
  const [tab, setTab] = useState(TABS[0]);
  
  const allAnnouncements = useCMSStore(s => s.announcements);
  const allPublications = useCMSStore(s => s.publications);
  const allActivities = useCMSStore(s => s.activities);
  
  const announcements = allAnnouncements.filter(a => a.visible);
  const publications = allPublications.filter(p => p.visible);
  const activities = allActivities.filter(a => a.visible);
  
  // Helper to group announcements by type or just show all
  const displayAnnouncements = announcements;
  const recentPubs = publications.filter(p => p.pubType === 'Article' || p.pubType === 'Book');
  const chapters = publications.filter(p => p.pubType === 'Book Chapter');
  
  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200">
      <div className="container-academic">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <div className="eyebrow text-[var(--primary)] font-semibold tracking-wider uppercase text-xs">Dynamic Content Hub</div>
            <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]">
              Interactive Announcement Hub
            </h2>
            <p className="mt-2 text-[var(--ink-soft)] max-w-2xl">
              Real-time updates on calls for papers, recent publications, and editorial activities.
            </p>
          </div>
          <Link to="/announcements" className="btn-outline">
            View all updates <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-8 border-b border-border overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition ${
                  tab === t
                    ? "border-[var(--primary)] text-[var(--primary)] bg-white"
                    : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-slate-100/50"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 min-h-[400px]">
          {tab === "Announcements" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {displayAnnouncements.map(it => (
                <AnnouncementCard key={it.id} item={it} />
              ))}
              {displayAnnouncements.length === 0 && <p className="text-slate-500 col-span-full">No active announcements.</p>}
            </div>
          )}

          {tab === "Recent Publications" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {recentPubs.map(it => (
                <PublicationCard key={it.id} item={it} />
               ))}
               {recentPubs.length === 0 && <p className="text-slate-500 col-span-full">No recent publications.</p>}
            </div>
          )}

          {tab === "Latest Chapters" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {chapters.map(it => (
                <PublicationCard key={it.id} item={it} />
               ))}
               {chapters.length === 0 && <p className="text-slate-500 col-span-full">No latest chapters.</p>}
            </div>
          )}

          {tab === "Recent Activity" && (
             <div className="space-y-4 max-w-3xl">
               {activities.map(it => (
                <ActivityRow key={it.id} item={it} />
               ))}
               {activities.length === 0 && <p className="text-slate-500">No recent activities.</p>}
             </div>
          )}
          
          {/* Placeholders for others */}
          {["Journal Releases", "Programmes & Events"].includes(tab) && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p>Content for {tab} will appear here.</p>
              <p className="text-xs mt-2">Manageable via Admin Panel</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function AnnouncementCard({ item }: { item: Announcement }) {
  return (
    <article className={`surface-card p-5 flex flex-col transition hover:shadow-md ${item.pinned ? 'border-[var(--primary)] border-2' : 'hover:border-[var(--primary)]'}`}>
      <div className="flex items-center gap-2 text-xs">
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold ${
          item.priority === "High" ? "bg-rose-50 text-rose-700"
            : item.priority === "New" ? "bg-emerald-50 text-emerald-700"
            : "bg-slate-100 text-slate-700"
        }`}>{item.priority}</span>
        <span className="inline-flex items-center gap-1 text-[var(--ink-soft)]">
          <Tag className="h-3 w-3" /> {item.category}
        </span>
        {item.pinned && <span className="ml-auto text-[var(--primary)] text-xs font-bold uppercase tracking-wider">Pinned</span>}
      </div>
      <h3 className="mt-3 font-serif text-lg font-semibold text-[var(--ink)] leading-snug">
        {item.title}
      </h3>
      <p className="mt-2 text-sm text-[var(--ink-soft)] flex-1">{item.excerpt}</p>
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-[var(--ink-soft)]">
          <Calendar className="h-3.5 w-3.5" /> {item.date}
        </span>
        <Link to={item.to} className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline">
          Read more <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}

function PublicationCard({ item }: { item: Publication }) {
  return (
    <article className="surface-card p-5 flex flex-col hover:border-[var(--primary)] transition">
      <div className="flex items-center gap-2 text-xs mb-3">
        <span className="bg-[var(--primary)]/10 text-[var(--primary)] rounded-full px-2 py-0.5 font-semibold">
          {item.pubType}
        </span>
        <span className="text-slate-500">{item.category}</span>
      </div>
      <h3 className="font-serif text-lg font-semibold text-[var(--ink)] leading-snug">
        {item.title}
      </h3>
      {item.authors && <p className="mt-1 text-sm text-slate-600">By {item.authors}</p>}
      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <span className="text-slate-500">{item.date}</span>
        <Link to={item.to} className="text-[var(--primary)] font-medium hover:underline">
          View details
        </Link>
      </div>
    </article>
  );
}

function ActivityRow({ item }: { item: ActivityType }) {
  const IconMap: Record<string, any> = {
    FileText: FileText,
    CheckCircle: CheckCircle,
    BookOpen: BookOpen,
    Activity: Activity
  };
  const IconComponent = IconMap[item.iconName] || Activity;

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
      <div className="rounded-full bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h4 className="font-semibold text-slate-900">{item.title}</h4>
          <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{item.time}</span>
        </div>
        <p className="text-sm text-slate-600 mt-1">{item.description}</p>
        <div className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          {item.category}
        </div>
      </div>
    </div>
  );
}
