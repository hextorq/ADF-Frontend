import { useState } from "react";
import { ArrowRight, Calendar, Tag, Activity, BookOpen, FileText, CheckCircle, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { useCMSStore, Announcement, Publication, Activity as ActivityType } from "@/store/useCMSStore";
import { EditableText } from "@/components/cms/EditableText";

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
            <EditableText contentKey="home.hub.eyebrow" fallback="Dynamic Content Hub" as="div" className="eyebrow text-[var(--primary)] font-semibold tracking-wider uppercase text-xs" label="Hub eyebrow" />
            <EditableText contentKey="home.hub.title" fallback="Interactive Announcement Hub" as="h2" className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]" label="Hub title" />
            <EditableText
              contentKey="home.hub.description"
              fallback="Real-time updates on calls for papers, recent publications, and editorial activities."
              as="p"
              multiline
              className="mt-2 text-[var(--ink-soft)] max-w-2xl"
              label="Hub description"
            />
          </div>
          <Link to="/announcements" className="btn-outline">
            <EditableText contentKey="home.hub.viewAll" fallback="View all updates" as="span" label="View all updates" /> <ArrowRight className="h-4 w-4" />
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
                <EditableText contentKey={`home.hub.tab.${t}`} fallback={t} as="span" label="Hub tab" />
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
              {displayAnnouncements.length === 0 && <EditableText contentKey="home.hub.empty.announcements" fallback="No active announcements." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}

          {tab === "Recent Publications" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {recentPubs.map(it => (
                <PublicationCard key={it.id} item={it} />
               ))}
               {recentPubs.length === 0 && <EditableText contentKey="home.hub.empty.publications" fallback="No recent publications." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}

          {tab === "Latest Chapters" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {chapters.map(it => (
                <PublicationCard key={it.id} item={it} />
               ))}
               {chapters.length === 0 && <EditableText contentKey="home.hub.empty.chapters" fallback="No latest chapters." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}

          {tab === "Recent Activity" && (
             <div className="space-y-4 max-w-3xl">
               {activities.map(it => (
                <ActivityRow key={it.id} item={it} />
               ))}
               {activities.length === 0 && <EditableText contentKey="home.hub.empty.activities" fallback="No recent activities." as="p" className="text-slate-500" label="Empty state" />}
             </div>
          )}
          
          {/* Placeholders for others */}
          {["Journal Releases", "Programmes & Events"].includes(tab) && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <EditableText contentKey={`home.hub.placeholder.${tab}`} fallback={`Content for ${tab} will appear here.`} as="p" label="Placeholder" />
              <EditableText contentKey="home.hub.placeholder.note" fallback="Manageable via Admin Panel" as="p" className="text-xs mt-2" label="Placeholder note" />
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
          <Tag className="h-3 w-3" /> <EditableText contentKey={`announcement.${item.id}.category`} fallback={item.category} as="span" label="Announcement category" />
        </span>
        {item.pinned && <EditableText contentKey="home.hub.pinned" fallback="Pinned" as="span" className="ml-auto text-[var(--primary)] text-xs font-bold uppercase tracking-wider" label="Pinned label" />}
      </div>
      <h3 className="mt-3 font-serif text-lg font-semibold text-[var(--ink)] leading-snug">
        <EditableText contentKey={`announcement.${item.id}.title`} fallback={item.title} as="span" label="Announcement title" />
      </h3>
      <EditableText contentKey={`announcement.${item.id}.excerpt`} fallback={item.excerpt} as="p" multiline className="mt-2 text-sm text-[var(--ink-soft)] flex-1" label="Announcement excerpt" />
      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="inline-flex items-center gap-1.5 text-[var(--ink-soft)]">
          <Calendar className="h-3.5 w-3.5" />
          <EditableText contentKey={`announcement.${item.id}.date`} fallback={item.date} as="span" label="Announcement date" />
        </span>
        <Link to={item.to} className="inline-flex items-center gap-1 font-semibold text-[var(--primary)] hover:underline">
          <EditableText contentKey="home.hub.readMore" fallback="Read more" as="span" label="Read more" /> <ArrowRight className="h-3.5 w-3.5" />
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
        <EditableText contentKey={`publication.${item.id}.category`} fallback={item.category} as="span" className="text-slate-500" label="Publication category" />
      </div>
      <h3 className="font-serif text-lg font-semibold text-[var(--ink)] leading-snug">
        <EditableText contentKey={`publication.${item.id}.title`} fallback={item.title} as="span" label="Publication title" />
      </h3>
      {item.authors && (
        <p className="mt-1 text-sm text-slate-600">
          <EditableText contentKey="home.hub.by" fallback="By" as="span" label="By label" /> <EditableText contentKey={`publication.${item.id}.authors`} fallback={item.authors} as="span" label="Publication authors" />
        </p>
      )}
      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <EditableText contentKey={`publication.${item.id}.date`} fallback={item.date} as="span" className="text-slate-500" label="Publication date" />
        <Link to={item.to} className="text-[var(--primary)] font-medium hover:underline">
          <EditableText contentKey="home.hub.viewDetails" fallback="View details" as="span" label="View details" />
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
          <EditableText contentKey={`activity.${item.id}.title`} fallback={item.title} as="h4" className="font-semibold text-slate-900" label="Activity title" />
          <EditableText contentKey={`activity.${item.id}.time`} fallback={item.time} as="span" className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded" label="Activity time" />
        </div>
        <EditableText contentKey={`activity.${item.id}.description`} fallback={item.description} as="p" multiline className="text-sm text-slate-600 mt-1" label="Activity description" />
        <div className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <EditableText contentKey={`activity.${item.id}.category`} fallback={item.category} as="span" label="Activity category" />
        </div>
      </div>
    </div>
  );
}
