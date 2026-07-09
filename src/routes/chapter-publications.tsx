import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { CheckCircle2 } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";

const STEPS = [
  { n: "01", t: "Call announced", d: "Theme published with submission window and editor contacts." },
  { n: "02", t: "Chapter submission", d: "Authors upload full chapter following the ADF template." },
  { n: "03", t: "Double-blind review", d: "Two independent reviewers assess each chapter." },
  { n: "04", t: "Revisions & acceptance", d: "Authors revise; editors confirm acceptance." },
  { n: "05", t: "Production & ISBN", d: "Copyediting, typesetting, and ISBN assignment." },
  { n: "06", t: "Open access release", d: "Volume published online and in print." },
];

export default function Page() {
  return (
    <>
      <PageHeader
        cmsKey="page.chapter-publications"
        eyebrow="Convergence Series"
        title="Chapter Publications — Multidisciplinary Perspectives in Contemporary Research"
        description="A bi-monthly edited volume series. ISBN assigned, double-blind peer review, open access."
        crumbs={[{ label: "Chapter Publications" }]}
      />

      <section className="py-16 bg-white">
        <div className="container-academic grid lg:grid-cols-3 gap-6">
          {[
            { t: "ISBN Assigned", d: "Every volume receives a standard ISBN." },
            { t: "Double-Blind Peer Review", d: "Two reviewers per chapter, identities concealed." },
            { t: "Open Access", d: "CC BY 4.0 licensing by default." },
          ].map((it) => (
            <div key={it.t} className="surface-card p-6">
              <CheckCircle2 className="h-6 w-6 text-[var(--accent)]" />
              <EditableText contentKey={`page.chapter-publications.feature.${it.t}.title`} fallback={it.t} as="h3" className="mt-3 font-serif text-lg font-semibold text-[var(--ink)]" label="Feature title" />
              <EditableText contentKey={`page.chapter-publications.feature.${it.t}.desc`} fallback={it.d} as="p" multiline className="mt-1 text-sm text-[var(--ink-soft)]" label="Feature description" />
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 bg-[var(--secondary)]">
        <div className="container-academic">
          <EditableText contentKey="page.chapter-publications.workflow.title" fallback="Submission Workflow" as="h2" className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]" label="Workflow title" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="surface-card p-5">
                <div className="font-serif text-3xl font-bold text-[var(--primary)]">{s.n}</div>
                <EditableText contentKey={`page.chapter-publications.workflow.${s.n}.title`} fallback={s.t} as="div" className="mt-2 font-semibold text-[var(--ink)]" label="Workflow step title" />
                <EditableText contentKey={`page.chapter-publications.workflow.${s.n}.desc`} fallback={s.d} as="div" multiline className="mt-1 text-sm text-[var(--ink-soft)]" label="Workflow step description" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-academic surface-card p-8 md:p-12 hero-gradient text-white border-transparent">
          <EditableText contentKey="page.chapter-publications.cta.title" fallback="Submit a Chapter to Convergence Vol. IV" as="h3" className="font-serif text-2xl font-bold" label="CTA title" />
          <EditableText contentKey="page.chapter-publications.cta.description" fallback="Open call - Closes 15 Sep 2026. Themes across sciences, humanities, social sciences, education, and management." as="p" multiline className="mt-2 text-white/80 max-w-2xl" label="CTA description" />
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/guidelines/author" className="inline-flex items-center gap-2 rounded-md bg-[var(--mint)] px-5 py-3 text-sm font-semibold text-[var(--deep)] hover:bg-white">
              Submit your chapter
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">
              Contact editor
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}



