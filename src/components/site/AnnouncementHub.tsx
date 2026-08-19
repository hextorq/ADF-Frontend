import { useState } from "react";
import { ArrowRight, Calendar, Tag, Activity, BookOpen, FileText, CheckCircle, Video, Trash2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useCMSStore, Announcement, Publication, Activity as ActivityType } from "@/store/useCMSStore";
import { EditableText } from "@/components/cms/EditableText";
import { useAuthStore } from "@/store/useAuthStore";
import React, { useEffect } from "react";
import { Clock, MapPin, Users, AlertTriangle } from "lucide-react";
import { MOCK_BOOKS } from "@/components/store/store-mock-data";

function getRelativeTime(timeStr: string) {
  const d = new Date(timeStr);
  if (isNaN(d.getTime())) return timeStr;
  
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const minutesDifference = Math.round((d.getTime() - Date.now()) / (1000 * 60));
  const hoursDifference = Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60));
  const daysDifference = Math.round((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  
  if (Math.abs(daysDifference) > 0) return rtf.format(daysDifference, 'day');
  if (Math.abs(hoursDifference) > 0) return rtf.format(hoursDifference, 'hour');
  if (Math.abs(minutesDifference) > 0) return rtf.format(minutesDifference, 'minute');
  return "Just now";
}

class HubErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 text-center text-red-600 bg-red-50 rounded-xl my-8">
          <AlertTriangle className="mx-auto h-8 w-8 mb-4" />
          <h2 className="text-lg font-bold">Crash in AnnouncementHub</h2>
          <p className="mt-2 text-sm font-mono whitespace-pre-wrap text-left bg-white p-4 border rounded">{this.state.error?.toString()}</p>
          <p className="mt-2 text-sm font-mono whitespace-pre-wrap text-left bg-white p-4 border rounded">{this.state.error?.stack}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const TABS = [
  "Announcements",
  "Recent Publications",
  "Latest Chapters",
  "Journal Releases",
  "Recent Activity",
  "Programmes & Events",
];

export function AnnouncementHub() {
  return (
    <HubErrorBoundary>
      <AnnouncementHubInner />
    </HubErrorBoundary>
  );
}

function AnnouncementHubInner() {
  const [tab, setTab] = useState(TABS[0]);
  const isAdmin = useAuthStore(s => s.isAdmin);
  
  const allAnnouncements = useCMSStore(s => s.announcements) || [];
  const allPublications = useCMSStore(s => s.publications) || [];
  const allActivities = useCMSStore(s => s.activities) || [];
  const [showAllActivities, setShowAllActivities] = useState(false);
  const journals = (useCMSStore(s => s.journals) || []).filter(j => j?.visible);
  
  const [programmes, setProgrammes] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/programmes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProgrammes(data);
      })
      .catch(console.error);
  }, []);
  
  const announcements = allAnnouncements.filter(a => a?.visible);
  const publications = allPublications.filter(p => p?.visible);
  const activities = allActivities.filter(a => a?.visible);
  
  // Fetch latest published chapters from backend
  const [publishedChapters, setPublishedChapters] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/publications/chapters/admin")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const published = data.filter(c => c.stage === 'Published');
          setPublishedChapters(published.map(c => ({
            id: c.id,
            pubType: 'Book Chapter',
            category: c.volume_title,
            title: c.chapter_title,
            authors: c.authors && c.authors.length > 0 ? c.authors.map((a: any) => a.name).join(', ') : "Unknown",
            date: new Date(c.created_at).toLocaleDateString(),
            to: `/chapter-publications`,
            pinned: false,
            visible: true
          })));
        }
      })
      .catch(console.error);
  }, []);

  // Fetch latest published literary books from backend
  const [publishedBooks, setPublishedBooks] = useState<any[]>([]);
  useEffect(() => {
    fetch("/api/publications/literary/admin")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          const published = data.filter(b => b.current_stage === 'Book Store');
          setPublishedBooks(published.map(b => ({
            id: b.id,
            pubType: 'Book',
            category: b.book_genre,
            title: b.book_title,
            authors: b.author_name,
            date: new Date(b.created_at).toLocaleDateString(),
            to: `/bookstore?q=${encodeURIComponent(b.book_title)}`,
            pinned: false,
            visible: true
          })));
        }
      })
      .catch(console.error);
  }, []);

  const displayAnnouncements = announcements;
  
  // Use real backend data for recent publications
  const recentPubs = publishedBooks.length > 0 ? publishedBooks : MOCK_BOOKS.slice(0, 3).map(book => ({
    id: book.id,
    pubType: 'Book',
    category: book.genre,
    title: book.title,
    authors: book.author,
    date: new Date(book.publicationDate).toLocaleDateString(),
    to: `/bookstore?q=${encodeURIComponent(book.title)}`,
    pinned: false,
    visible: true
  }));
  
  // Use backend data for latest chapters if available, else fallback to CMS
  const chapters = publishedChapters.length > 0 ? publishedChapters : publications.filter(p => p?.pubType === 'Book Chapter');
  
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
          <div className="flex items-center gap-3 flex-wrap">
            <a href="https://whatsapp.com/channel/0029Vb81bKK2v1IytFrFwr3E" target="_blank" rel="noopener noreferrer" className="btn-primary !bg-[#25D366] hover:!bg-[#128C7E] border-transparent flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              <span>Get Instant Updates</span>
            </a>
            <Link to="/announcements" className="btn-outline">
              <EditableText contentKey="home.hub.viewAll" fallback="View all updates" as="span" label="View all updates" /> <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <div className="mt-8 border-b border-border overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {TABS.map((t) => (
              <div
                key={t}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setTab(t); } }}
                onClick={() => setTab(t)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition cursor-pointer ${
                  tab === t
                    ? "border-[var(--primary)] text-[var(--primary)] bg-white"
                    : "border-transparent text-[var(--ink-soft)] hover:text-[var(--ink)] hover:bg-slate-100/50"
                }`}
              >
                <EditableText contentKey={`home.hub.tab.${t}`} fallback={t} as="span" label="Hub tab" />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 min-h-[400px]">
          {tab === "Announcements" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {isAdmin && (
                <button
                  onClick={() => {
                    const newAnnouncement = { id: Date.now().toString(), date: "New Date", type: "Announcement" as const, category: "New Category", priority: "New" as const, title: "New Announcement", excerpt: "New description", to: "/announcements", pinned: false, visible: true };
                    useCMSStore.getState().setAnnouncements([newAnnouncement, ...allAnnouncements]);
                  }}
                  className="surface-card flex min-h-[200px] flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 hover:border-[var(--primary)] hover:text-[var(--primary)] transition-colors"
                >
                  <span className="text-3xl font-light">+</span>
                  <span className="text-sm font-medium">Add New Announcement</span>
                </button>
              )}
              {displayAnnouncements?.map(it => (
                <AnnouncementCard key={it?.id} item={it} />
              ))}
              {(!displayAnnouncements || displayAnnouncements.length === 0) && <EditableText contentKey="home.hub.empty.announcements" fallback="No active announcements." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}

          {tab === "Recent Publications" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {recentPubs?.map(it => (
                <PublicationCard key={it?.id} item={it} />
               ))}
               {(!recentPubs || recentPubs.length === 0) && <EditableText contentKey="home.hub.empty.publications" fallback="No recent publications." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}

          {tab === "Latest Chapters" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {chapters?.map(it => (
                <PublicationCard key={it?.id} item={it} />
               ))}
               {(!chapters || chapters.length === 0) && <EditableText contentKey="home.hub.empty.chapters" fallback="No latest chapters." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}

          {tab === "Recent Activity" && (
             <div className="space-y-4 max-w-3xl">
               {(showAllActivities ? activities : activities.slice(0, 4))?.map(it => (
                <ActivityRow key={it?.id} item={it} />
               ))}
               {(!activities || activities.length === 0) && <EditableText contentKey="home.hub.empty.activities" fallback="No recent activities." as="p" className="text-slate-500" label="Empty state" />}
               
               {activities?.length > 4 && (
                 <div className="text-center pt-2 border-t border-slate-100">
                   <Button variant="ghost" className="text-[var(--primary)] hover:bg-[var(--primary)]/10" onClick={() => setShowAllActivities(!showAllActivities)}>
                     {showAllActivities ? "Show Less" : "View All Activity"}
                   </Button>
                 </div>
               )}
             </div>
          )}
          
          {tab === "Journal Releases" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {journals?.map(it => (
                <JournalCard key={it?.id} item={it} />
               ))}
               {(!journals || journals.length === 0) && <EditableText contentKey="home.hub.empty.journals" fallback="No journal releases." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}

          {tab === "Programmes & Events" && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
               {programmes?.map(it => (
                <ProgrammeCard key={it?.id} item={it} />
               ))}
               {(!programmes || programmes.length === 0) && <EditableText contentKey="home.hub.empty.programmes" fallback="No upcoming programmes." as="p" className="text-slate-500 col-span-full" label="Empty state" />}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function JournalCard({ item }: { item: any }) {
  return (
    <article className="relative surface-card p-5 flex flex-col hover:border-[var(--primary)] transition">
      <div className="flex items-center gap-2 text-xs mb-3 pr-4">
        <span className="bg-[var(--primary)]/10 text-[var(--primary)] rounded-full px-2 py-0.5 font-semibold">
          Journal
        </span>
        <span className="text-slate-500">{item.date}</span>
      </div>
      <h3 className="font-serif text-lg font-semibold text-[var(--ink)] leading-snug">
        {item.title}
      </h3>
      <div className="mt-2 text-sm text-slate-600 flex flex-col gap-0.5">
        <span>Volume {item.volume}, Issue {item.issue}</span>
        <span>ISSN: {item.issn}</span>
      </div>
      <div className="mt-auto pt-4 flex items-center justify-between text-sm">
        <Link to={item.to || "/journals"} className="text-[var(--primary)] font-medium hover:underline">
          View details
        </Link>
      </div>
    </article>
  );
}

function ProgrammeCard({ item }: { item: any }) {
  return (
    <article className="relative surface-card p-5 flex flex-col hover:border-[var(--primary)] transition">
      <div className="flex items-center justify-between text-xs mb-3">
        <span className="rounded-full bg-[var(--accent)]/15 text-[var(--accent)] px-2 py-0.5 font-semibold">{item.type}</span>
        <span className="text-[var(--ink-soft)]">{new Date(item.date).toLocaleDateString()}</span>
      </div>
      <h3 className="font-serif text-lg font-semibold text-[var(--ink)] leading-snug">{item.title}</h3>
      <div className="mt-3 flex flex-wrap gap-x-3 gap-y-2 text-xs text-[var(--ink-soft)]">
        <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {item.duration}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {item.mode}</span>
        <span className="inline-flex items-center gap-1"><Users className="h-3.5 w-3.5" /> {item.seats} seats</span>
      </div>
      <div className="mt-auto pt-4 text-sm">
        <Link to="/academic-programmes" className="text-[var(--primary)] font-medium hover:underline">
          Learn more & register
        </Link>
      </div>
    </article>
  );
}

function AnnouncementCard({ item }: { item: any }) {
  const isAdmin = useAuthStore(s => s.isAdmin);
  const allAnnouncements = useCMSStore(s => s.announcements);
  const setAnnouncements = useCMSStore(s => s.setAnnouncements);

  const handleDelete = () => {
    setAnnouncements(allAnnouncements.filter(a => a.id !== item.id));
  };

  return (
    <article className={`relative surface-card p-5 flex flex-col transition-colors ${item.pinned ? 'border-[var(--primary)] border-2' : 'hover:border-[var(--primary)]'}`}>
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 transition-colors"
          title="Delete Announcement"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
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
      <h3 className="mt-3 font-serif text-lg font-semibold text-[var(--ink)] leading-snug pr-4">
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
  const isAdmin = useAuthStore(s => s.isAdmin);
  const allPublications = useCMSStore(s => s.publications);
  const setPublications = useCMSStore(s => s.setPublications);

  const handleDelete = () => {
    setPublications(allPublications.filter(p => p.id !== item.id));
  };

  return (
    <article className="relative surface-card p-5 flex flex-col hover:border-[var(--primary)] transition">
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 transition-colors"
          title="Delete Publication"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="flex items-center gap-2 text-xs mb-3 pr-4">
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
  const isAdmin = useAuthStore(s => s.isAdmin);
  const allActivities = useCMSStore(s => s.activities);
  const setActivities = useCMSStore(s => s.setActivities);

  const handleDelete = () => {
    setActivities(allActivities.filter(a => a.id !== item.id));
  };

  const IconMap: Record<string, any> = {
    FileText: FileText,
    CheckCircle: CheckCircle,
    BookOpen: BookOpen,
    Activity: Activity
  };
  const IconComponent = IconMap[item.iconName] || Activity;

  return (
    <div className="relative flex items-start gap-4 p-4 rounded-lg bg-white border border-slate-200 shadow-sm">
      {isAdmin && (
        <button
          onClick={handleDelete}
          className="absolute -top-3 -right-3 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-red-100 text-red-600 shadow-sm hover:bg-red-200 transition-colors"
          title="Delete Activity"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      )}
      <div className="rounded-full bg-[var(--primary)]/10 p-3 text-[var(--primary)]">
        <IconComponent className="h-5 w-5" />
      </div>
      <div className="flex-1 pr-4">
        <div className="flex items-center justify-between">
          <EditableText contentKey={`activity.${item.id}.title`} fallback={item.title} as="h4" className="font-semibold text-slate-900" label="Activity title" />
          <EditableText contentKey={`activity.${item.id}.time`} fallback={getRelativeTime(item.time)} as="span" className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded whitespace-nowrap" label="Activity time" />
        </div>
        <EditableText contentKey={`activity.${item.id}.description`} fallback={item.description} as="p" multiline className="text-sm text-slate-600 mt-1" label="Activity description" />
        <div className="mt-2 text-xs font-medium text-slate-400 uppercase tracking-wider">
          <EditableText contentKey={`activity.${item.id}.category`} fallback={item.category} as="span" label="Activity category" />
        </div>
      </div>
    </div>
  );
}
