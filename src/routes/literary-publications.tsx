import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { BookHeart, Brush, Feather, Headphones, ScrollText, Sparkles } from "lucide-react";

const GENRES = [
  { icon: BookHeart, t: "Novels", d: "Long-form fiction across literary, commercial, and crossover." },
  { icon: ScrollText, t: "Novellas", d: "Short, focused fiction with print and digital release." },
  { icon: Feather, t: "Poetry", d: "Single-author collections and curated chapbooks." },
  { icon: Sparkles, t: "Short Stories", d: "Single-author and themed collections." },
  { icon: Headphones, t: "Anthologies", d: "Editor-curated volumes around themes or movements." },
  { icon: Brush, t: "Hybrid & Experimental", d: "Works that cross genre and form." },
];

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Literary Publications"
        title="Your story deserves to be published"
        description="Professional editing, cover design, ISBN assignment, and print + digital distribution for novelists, poets, and storytellers."
        crumbs={[{ label: "Literary Publications" }]}
      />

      <section className="py-16 bg-white">
        <div className="container-academic">
          <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]">Genres we publish</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GENRES.map(({ icon: Icon, t, d }) => (
              <div key={t} className="surface-card p-6 hover:border-[var(--primary)] transition">
                <Icon className="h-6 w-6 text-[var(--primary)]" />
                <h3 className="mt-3 font-serif text-lg font-semibold text-[var(--ink)]">{t}</h3>
                <p className="mt-1 text-sm text-[var(--ink-soft)]">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--secondary)]">
        <div className="container-academic grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="eyebrow">What you get</div>
            <h2 className="mt-2 font-serif text-3xl font-bold text-[var(--ink)]">A full author partnership</h2>
            <ul className="mt-6 space-y-3 text-[var(--ink-soft)]">
              {[
                "Manuscript appraisal and developmental notes",
                "Professional copyediting and proofreading",
                "Original cover design and interior typesetting",
                "ISBN assignment for print and digital editions",
                "Distribution through major online retailers",
                "Author-retained rights and transparent royalty terms",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span>{t}</li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <Link to="/contact" className="btn-primary">Publish your book</Link>
              <Link to="/guidelines/author" className="btn-outline">Submission guidelines</Link>
            </div>
          </div>
          <div className="surface-card p-8 bg-white">
            <div className="font-serif text-xl font-semibold text-[var(--ink)]">How submission works</div>
            <ol className="mt-5 space-y-4">
              {[
                "Send a query with synopsis and first 30 pages.",
                "Editorial team responds within 6 weeks.",
                "On acceptance, contract and production schedule.",
                "Editing → design → proofs → release.",
              ].map((t, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-white text-xs font-bold">{i + 1}</span>
                  <span className="text-[var(--ink-soft)] pt-0.5">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}



