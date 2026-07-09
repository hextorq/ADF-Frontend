import { PageHeader } from "@/components/site/PageHeader";
import { useMemo, useState } from "react";
import { CalendarDays, Clock, MapPin, User, Users, X } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";

type Event = {
  date: string; // YYYY-MM-DD
  title: string;
  type: "FDP" | "Workshop" | "Training" | "Webinar";
  duration: string;
  speaker: string;
  mode: "Online" | "Hybrid" | "On-campus";
  seats: number;
};

const EVENTS: Event[] = [
  { date: "2026-07-08", title: "Webinar: Avoiding Predatory Journals", type: "Webinar", duration: "90 min", speaker: "Dr. Anjali Rao", mode: "Online", seats: 480 },
  { date: "2026-07-15", title: "Workshop on Academic Writing", type: "Workshop", duration: "1 day", speaker: "Prof. Imran Sheikh", mode: "Online", seats: 120 },
  { date: "2026-07-22", title: "FDP on Research Methodology", type: "FDP", duration: "3 days", speaker: "Multiple Faculty", mode: "Hybrid", seats: 200 },
  { date: "2026-08-05", title: "Training: SPSS for Beginners", type: "Training", duration: "2 days", speaker: "Dr. Meera Patel", mode: "Online", seats: 80 },
  { date: "2026-08-19", title: "Workshop on Publication Ethics", type: "Workshop", duration: "1 day", speaker: "Dr. Saira Khan", mode: "Online", seats: 150 },
];

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
  const [month, setMonth] = useState(() => new Date(2026, 6, 1)); // July 2026
  const [open, setOpen] = useState<Event | null>(null);

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
    for (const e of EVENTS) {
      const d = new Date(e.date);
      if (d.getFullYear() === month.getFullYear() && d.getMonth() === month.getMonth()) {
        const k = d.getDate();
        (map[k] ||= []).push(e);
      }
    }
    return { weeks, eventsByDay: map };
  }, [month]);

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
                    {evs.map((e) => (
                      <button
                        key={e.title}
                        onClick={() => setOpen(e)}
                        className="text-left text-[11px] rounded bg-[var(--primary)]/10 text-[var(--primary)] px-1.5 py-1 hover:bg-[var(--primary)] hover:text-white truncate"
                      >
                        <EditableText contentKey={`event.${e.date}.calendarTitle`} fallback={e.title} as="span" label="Calendar event" />
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="space-y-3">
          <EditableText contentKey="page.academic-programmes.events.title" fallback="Upcoming Events" as="h3" className="font-serif text-xl font-semibold text-[var(--ink)]" label="Events section title" />
          {EVENTS.map((e) => (
            <button key={e.title} onClick={() => setOpen(e)} className="w-full text-left surface-card p-4 hover:border-[var(--primary)] transition">
              <div className="flex items-center justify-between text-xs">
                <span className="rounded-full bg-[var(--accent)]/15 text-[var(--accent)] px-2 py-0.5 font-semibold">{e.type}</span>
                <span className="text-[var(--ink-soft)]">{e.date}</span>
              </div>
              <EditableText contentKey={`event.${e.date}.title`} fallback={e.title} as="div" className="mt-2 font-semibold text-[var(--ink)]" label="Event title" />
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--ink-soft)]">
                <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> <EditableText contentKey={`event.${e.date}.duration`} fallback={e.duration} as="span" label="Event duration" /></span>
                <span className="inline-flex items-center gap-1"><User className="h-3 w-3" /> <EditableText contentKey={`event.${e.date}.speaker`} fallback={e.speaker} as="span" label="Event speaker" /></span>
                <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> <EditableText contentKey={`event.${e.date}.mode`} fallback={e.mode} as="span" label="Event mode" /></span>
                <span className="inline-flex items-center gap-1"><Users className="h-3 w-3" /> <EditableText contentKey={`event.${e.date}.seats`} fallback={`${e.seats} seats`} as="span" label="Event seats" /></span>
              </div>
            </button>
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
        <EditableText contentKey={`event.${event.date}.title`} fallback={event.title} as="h3" className="mt-1 font-serif text-2xl font-bold text-[var(--ink)]" label="Event title" />
        <div className="mt-3 flex flex-wrap gap-3 text-xs text-[var(--ink-soft)]">
          <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" /> <EditableText contentKey={`event.${event.date}.date`} fallback={event.date} as="span" label="Event date" /></span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> <EditableText contentKey={`event.${event.date}.duration`} fallback={event.duration} as="span" label="Event duration" /></span>
          <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> <EditableText contentKey={`event.${event.date}.mode`} fallback={event.mode} as="span" label="Event mode" /></span>
        </div>
        <div className="mt-6">
          <a
            href="https://forms.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full justify-center flex"
            onClick={onClose}
          >
            <EditableText contentKey="page.academic-programmes.register" fallback="Register via Google Form" as="span" label="Register label" />
          </a>
        </div>
      </div>
    </div>
  );
}



