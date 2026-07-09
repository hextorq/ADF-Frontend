import { PageHeader } from "@/components/site/PageHeader";
import { BookOpen } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";

export function GuidelinesPage({
  eyebrow,
  title,
  lead,
  sections,
  crumbs,
  actionCard,
  cmsKey,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  sections: { h: string; t: string }[];
  crumbs: { label: string }[];
  cmsKey?: string;
  actionCard?: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: React.ReactNode;
    secondaryAction?: React.ReactNode;
  };
}) {
  const key = cmsKey ?? `page.guidelines.${title}`;
  return (
    <>
      <PageHeader cmsKey={key} eyebrow={eyebrow} title={title} description={lead} crumbs={crumbs} />
      <section className="py-16 bg-white">
        <div className="container-academic grid lg:grid-cols-4 gap-8">
          <aside className="hidden lg:block">
            <div className="sticky top-32 surface-card p-4">
              <EditableText contentKey={`${key}.toc.title`} fallback="On this page" as="div" className="text-xs uppercase font-semibold tracking-wider text-[var(--ink-soft)]" label="Table of contents title" />
              <ul className="mt-3 space-y-2 text-sm">
                {sections.map((s, i) => (
                  <li key={i}>
                    <a href={`#s-${i}`} className="text-[var(--ink)] hover:text-[var(--primary)]">
                      <EditableText contentKey={`${key}.section.${i}.heading`} fallback={s.h} as="span" label="Section link" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="lg:col-span-3 space-y-8">
            {sections.map((s, i) => (
              <article id={`s-${i}`} key={i} className="surface-card p-6">
                <EditableText
                  contentKey={`${key}.section.${i}.heading`}
                  fallback={s.h}
                  as="h2"
                  className="font-serif text-xl font-semibold text-[var(--ink)]"
                  label="Section heading"
                />
                <EditableText
                  contentKey={`${key}.section.${i}.text`}
                  fallback={s.t}
                  as="p"
                  multiline
                  className="mt-2 text-[var(--ink-soft)] leading-relaxed"
                  label="Section text"
                />
              </article>
            ))}
          </div>
          {actionCard && (
            <div className="lg:col-span-4 mt-8">
              <div className="surface-card p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                <div className="space-y-2">
                  <div className="eyebrow flex items-center gap-2 text-[var(--primary)] font-bold text-xs tracking-wider uppercase mb-2">
                    <BookOpen className="h-4 w-4" />
                    <EditableText contentKey={`${key}.action.eyebrow`} fallback={actionCard.eyebrow} as="span" label="Action eyebrow" />
                  </div>
                  <EditableText
                    contentKey={`${key}.action.title`}
                    fallback={actionCard.title}
                    as="h3"
                    className="font-serif text-2xl font-bold text-[var(--ink)]"
                    label="Action title"
                  />
                  <EditableText
                    contentKey={`${key}.action.description`}
                    fallback={actionCard.description}
                    as="p"
                    multiline
                    className="text-[var(--ink-soft)]"
                    label="Action description"
                  />
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

