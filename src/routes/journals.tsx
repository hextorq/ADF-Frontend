import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Globe2 } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";
import { SEO } from "@/components/SEO";
import { buildJournalSchema } from "@/lib/seo";

const JOURNALS = [
  {
    title: "International Journal of English for Academic Excellence",
    abbr: "IJEAE",
    issn: "Online ISSN — Forthcoming",
    scope: "Applied linguistics, academic writing, ELT, literature studies.",
    frequency: "Quarterly",
    access: "Open Access — CC BY 4.0",
    submitUrl: "https://ijeae.com/index.php/ijeae/submission",
    url: "https://ijeae.com/index.php/ijeae"
  },
];

export default function Journals() {
  const journalSchema = buildJournalSchema({
    title: JOURNALS[0].title,
    abbr: JOURNALS[0].abbr,
    issn: "Forthcoming",
    url: JOURNALS[0].url,
    description: JOURNALS[0].scope
  });

  return (
    <>
      <SEO
        title="Peer-Reviewed Open Access Journals | ADF — IJEAE"
        description="Discover open-access, double-blind peer-reviewed journals published by ADF, including the International Journal of English for Academic Excellence (IJEAE). Submit manuscripts online."
        keywords="academic journals, peer-reviewed journal, IJEAE, applied linguistics journal, ELT research, open access journal, double blind peer review, English for academic excellence"
        structuredData={journalSchema}
        citation={{
          journalTitle: "International Journal of English for Academic Excellence",
          issn: "Forthcoming",
        }}
      />

      <PageHeader
        cmsKey="page.journals"
        eyebrow="Journals"
        title="Peer-reviewed, open-access journals"
        description="Discoverable, citable, and globally accessible. Authors retain copyright under Creative Commons attribution (CC BY 4.0)."
        crumbs={[{ label: "Journals" }]}
      />

      <section className="py-16 bg-white">
        <div className="container-academic grid gap-6 lg:grid-cols-3">
          {[
            { icon: FileText, k: "Online ISSN", v: "Assigned per journal (Forthcoming)" },
            { icon: Globe2, k: "Access", v: "Open Access — CC BY 4.0" },
            { icon: CheckCircle2, k: "Review", v: "Double-blind peer review" },
          ].map(({ icon: Icon, k, v }) => (
            <div key={k} className="surface-card p-5 flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--primary)]/8 text-[var(--primary)]">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs uppercase tracking-wider text-[var(--ink-soft)]">{k}</div>
                <div className="font-semibold text-[var(--ink)]">{v}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-12 bg-[var(--secondary)]">
        <div className="container-academic">
          <div className="flex items-end justify-between">
            <EditableText contentKey="page.journals.browse.title" fallback="Browse Journals" as="h2" className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]" label="Section title" />
            <Link to="/guidelines/editor" className="btn-outline"><EditableText contentKey="page.journals.browse.editorialGuidelines" fallback="Editorial Guidelines" as="span" label="Button label" /> <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {JOURNALS.map((j) => (
              <article key={j.abbr} className="surface-card overflow-hidden group">
                <div className="hero-gradient p-5 text-white">
                  <div className="text-xs uppercase tracking-widest text-white/70">{j.abbr}</div>
                  <EditableText contentKey={`journal.${j.abbr}.title`} fallback={j.title} as="h3" className="mt-1 font-serif text-lg font-semibold leading-snug" label="Journal title" />
                </div>
                <div className="p-5 space-y-3">
                  <Row k="ISSN" v={j.issn} />
                  <Row k="Scope" v={j.scope} />
                  <Row k="Frequency" v={j.frequency} />
                  <Row k="Access" v={j.access} />
                  <div className="flex items-center gap-2 pt-3">
                    {j.submitUrl ? (
                      <a href={j.submitUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2 !text-sm">
                        <EditableText contentKey="page.journals.card.submit" fallback="Submit" as="span" label="Button label" />
                      </a>
                    ) : (
                      <Link to="/guidelines/author" className="btn-primary !py-2 !text-sm"><EditableText contentKey="page.journals.card.submit" fallback="Submit" as="span" label="Button label" /></Link>
                    )}
                    <Link to="/editorial-board" className="btn-outline !py-2 !text-sm"><EditableText contentKey="page.journals.card.editorialBoard" fallback="Editorial Board" as="span" label="Button label" /></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-academic surface-card p-8 md:p-12 grid md:grid-cols-3 gap-6 items-center">
          <div className="md:col-span-2">
            <div className="eyebrow"><BookOpen className="h-3.5 w-3.5" /> <EditableText contentKey="page.journals.editorCta.eyebrow" fallback="Editorial Guidelines" as="span" label="CTA eyebrow" /></div>
            <EditableText contentKey="page.journals.editorCta.title" fallback="Interested in joining the editorial board?" as="h3" className="mt-2 font-serif text-2xl font-bold text-[var(--ink)]" label="CTA title" />
            <EditableText contentKey="page.journals.editorCta.description" fallback="Review the editorial guidelines and requirements before applying." as="p" multiline className="mt-2 text-[var(--ink-soft)]" label="CTA description" />
          </div>
          <div className="flex md:justify-end gap-2 flex-wrap">
            <Link to="/guidelines/editor" className="btn-primary"><EditableText contentKey="page.journals.cta.editorialGuidelines" fallback="Editorial Guidelines" as="span" label="Button label" /></Link>
            <Link to="/contact" className="btn-outline"><EditableText contentKey="page.journals.cta.contactEditor" fallback="Contact Us" as="span" label="Button label" /></Link>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="grid grid-cols-3 gap-3 text-sm">
      <div className="text-[var(--ink-soft)] uppercase text-xs tracking-wider">{k}</div>
      <EditableText contentKey={`page.journals.row.${k}.${v}`} fallback={v} as="div" className="col-span-2 text-[var(--ink)]" label={k} />
    </div>
  );
}
