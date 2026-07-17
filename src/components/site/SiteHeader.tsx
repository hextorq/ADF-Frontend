import { Link, NavLink as RouterNavLink, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, Search, X, Youtube, Linkedin, Instagram } from "lucide-react";
import { EditableImage, EditableText } from "@/components/cms/EditableText";

type NavChild = { key: string; label: string; to: string };
type NavItem = {
  key: string;
  label: string;
  to?: string;
  children?: NavChild[];
};

const NAV: NavItem[] = [
  { key: "home", label: "Home", to: "/" },
  { key: "about", label: "About Us", to: "/about" },
  { key: "journals", label: "Journals", to: "/journals" },
  { key: "chapter-publications", label: "Chapter Publications", to: "/chapter-publications" },
  { key: "literary-publications", label: "Literary Publications", to: "/literary-publications" },
  { key: "bookstore", label: "Book Store", to: "/bookstore" },
  { key: "academic-programmes", label: "Academic Programmes", to: "/academic-programmes" },
  {
    key: "guidelines",
    label: "Guidelines",
    children: [
      { key: "guidelines.author", label: "Author Guidelines", to: "/guidelines/author" },
      { key: "guidelines.reviewer", label: "Reviewer Guidelines", to: "/guidelines/reviewer" },
      { key: "guidelines.editor", label: "Editor Guidelines", to: "/guidelines/editor" },
    ],
  },
  { key: "editorial-board", label: "Editorial Board", to: "/editorial-board" },
  { key: "policies", label: "Policies", to: "/policies" },
  { key: "contact", label: "Contact Us", to: "/contact" },
];

