import { PageHeader } from "@/components/site/PageHeader";
import { useEffect, useMemo, useState } from "react";
import { CalendarDays, Clock, MapPin, User, Users, X, Trash2, Edit } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";
import { useAuthStore } from "@/store/useAuthStore";
import { Link } from "react-router-dom";

type Event = {
  id: number;
  date: string;
  title: string;
  type: string;
  duration: string;
  speaker: string;
  mode: string;
  seats: number;
  google_form_url: string;
};

export default function Page() {
  return (
    <>
      <PageHeader
        cmsKey="page.academic-programmes"
        eyebrow="Academic Programmes"
        title="Nurture your academic mind"
        description="FDPs, workshops, training, and webinars on research methodology, academic writing, and publication ethics."
        crumbs={[{ label: "Academic Programmes" }]}
      />
      <UpcomingCalendar />
    </>
  );
}

function UpcomingCalendar() {
  const isAdmin = useAuthStore(s => s.isAdmin);
  const [localEvents, setLocalEvents] = useState<Event[]>([]);
  const [month, setMonth] = useState(() => new Date()); // Default to current month
  const [open, setOpen] = useState<Event | null>(null);

  useEffect(() => {
    fetch("/api/programmes")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setLocalEvents(data);
      })
      .catch(console.error);
  }, []);

  const { weeks, eventsByDay } = useMemo(() => {
    const first = new Date(month.getFullYear(), month.getMonth(), 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    const cells: (number | null)[] = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks: (number | null)[][] = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

    const map: Record<number, Event[]> = {};
    for (const e of localEvents) {
      const d = new Date(e.date);
      if (d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()) {
        const k = d.getDate();
        (map[k] ||= []).push(e);
      }
    }
    return { weeks, eventsByDay: map };
  }, [month, localEvents]);

  const monthLabel = month.toLocaleString("en-US", { month: "long", year: "numeric" });

  return (
    <section className="py-16 bg-white">
      <div className="container-academic grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 surface-card p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[var(--ink)]">{monthLabel}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() - 1, 1))}
                className="btn-outline !py-1.5 !px-3 !text-xs"
              ><EditableText contentKey="page.academic-programmes.calendar.previous" fallback="Previous" as="span" label="Calendar button" /></button>
              <button
                onClick={() => setMonth(new Date(month.getFullYear(), month.getMonth() + 1, 1))}
                className="btn-outline !py-1.5 !px-3 !text-xs"
              ><EditableText contentKey="page.academic-programmes.calendar.next" fallback="Next" as="span" label="Calendar button" /></button>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden text-sm">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="bg-[var(--secondary)] py-2 text-center text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">
                {d}
              </div>
            ))}
            {weeks.flat().map((d, i) => {
              const evs = d ? eventsByDay[d] || [] : [];
              return (
                <div key={i} className="bg-white min-h-[92px] p-2 flex flex-col">
                  <span className="text-xs font-medium text-[var(--ink-soft)]">{d ?? ""}</span>
                  <div className="mt-1 flex flex-col gap-1">
                    {evs.map((e, evId) => (
                      <button
                        key={`${e.id}-${evId}`}
                        onClick={() => setOpen(e)}
                        className="text-left text-[11px] rounded bg-[var(--primary)]/10 text-[var(--primary)] px-1.5 py-1 hover:bg-[var(--primary)] hover:text-white truncate"
                      >
                        {e.title}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-3">
          <div className="flex items-center justify-between">
            <EditableText contentKey="page.academic-programmes.events.title" fallback="Upcoming Events" as="h3" className="font-serif text-xl font-semibold text-[var(--ink)]" label="Events section title" />
            {isAdmin && (
              <Link
                to="/admin/programmes"
                className="btn-primary !py-1 !px-2 text-xs"
              >
                Manage
              </Link>
            )}
          </div>
          {localEvents.length === 0 && (
            <div className="text-sm text-slate-500 py-4">No upcoming events scheduled.</div>
          )}
          {localEvents.map((e) => (
            <div key={e.id} className="relative">
              {isAdmin && (
                <Link
                  to="/admin/programmes"
                  className="absolute -top-2 -right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm hover:bg-blue-200 transition-colors"
                  title="Manage Events"
                >
                  <Edit className="h-3 w-3" />
                </Link>
              )}
              <button onClick={() => setOpen(e)} className="w-full text-left surface-card p-4 hover:border-[var(--primary)] transition">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-[var(--accent)]/15 text-[var(--accent)] px-2 py-0.5 font-semibold">{e.type}</span>
                <span className="text-[var(--ink-soft)]">{new Date(e.date).toLocaleDateString()}</span>
              </div>
              <div className="mt-2 font-semibold text-[var(--ink)]">{e.title}</div>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink-soft)]">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> {e.duration}</span>
                <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> {e.speaker}</span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {e.mode}</span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> {e.seats} seats</span>
              </div>
            </button>
            </div>
          ))}
        </aside>
      </div>

      {open && <RegisterModal event={open} onClose={() => setOpen(null)} />}
    </section>
  );
}

function RegisterModal({ event, onClose }: { event: Event; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--deep)]/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg surface-card !rounded-xl bg-white p-6 relative">
        <button onClick={onClose} className="absolute right-4 top-4 text-[var(--ink-soft)] hover:text-[var(--ink)]">
          <X className="h-5 w-5" />
        </button>
        <div className="text-xs uppercase tracking-wider text-[var(--primary)] font-semibold">{event.type}</div>
        <h3 className="mt-1 font-serif text-2xl font-bold text-[var(--ink)]">{event.title}</h3>
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--ink-soft)]">
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> {new Date(event.date).toLocaleDateString()}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {event.duration}</span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {event.mode}</span>
        </div>
        <div className="mt-6">
          {event.google_form_url ? (
            <a
              href={event.google_form_url}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary w-full justify-center flex"
              onClick={onClose}
            >
              <EditableText contentKey="page.academic-programmes.register" fallback="Register via Google Form" as="span" label="Register label" />
            </a>
          ) : (
            <button disabled className="btn-primary w-full justify-center flex opacity-50 cursor-not-allowed">
              Registration Closed / Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
}




