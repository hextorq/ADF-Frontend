import { PageHeader } from "@/components/site/PageHeader";
import { BookOpen } from "lucide-react";

export function GuidelinesPage({
  eyebrow,
  title,
  lead,
  sections,
  crumbs,
  actionCard,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  sections: { h: string; t: string }[];
  crumbs: { label: string }[];
  actionCard?: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: React.ReactNode;
    secondaryAction?: React.ReactNode;
  };
}) {
  return (
    <>
      <PageHeader eyebrow={eyebrow} title={title} description={lead} crumbs={crumbs} />
      <section className="py-16 bg-white">
        <div className="container-academic grid lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-32 surface-card p-4">
              <div className="text-xs uppercase font-semibold tracking-wider text-[var(--ink-soft)]">On this page</div>
              <ul className="mt-3 space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={i}><a href={`#s-${i}`} className="text-[var(--ink)] hover:text-[var(--primary)]">{s.h}</a></li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="lg:col-span-3 space-y-8">
            {sections.map((s, i) => (
              <article id={`s-${i}`} key={i} className="surface-card p-6">
                <h2 className="font-serif text-xl font-semibold text-[var(--ink)]">{s.h}</h2>
                <p className="mt-2 text-[var(--ink-soft)] leading-relaxed">{s.t}</p>
              </article>
            ))}
          </div>
          {actionCard && (
            <div className="lg:col-span-4 mt-8">
              <div className="surface-card p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                  <div className="eyebrow flex items-center gap-2 text-[var(--primary)] font-bold text-xs tracking-wider uppercase mb-2">
                    <BookOpen className="h-4 w-4" /> {actionCard.eyebrow}
                  </div>
                  <h3 className="font-serif text-2xl font-bold text-[var(--ink)]">{actionCard.title}</h3>
                  <p className="text-[var(--ink-soft)]">{actionCard.description}</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
                  {actionCard.primaryAction}
                  {actionCard.secondaryAction}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