function navLabelKey(key: string) {
  return `nav.item.${key}.label`;
}

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Top utility strip */}
      <div className="hidden md:block bg-[var(--deep)] text-white/80 text-xs">
        <div className="container-academic flex items-center justify-between py-2">
          <EditableText contentKey="header.utility.tagline" fallback="International Academic Publication House - ISSN - ISBN - DOI" as="span" className="tracking-wide" label="Header tagline" />
          <div className="flex items-center gap-5">
            <Link to="/guidelines/author" className="hover:text-white"><EditableText contentKey="header.utility.authors" fallback="For Authors" as="span" label="Header link" /></Link>
            <Link to="/guidelines/reviewer" className="hover:text-white"><EditableText contentKey="header.utility.reviewers" fallback="For Reviewers" as="span" label="Header link" /></Link>
            <Link to="/editorial-board" className="hover:text-white"><EditableText contentKey="header.utility.board" fallback="Editorial Board" as="span" label="Header link" /></Link>
            <div className="h-3 w-px bg-white/20" />
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@adf_publisher" target="_blank" rel="noopener noreferrer" className="hover:text-[#ff0000] transition-colors" aria-label="ADF Publisher YouTube Channel">
                <Youtube className="h-4 w-4" />
              </a>
              <a href="https://www.linkedin.com/in/academic-development-forum-adf-8a4651418" target="_blank" rel="noopener noreferrer" className="hover:text-[#0077b5] transition-colors" aria-label="ADF LinkedIn Profile">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="https://www.instagram.com/adf_publisher" target="_blank" rel="noopener noreferrer" className="hover:text-[#E1306C] transition-colors" aria-label="ADF Instagram Profile">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-40 w-full border-b border-border bg-white/95 backdrop-blur transition-shadow ${
          scrolled ? "shadow-[0_4px_20px_-12px_rgba(7,26,140,0.25)]" : ""
        }`}
      >
        <div className="container-academic flex items-center gap-6 py-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <Logo />
            <div className="leading-tight">
              <div className="font-serif text-[1.05rem] font-bold text-[var(--primary)]">
                <EditableText contentKey="header.brand.name" fallback="Academic Development Forum" as="span" label="Header brand" />
              </div>
              <div className="text-[0.7rem] uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                <EditableText contentKey="header.brand.tagline" fallback="Attitude Defines Future" as="span" label="Header tagline" />
              </div>
            </div>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => setSearchOpen((v) => !v)}
              className="btn-primary !py-2 !px-4 !text-sm"
              aria-label="Search publications"
            >
              <Search className="h-4 w-4" />
              <EditableText contentKey="header.search.button" fallback="Search Publications" as="span" label="Search button" />
            </button>
            <button
              className="lg:hidden inline-flex items-center justify-center rounded-md border border-border p-2"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Primary nav */}
        <nav className="hidden lg:block border-t border-border bg-white">
          <div className="container-academic flex items-center gap-1">
            {NAV.map((item) => (
              <NavLink key={item.key} item={item} />
            ))}
          </div>
        </nav>

        {/* Search dropdown */}
        {searchOpen && <SearchPanel onClose={() => setSearchOpen(false)} />}

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="lg:hidden border-t border-border bg-white">
            <div className="container-academic py-3 flex flex-col">
              {NAV.map((item) =>
                item.children ? (
                  <details key={item.key} className="group py-1">
                    <summary className="flex cursor-pointer items-center justify-between py-2 text-sm font-medium">
                      <EditableText contentKey={navLabelKey(item.key)} fallback={item.label} as="span" label="Nav Label" />
                      <ChevronDown className="h-4 w-4 transition group-open:rotate-180" />
                    </summary>
                    <div className="pl-3 pb-2 flex flex-col gap-1">
                      {item.children.map((c) => (
                        <Link
                          key={c.to}
                          to={c.to}
                          onClick={() => setMobileOpen(false)}
                          className="text-sm py-1.5 text-[var(--ink-soft)]"
                        >
                          <EditableText contentKey={navLabelKey(c.key)} fallback={c.label} as="span" label="Nav Label" />
                        </Link>
                      ))}
                    </div>
                  </details>
                ) : (
                  <Link
                    key={item.key}
                    to={item.to!}
                    onClick={() => setMobileOpen(false)}
                    className="py-2 text-sm font-medium border-b border-border last:border-0"
                  >
                    <EditableText contentKey={navLabelKey(item.key)} fallback={item.label} as="span" label="Nav Label" />
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  if (item.children) {
    return (
      <div
        ref={ref}
        className="relative flex items-stretch"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <span
          role="button"
          tabIndex={0}
          className="flex items-center gap-1 px-3 py-3 text-sm font-medium text-[var(--ink)] hover:text-[var(--primary)] whitespace-nowrap cursor-pointer"
        >
          <EditableText contentKey={navLabelKey(item.key)} fallback={item.label} as="span" label="Nav Label" /> <ChevronDown className="h-3.5 w-3.5" />
        </span>
        {open && (
          <div className="absolute left-0 top-full z-30 min-w-[230px] surface-card !rounded-md py-2">
            {item.children.map((c) => (
              <Link
                key={c.to}
                to={c.to}
                className="block px-4 py-2 text-sm text-[var(--ink)] hover:bg-[var(--secondary)] hover:text-[var(--primary)] whitespace-nowrap"
              >
                <EditableText contentKey={navLabelKey(c.key)} fallback={c.label} as="span" label="Nav Label" />
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <RouterNavLink
      to={item.to!}
      end={item.to === "/"}
      className={({ isActive }) =>
        `flex items-center px-2 lg:px-3 py-3 text-sm font-medium hover:text-[var(--primary)] whitespace-nowrap ${isActive ? "font-semibold text-[var(--primary)] border-b-2 border-[var(--primary)]" : "text-[var(--ink)]"}`
      }
    >
      <EditableText contentKey={navLabelKey(item.key)} fallback={item.label} as="span" label="Nav Label" />
    </RouterNavLink>
  );
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [scope, setScope] = useState<"all" | "journals" | "chapters" | "books" | "announcements">("all");
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q)}&scope=${encodeURIComponent(scope)}`);
      onClose();
    }
  };

  return (
    <div className="border-t border-border bg-[var(--secondary)]">
      <div className="container-academic py-5">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Search className="h-5 w-5 text-[var(--primary)]" />
            <input
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Search journals, chapters, books, announcements…"
              className="flex-1 bg-transparent text-base outline-none placeholder:text-[var(--ink-soft)]"
            />
            <button onClick={onClose} className="text-[var(--ink-soft)] hover:text-[var(--ink)]">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            {(["all", "journals", "chapters", "books", "announcements"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setScope(s)}
                className={`px-3 py-1.5 rounded-full border ${
                  scope === s
                    ? "bg-[var(--primary)] text-white border-[var(--primary)]"
                    : "bg-white text-[var(--ink)] border-border hover:border-[var(--primary)]"
                }`}
              >
                <EditableText contentKey={`header.search.scope.${s}`} fallback={s === "all" ? "All Publications" : s.charAt(0).toUpperCase() + s.slice(1)} as="span" label="Search scope" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Logo() {
  return (
    <EditableImage
      contentKey="site.logo.src"
      fallbackSrc="/logo.png"
      alt="ADF Logo" 
      className="h-12 w-auto shrink-0 object-contain mix-blend-multiply"
      label="Site logo"
    />
  );
}
