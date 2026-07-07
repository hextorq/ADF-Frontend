import { Link, useSearchParams } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { Search, ArrowRight } from "lucide-react";

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
  const q = searchParams.get("q") ?? "";
  const scope = searchParams.get("scope") ?? "all";

  const query = q.toLowerCase().trim();
  const results = SEARCH_INDEX.filter((item) => {
    if (scope !== "all" && item.type !== scope) return false;
    if (!query) return true;
    return item.title.toLowerCase().includes(query) || item.desc.toLowerCase().includes(query);
  });

  return (
    <>
      <PageHeader
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
            <span className="text-sm font-semibold text-[var(--ink)]">Search Scope:</span>
            <span className="text-sm text-[var(--ink-soft)] px-3 py-1 rounded-full bg-[var(--secondary)]">
              {scope === "all" ? "All Publications" : scope.charAt(0).toUpperCase() + scope.slice(1)}
            </span>
          </div>

          <div className="space-y-4">
            {results.length > 0 ? (
              results.map((r) => (
                <div key={r.id} className="surface-card p-6 flex flex-col items-start hover:border-[var(--primary)] transition">
                  <div className="inline-block px-2 py-1 rounded bg-[var(--secondary)] text-[var(--primary)] text-[10px] font-bold uppercase tracking-wider mb-3">
                    {r.type}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[var(--ink)]">
                    {r.title}
                  </h3>
                  <p className="mt-2 text-[var(--ink-soft)] text-sm">
                    {r.desc}
                  </p>
                  <Link to={r.url} className="mt-4 inline-flex items-center gap-1 font-semibold text-sm text-[var(--primary)] hover:underline">
                    View details <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))
            ) : (
              <div className="py-12 text-center">
                <Search className="h-10 w-10 text-[var(--ink-soft)] mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold text-[var(--ink)]">No results found</h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  We couldn't find any exact matches for "{q}". Try using different keywords or changing your search scope.
                </p>
                <Link to="/search" className="mt-6 inline-block btn-outline">
                  Clear search
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}




