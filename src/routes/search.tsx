import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { Search, ArrowRight } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";
import { useContentStore } from "@/store/useContentStore";
import { SEO } from "@/components/SEO";

const SEARCH_INDEX = [
  { id: "j1", type: "journals", title: "International Journal of English for Academic Excellence", desc: "Applied linguistics, academic writing, ELT, literature studies.", url: "/journals" },
  { id: "j2", type: "journals", title: "ADF Journal of Multidisciplinary Research", desc: "Cross-disciplinary research across sciences, humanities, and management.", url: "/journals" },
  { id: "j3", type: "journals", title: "ADF Review of Education & Pedagogy", desc: "Education policy, classroom research, teacher education, EdTech.", url: "/journals" },
  { id: "c1", type: "chapters", title: "Convergence: Multidisciplinary Perspectives in Contemporary Research", desc: "A bi-monthly edited volume series. ISBN assigned, double-blind peer review, open access.", url: "/chapter-publications" },
  { id: "l1", type: "books", title: "Shadows of the Forgotten", desc: "A gripping mystery novel exploring the depths of human memory.", url: "/literary-publications" },
  { id: "l2", type: "books", title: "Echoes of the Silent Valley", desc: "A collection of contemporary poetry reflecting on nature and isolation.", url: "/literary-publications" },
  { id: "l3", type: "books", title: "The Modern Educator's Handbook", desc: "A comprehensive guide to innovative teaching methodologies.", url: "/literary-publications" },
  { id: "l4", type: "books", title: "Voices of Tomorrow", desc: "An anthology of short stories by emerging young writers.", url: "/literary-publications" },
  { id: "a1", type: "announcements", title: "ADF expands editorial board with 14 new international members", desc: "Welcoming scholars from 9 countries across humanities, sciences, and management.", url: "/announcements" },
  { id: "a2", type: "announcements", title: "All ADF journals adopt CC BY 4.0 by default", desc: "Authors retain copyright; readers gain unrestricted access worldwide.", url: "/announcements" },
];

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const getContent = useContentStore((s) => s.getContent);
  const q = searchParams.get("q") ?? "";
  const scope = searchParams.get("scope") ?? "all";

  const query = q.toLowerCase().trim();
  const searchIndex = SEARCH_INDEX.map((item) => ({
    ...item,
    title: getContent(`search.${item.id}.title`, item.title),
    desc: getContent(`search.${item.id}.description`, item.desc),
  }));

  const results = searchIndex.filter((item) => {
    if (scope !== "all" && item.type !== scope) return false;
    if (!query) return true;
    return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
  });

  const pageTitle = query ? `Results for "${q}" | Search ADF` : "Search Publications & Research | Academic Development Forum";

  return (
    <>
      <SEO
        title={pageTitle}
        description="Search across ADF research articles, published books, book chapters, literary works, and academic programmes."
        noindex={true}
        nofollow={false}
      />
      <PageHeader
        cmsKey="page.search"
        eyebrow="Search"
        title={query ? `Results for "${q}"` : "Search"}
        description={query ? `Found ${results.length} matches across our publications.` : "Browse all publications, journals, and announcements."}
        crumbs={[{ label: "Search Results" }]}
      />

      <section className="py-16 bg-white min-h-[50vh]">
        <div className="container-academic max-w-3xl space-y-6">
          
          {/* Search bar inside page for refinement */}
          <div className="surface-card p-4 flex items-center gap-3">
            <Search className="h-5 w-5 text-[var(--primary)]" />
            <EditableText contentKey="page.search.scopeLabel" fallback="Search Scope:" as="span" className="text-sm font-semibold text-[var(--ink)]" label="Search label" />
            <span className="text-sm text-[var(--ink-soft)] px-3 py-1 rounded-full bg-[var(--secondary)]">
              {scope === "all" ? "All Publications" : scope.charAt(0).toUpperCase() + scope.slice(1)}
            </span>
          </div>

          {/* Results list */}
          {results.length === 0 ? (
            <div className="surface-card p-12 text-center text-[var(--ink-soft)]">
              <p className="text-lg">No publications found matching your query.</p>
              <Link to="/journals" className="btn-primary mt-4 inline-flex">Browse Journals</Link>
            </div>
          ) : (
            <div className="divide-y divide-border surface-card overflow-hidden">
              {results.map((r) => (
                <article key={r.id} className="p-5 hover:bg-slate-50 transition flex items-start justify-between gap-4">
                  <div>
                    <span className="text-xs uppercase font-semibold text-[var(--primary)] tracking-wider">{r.type}</span>
                    <h3 className="font-serif text-lg font-semibold text-[var(--ink)] mt-1">{r.title}</h3>
                    <p className="text-sm text-[var(--ink-soft)] mt-1">{r.desc}</p>
                  </div>
                  <Link to={r.url} className="btn-outline !py-1.5 !px-3 !text-xs shrink-0 self-center inline-flex items-center gap-1">
                    View <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
