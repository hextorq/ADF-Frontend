import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { ArrowRight, BookOpen, CheckCircle2, FileText, Globe2 } from "lucide-react";

const JOURNALS = [
  {
    title: "International Journal of English for Academic Excellence",
    abbr: "IJEAE",
    issn: "Online ISSN · Forthcoming",
    scope: "Applied linguistics, academic writing, ELT, literature studies.",
    frequency: "Quarterly",
    access: "Open Access · CC BY 4.0",
  },
  {
    title: "ADF Journal of Multidisciplinary Research",
    abbr: "AJMR",
    issn: "Online ISSN · Forthcoming",
    scope: "Cross-disciplinary research across sciences, humanities, and management.",
    frequency: "Bi-annual",
    access: "Open Access · CC BY 4.0",
  },
  {
    title: "ADF Review of Education & Pedagogy",
    abbr: "AREP",
    issn: "Coming 2026",
    scope: "Education policy, classroom research, teacher education, EdTech.",
    frequency: "Bi-annual",
    access: "Open Access · CC BY 4.0",
  },
];

export default function Journals() {
  return (
    <>
      <PageHeader
        eyebrow="Journals"
        title="Peer-reviewed, open-access journals"
        description="Discoverable, citable, and globally accessible. Authors retain copyright."
        crumbs={[{ label: "Journals" }]}
      />

      <section className="py-16 bg-white">
        <div className="container-academic grid gap-6 lg:grid-cols-3">
          {[
            { icon: FileText, k: "Online ISSN", v: "Assigned per journal" },
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
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]">Browse Journals</h2>
            <Link to="/guidelines/author" className="btn-outline">Author Guidelines <ArrowRight className="h-4 w-4" /></Link>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {JOURNALS.map((j) => (
              <article key={j.abbr} className="surface-card overflow-hidden group">
                <div className="hero-gradient p-5 text-white">
                  <div className="text-xs uppercase tracking-widest text-white/70">{j.abbr}</div>
                  <h3 className="mt-1 font-serif text-lg font-semibold leading-snug">{j.title}</h3>
                </div>
                <div className="p-5 space-y-3">
                  <Row k="ISSN" v={j.issn} />
                  <Row k="Scope" v={j.scope} />
                  <Row k="Frequency" v={j.frequency} />
                  <Row k="Access" v={j.access} />
                  <div className="flex items-center gap-2 pt-3">
                    <Link to="/guidelines/author" className="btn-primary !py-2 !text-sm">Submit</Link>
                    <Link to="/editorial-board" className="btn-outline !py-2 !text-sm">Editorial Board</Link>
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
            <div className="eyebrow"><BookOpen className="h-3.5 w-3.5" /> For Authors</div>
            <h3 className="mt-2 font-serif text-2xl font-bold text-[var(--ink)]">
              Ready to submit your manuscript?
            </h3>
            <p className="mt-2 text-[var(--ink-soft)]">
              Review the author guidelines and submission checklist before you upload.
            </p>
          </div>
          <div className="flex md:justify-end gap-2 flex-wrap">
            <Link to="/guidelines/author" className="btn-primary">Author Guidelines</Link>
            <Link to="/contact" className="btn-outline">Contact Editor</Link>
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
      <div className="col-span-2 text-[var(--ink)]">{v}</div>
    </div>
  );
}



