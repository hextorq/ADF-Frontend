import { Component, type ErrorInfo, type ReactNode, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import Home from "@/routes/index";
import About from "@/routes/about";
import AcademicProgrammes from "@/routes/academic-programmes";
import Announcements from "@/routes/announcements";
import ChapterPublications from "@/routes/chapter-publications";
import ChapterSubmit from "@/routes/chapter-publications/submit";
import LiteraryPublications from "@/routes/literary-publications";
import LiterarySubmit from "@/routes/literary-publications/submit";
import Contact from "@/routes/contact";
import EditorialBoard from "@/routes/editorial-board";
import AuthorGuidelines from "@/routes/guidelines.author";
import EditorGuidelines from "@/routes/guidelines.editor";
import ReviewerGuidelines from "@/routes/guidelines.reviewer";
import Journals from "@/routes/journals";
import BookStore from "@/routes/bookstore";
import BookSearch from "@/routes/bookstore/search";
import Policies from "@/routes/policies";
import Search from "@/routes/search";

// Admin
import AdminLayout from "@/routes/admin/AdminLayout";
import AdminDashboard from "@/routes/admin/index";
import AdminLogin from "@/routes/admin/login";
import RequireAdmin from "@/routes/admin/RequireAdmin";
import AdminBookManagement from "@/routes/admin/bookstore/books";
import AdminAuthorManagement from "@/routes/admin/bookstore/authors";
import AdminOrderManagement from "@/routes/admin/bookstore/orders";
import AdminChapterPublications from "@/routes/admin/publications/chapters";
import AdminLiteraryPublications from "@/routes/admin/publications/literary";
import AdminManuscriptFormatter from "@/routes/admin/publications/AdminManuscriptFormatter";
import AdminProgrammes from "@/routes/admin/programmes/index";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";
import { AdminLiveToolbar } from "@/components/cms/AdminLiveToolbar";
import { SITE_CONFIG, buildCanonicalUrl, buildBreadcrumbSchema } from "@/lib/seo";

interface PageSEO {
  title: string;
  description: string;
  keywords?: string;
  noindex?: boolean;
  nofollow?: boolean;
  type?: "website" | "article" | "book" | "profile";
  image?: string;
  crumbs?: { name: string; path?: string }[];
}

const PAGE_SEO: Record<string, PageSEO> = {
  "/": {
    title: "Academic Development Forum (ADF) — International Research, Journals & Book Publications",
    description: "Academic Development Forum (ADF) is an international publication house publishing peer-reviewed journals, edited book chapters, literary works, and academic development programmes — open access and globally accessible.",
    keywords: "Academic Development Forum, ADF, peer-reviewed journals, open access, academic research, book chapters, literary publications",
    type: "website",
  },
  "/about": {
    title: "About Us — Academic Development Forum (ADF) | Mission & Vision",
    description: "Learn about Academic Development Forum (ADF), our global mission, editorial standards, and commitment to open-access scholarly dissemination.",
    keywords: "about ADF, Academic Development Forum, publishing mission, academic forum, scholarly dissemination",
    crumbs: [{ name: "About Us", path: "/about" }],
  },
  "/academic-programmes": {
    title: "Academic Programmes & Faculty Development (FDP) — ADF",
    description: "International faculty development programmes, research workshops, capacity building seminars, and academic training by ADF.",
    keywords: "academic programmes, faculty development programme, FDP, academic workshops, research seminars",
    crumbs: [{ name: "Academic Programmes", path: "/academic-programmes" }],
  },
  "/announcements": {
    title: "Announcements & Call for Papers (CFP) — Academic Development Forum",
    description: "Latest academic announcements, calls for papers, chapter submissions, journal releases, and event updates from ADF.",
    keywords: "call for papers, CFP, academic announcements, submission deadlines, journal CFP",
    crumbs: [{ name: "Announcements", path: "/announcements" }],
  },
  "/chapter-publications": {
    title: "Book Chapter Publications — Convergence Series | ADF",
    description: "Submit your book chapter to ADF Convergence Series. Peer-reviewed edited volumes with ISBN, DOI, and international indexing.",
    keywords: "book chapter publication, edited volume, call for chapters, ISBN book chapter, convergence series",
    crumbs: [{ name: "Chapter Publications", path: "/chapter-publications" }],
  },
  "/chapter-publications/submit": {
    title: "Submit Book Chapter Manuscript — ADF Convergence Series",
    description: "Online manuscript submission portal for book chapters under the ADF Convergence Series. Review guidelines and submit your chapter.",
    keywords: "submit book chapter, chapter manuscript submission, call for chapters submission, convergence series submit",
    crumbs: [{ name: "Chapter Publications", path: "/chapter-publications" }, { name: "Submit Chapter", path: "/chapter-publications/submit" }],
  },
  "/literary-publications": {
    title: "Literary Publications & Creative Publishing — ADF",
    description: "Submit and publish literary works, poetry collections, novels, and creative monographs with international distribution through ADF.",
    keywords: "literary publications, poetry publishing, book publishing, creative writing, author publishing",
    crumbs: [{ name: "Literary Publications", path: "/literary-publications" }],
  },
  "/literary-publications/submit": {
    title: "Submit Literary Manuscript — ADF Creative Publishing",
    description: "Submit your poetry collection, novel, or creative manuscript for professional review, editing, ISBN assignment, and global publishing with ADF.",
    keywords: "submit literary manuscript, poetry manuscript submission, publish novel, creative writing submission",
    crumbs: [{ name: "Literary Publications", path: "/literary-publications" }, { name: "Submit Manuscript", path: "/literary-publications/submit" }],
  },
  "/contact": {
    title: "Contact ADF — Academic Development Forum Editorial Office",
    description: "Get in touch with Academic Development Forum for publication inquiries, journal submissions, editorial board applications, and support.",
    keywords: "contact ADF, academic publishing inquiry, editorial office contact, journal submission help",
    crumbs: [{ name: "Contact Us", path: "/contact" }],
  },
  "/editorial-board": {
    title: "Editorial Board & Reviewers — Academic Development Forum",
    description: "Distinguished international editorial board members, subject experts, and peer reviewers at Academic Development Forum.",
    keywords: "editorial board, academic editors, peer review panel, journal editors, international editorial board",
    crumbs: [{ name: "Editorial Board", path: "/editorial-board" }],
  },
  "/guidelines/author": {
    title: "Author Submission Guidelines & Manuscript Template — ADF",
    description: "Complete author guidelines, manuscript preparation instructions, reference formatting, and checklist for submissions to ADF.",
    keywords: "author guidelines, manuscript preparation, submission checklist, referencing style, academic publishing guidelines",
    crumbs: [{ name: "Author Guidelines", path: "/guidelines/author" }],
  },
  "/guidelines/editor": {
    title: "Editor Guidelines & Responsibilities — Academic Development Forum",
    description: "Roles, responsibilities, and ethical standards for editors managing peer review and volume curation at ADF.",
    keywords: "editor guidelines, editorial responsibilities, peer review ethics, COPE guidelines",
    crumbs: [{ name: "Editor Guidelines", path: "/guidelines/editor" }],
  },
  "/guidelines/reviewer": {
    title: "Peer Reviewer Guidelines & Evaluation Criteria — ADF",
    description: "Evaluation checklist, ethical principles, and double-blind peer review instructions for reviewers at ADF.",
    keywords: "reviewer guidelines, peer review criteria, manuscript evaluation, referee instructions",
    crumbs: [{ name: "Reviewer Guidelines", path: "/guidelines/reviewer" }],
  },
  "/journals": {
    title: "Peer-Reviewed Open Access Journals — International Journal of English for Academic Excellence (IJEAE)",
    description: "Discover open-access, double-blind peer-reviewed journals published by ADF, including the International Journal of English for Academic Excellence (IJEAE). Submit online.",
    keywords: "academic journals, peer-reviewed journal, IJEAE, applied linguistics journal, ELT research, open access journal",
    crumbs: [{ name: "Journals", path: "/journals" }],
  },
  "/bookstore": {
    title: "Bookstore & Published Volumes — Academic Development Forum",
    description: "Browse and order peer-reviewed academic books, edited volumes, monographs, and conference proceedings published by ADF.",
    keywords: "academic bookstore, published books, academic monographs, buy academic books",
    crumbs: [{ name: "Bookstore", path: "/bookstore" }],
  },
  "/bookstore/search": {
    title: "Search Bookstore — Academic Development Forum",
    description: "Search across ADF's published books, edited volumes, author monographs, and academic series.",
    keywords: "search bookstore, search academic books",
    noindex: true,
    nofollow: false,
    crumbs: [{ name: "Bookstore", path: "/bookstore" }, { name: "Search", path: "/bookstore/search" }],
  },
  "/policies": {
    title: "Publication Ethics, Open Access & Plagiarism Policies — ADF",
    description: "ADF publication ethics, COPE compliance, open-access policy, CC BY 4.0 licensing, retraction guidelines, and plagiarism criteria.",
    keywords: "publication ethics, COPE compliance, open access policy, plagiarism policy, retraction policy",
    crumbs: [{ name: "Policies", path: "/policies" }],
  },
  "/search": {
    title: "Search Publications & Journals — Academic Development Forum",
    description: "Search research articles, book chapters, literary works, and academic programmes across ADF publications.",
    keywords: "search publications, research search, journal search",
    noindex: true,
    nofollow: false,
    crumbs: [{ name: "Search", path: "/search" }],
  },
  "/admin/login": {
    title: "Admin Portal Login — Academic Development Forum",
    description: "Administrative access portal for ADF management and editorial staff.",
    noindex: true,
    nofollow: true,
  },
  "/admin": {
    title: "Admin Dashboard — Academic Development Forum",
    description: "Administrative management control center for ADF publications, bookstore, and programmes.",
    noindex: true,
    nofollow: true,
  },
};

function PageEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Check if route is an admin route
    const isAdminRoute = pathname.startsWith("/admin");
    const seo = PAGE_SEO[pathname] ?? {
      title: isAdminRoute
        ? "Admin Dashboard — Academic Development Forum"
        : `${SITE_CONFIG.siteName} — Research, Literature & Programmes`,
      description: isAdminRoute
        ? "Administrative management panel for ADF."
        : SITE_CONFIG.defaultDescription,
      keywords: SITE_CONFIG.defaultKeywords,
      noindex: isAdminRoute,
      nofollow: isAdminRoute,
    };

    // 1. Title
    document.title = seo.title;

    // Helper for meta tags
    const updateMeta = (nameAttr: "name" | "property", nameVal: string, content: string) => {
      let meta = document.querySelector(`meta[${nameAttr}="${nameVal}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute(nameAttr, nameVal);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // 2. Meta description & keywords
    updateMeta("name", "description", seo.description);
    updateMeta("name", "title", seo.title);
    if (seo.keywords) {
      updateMeta("name", "keywords", seo.keywords);
    }

    // 3. Robots directive
    if (seo.noindex || isAdminRoute) {
      const robotsContent = (seo.nofollow || isAdminRoute) ? "noindex, nofollow" : "noindex, follow";
      updateMeta("name", "robots", robotsContent);
      updateMeta("name", "googlebot", robotsContent);
    } else {
      const robotsContent = "index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1";
      updateMeta("name", "robots", robotsContent);
      updateMeta("name", "googlebot", robotsContent);
    }

    // 4. Canonical URL
    const canonicalUrl = buildCanonicalUrl(pathname);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // 5. Open Graph tags
    updateMeta("property", "og:title", seo.title);
    updateMeta("property", "og:description", seo.description);
    updateMeta("property", "og:url", canonicalUrl);
    updateMeta("property", "og:type", seo.type || "website");
    updateMeta("property", "og:image", seo.image || SITE_CONFIG.defaultImage);
    updateMeta("property", "og:site_name", SITE_CONFIG.siteName);
    updateMeta("property", "og:locale", "en_US");

    // 6. Twitter Card tags
    updateMeta("name", "twitter:card", "summary_large_image");
    updateMeta("name", "twitter:title", seo.title);
    updateMeta("name", "twitter:description", seo.description);
    updateMeta("name", "twitter:image", seo.image || SITE_CONFIG.defaultImage);
    updateMeta("name", "twitter:url", canonicalUrl);

    // 7. Route Breadcrumb Schema (JSON-LD)
    const breadcrumbScriptId = "adf-route-breadcrumb-schema";
    let breadcrumbScript = document.getElementById(breadcrumbScriptId) as HTMLScriptElement | null;
    if (seo.crumbs && seo.crumbs.length > 0 && !isAdminRoute) {
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement("script");
        breadcrumbScript.id = breadcrumbScriptId;
        breadcrumbScript.type = "application/ld+json";
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.textContent = JSON.stringify({
        "@context": "https://schema.org",
        ...buildBreadcrumbSchema(seo.crumbs)
      });
    } else if (breadcrumbScript) {
      breadcrumbScript.remove();
    }

    // Scroll restoration
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

function AppBootstrap() {
  useEffect(() => {
    useAuthStore.getState().hydrate();
    useContentStore.getState().loadContent();
  }, []);
  return null;
}

function NotFound() {
  useEffect(() => {
    document.title = "404 — Page Not Found | Academic Development Forum";
    let meta = document.querySelector('meta[name="robots"]');
    if (meta) meta.setAttribute("content", "noindex, nofollow");
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Go home
        </Link>
      </div>
    </div>
  );
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info); }
  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-background px-4">
          <div className="max-w-md text-center">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1>
            <p className="mt-2 text-sm text-muted-foreground">Something went wrong. You can refresh or return home.</p>
            <div className="mt-6 flex justify-center gap-2">
              <button onClick={() => window.location.reload()} className="btn-primary">Try again</button>
              <a href="/" className="btn-outline">Go home</a>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  return (
    <ErrorBoundary>
      <div className="flex min-h-screen flex-col bg-background text-foreground">
        <PageEffects />
        <AppBootstrap />
        <Toaster />
        <AdminLiveToolbar />
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<><SiteHeader /><main className="flex-1"><Home /></main><SiteFooter /></>} />
          <Route path="/about" element={<><SiteHeader /><main className="flex-1"><About /></main><SiteFooter /></>} />
          <Route path="/academic-programmes" element={<><SiteHeader /><main className="flex-1"><AcademicProgrammes /></main><SiteFooter /></>} />
          <Route path="/announcements" element={<><SiteHeader /><main className="flex-1"><Announcements /></main><SiteFooter /></>} />
          <Route path="/chapter-publications" element={<><SiteHeader /><main className="flex-1"><ChapterPublications /></main><SiteFooter /></>} />
          <Route path="/chapter-publications/submit" element={<><SiteHeader /><main className="flex-1"><ChapterSubmit /></main><SiteFooter /></>} />
          <Route path="/literary-publications" element={<><SiteHeader /><main className="flex-1"><LiteraryPublications /></main><SiteFooter /></>} />
          <Route path="/literary-publications/submit" element={<><SiteHeader /><main className="flex-1"><LiterarySubmit /></main><SiteFooter /></>} />
          <Route path="/contact" element={<><SiteHeader /><main className="flex-1"><Contact /></main><SiteFooter /></>} />
          <Route path="/editorial-board" element={<><SiteHeader /><main className="flex-1"><EditorialBoard /></main><SiteFooter /></>} />
          <Route path="/guidelines/author" element={<><SiteHeader /><main className="flex-1"><AuthorGuidelines /></main><SiteFooter /></>} />
          <Route path="/guidelines/editor" element={<><SiteHeader /><main className="flex-1"><EditorGuidelines /></main><SiteFooter /></>} />
          <Route path="/guidelines/reviewer" element={<><SiteHeader /><main className="flex-1"><ReviewerGuidelines /></main><SiteFooter /></>} />
          <Route path="/journals" element={<><SiteHeader /><main className="flex-1"><Journals /></main><SiteFooter /></>} />
          <Route path="/bookstore" element={<><SiteHeader /><main className="flex-1"><BookStore /></main><SiteFooter /></>} />
          <Route path="/bookstore/search" element={<><SiteHeader /><main className="flex-1"><BookSearch /></main><SiteFooter /></>} />
          <Route path="/policies" element={<><SiteHeader /><main className="flex-1"><Policies /></main><SiteFooter /></>} />
          <Route path="/search" element={<><SiteHeader /><main className="flex-1"><Search /></main><SiteFooter /></>} />
          
          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<RequireAdmin />}>
            <Route element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="books" element={<AdminBookManagement />} />
              <Route path="authors" element={<AdminAuthorManagement />} />
              <Route path="orders" element={<AdminOrderManagement />} />
              <Route path="publications/chapters" element={<AdminChapterPublications />} />
              <Route path="publications/literary" element={<AdminLiteraryPublications />} />
              <Route path="manuscript-formatter" element={<AdminManuscriptFormatter />} />
              <Route path="programmes" element={<AdminProgrammes />} />
            </Route>
          </Route>

          <Route path="*" element={<><SiteHeader /><main className="flex-1"><NotFound /></main><SiteFooter /></>} />
        </Routes>
      </div>
    </ErrorBoundary>
  );
}

