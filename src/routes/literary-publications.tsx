import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { BookHeart, BookOpen, Brush, Feather, Headphones, ScrollText, PenLine } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";

const GENRES = [
  { icon: BookHeart, t: "Novels", d: "Long-form fiction across literary, commercial, and crossover." },
  { icon: ScrollText, t: "Novellas", d: "Short, focused fiction with print and digital release." },
  { icon: Feather, t: "Poetry", d: "Single-author collections and curated chapbooks." },
  { icon: PenLine, t: "Short Stories", d: "Single-author and themed collections." },
  { icon: Headphones, t: "Anthologies", d: "Editor-curated volumes around themes or movements." },
  { icon: Brush, t: "Hybrid & Experimental", d: "Works that cross genre and form." },
];

export default function Page() {
  return (
    <>
      <PageHeader
        cmsKey="page.literary-publications"
        eyebrow="Literary Publications"
        title="Your story deserves to be published"
        description="Professional editing, cover design, ISBN assignment, and print + digital distribution for novelists, poets, and storytellers."
        crumbs={[{ label: "Literary Publications" }]}
      />

      {/* Featured Campaign Banner: Art, Dreams & Fusion - Volume I */}
      <section className="bg-gradient-to-r from-[#eef2ff] via-[#f7f9ff] to-[#f0fdf4] border-y border-indigo-200 py-6">
        <div className="container-academic flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] shrink-0 hidden sm:block">
              <BookOpen className="h-6 w-6" />
            </div>
            <div>
              <h2 className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]">
                Art, Dreams & Fusion — Volume I
              </h2>
              <p className="text-[var(--ink-soft)] text-xs sm:text-sm mt-1 max-w-2xl">
                An Anthology Celebrating Everyday Voices. Welcoming Short Stories, Poems, Drawings, Photographs, Quotes & Essays. Deadline: 20 September 2026.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
            <Link
              to="/literary-publications/submit?campaign=art-dreams-fusion-vol-1"
              className="btn-primary text-xs sm:text-sm font-semibold !py-2.5 !px-5 !rounded-xl text-center flex-1 md:flex-initial shadow-sm"
            >
              Submit to Anthology (Free)
            </Link>
            <Link
              to="/#adf-first-call"
              className="btn-outline text-xs sm:text-sm font-medium !py-2.5 !px-4 !rounded-xl text-center"
            >
              View Call Details
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-academic">
          <EditableText contentKey="page.literary-publications.genres.title" fallback="Genres we publish" as="h2" className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]" label="Section title" />
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GENRES.map(({ icon: Icon, t, d }) => (
              <div key={t} className="surface-card p-6 hover:border-[var(--primary)] transition">
                <Icon className="h-6 w-6 text-[var(--primary)]" />
                <EditableText contentKey={`page.literary-publications.genre.${t}.title`} fallback={t} as="h3" className="mt-3 font-serif text-lg font-semibold text-[var(--ink)]" label="Genre title" />
                <EditableText contentKey={`page.literary-publications.genre.${t}.desc`} fallback={d} as="p" multiline className="mt-1 text-sm text-[var(--ink-soft)]" label="Genre description" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-[var(--secondary)]">
        <div className="container-academic grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <EditableText contentKey="page.literary-publications.benefits.eyebrow" fallback="What you get" as="div" className="eyebrow" label="Section eyebrow" />
            <EditableText contentKey="page.literary-publications.benefits.title" fallback="A full author partnership" as="h2" className="mt-2 font-serif text-3xl font-bold text-[var(--ink)]" label="Section title" />
            <ul className="mt-6 space-y-3 text-[var(--ink-soft)]">
              {[
                "Manuscript appraisal and developmental notes",
                "Professional copyediting and proofreading",
                "Original cover design and interior typesetting",
                "ISBN assignment for print and digital editions",
                "Distribution through major online retailers",
                "Author-retained rights and transparent royalty terms",
              ].map((t) => (
                <li key={t} className="flex gap-3"><span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)]"></span><EditableText contentKey={`page.literary-publications.benefit.${t}`} fallback={t} as="span" label="Benefit" /></li>
              ))}
            </ul>
            <div className="mt-6 flex gap-3">
              <Link to="/literary-publications/submit" className="btn-primary"><EditableText contentKey="page.literary-publications.cta.publish" fallback="Publish your book" as="span" label="CTA label" /></Link>
              <Link to="/guidelines/author" className="btn-outline"><EditableText contentKey="page.literary-publications.cta.guidelines" fallback="Submission guidelines" as="span" label="CTA label" /></Link>
            </div>
          </div>
          <div className="surface-card p-8 bg-white">
            <EditableText contentKey="page.literary-publications.process.title" fallback="How submission works" as="div" className="font-serif text-xl font-semibold text-[var(--ink)]" label="Process title" />
            <ol className="mt-5 space-y-4">
              {[
                "Send a query with synopsis and first 30 pages.",
                "Editorial team responds within 6 weeks.",
                "On acceptance, contract and production schedule.",
                "Editing → design → proofs → release.",
              ].map((t, i) => (
                <li key={i} className="flex gap-4">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[var(--primary)] text-white text-xs font-bold">{i + 1}</span>
                  <EditableText contentKey={`page.literary-publications.process.${i + 1}`} fallback={t} as="span" className="text-[var(--ink-soft)] pt-0.5" label="Process step" />
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    </>
  );
}



