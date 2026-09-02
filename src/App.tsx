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
import AdminProgrammes from "@/routes/admin/programmes/index";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";
import { AdminLiveToolbar } from "@/components/cms/AdminLiveToolbar";


interface PageSEO {
  title: string;
  description: string;
  keywords?: string;
}

const PAGE_SEO: Record<string, PageSEO> = {
  "/": {
    title: "Academic Development Forum (ADF) — International Research, Journals & Book Publications",
    description: "Academic Development Forum (ADF) is an international publication house publishing peer-reviewed journals, edited book chapters, literary works, and academic development programmes.",
    keywords: "Academic Development Forum, ADF, peer-reviewed journals, open access, academic research, book chapters, literary publications",
  },
  "/about": {
    title: "About Us — Academic Development Forum (ADF) | Mission & Vision",
    description: "Learn about Academic Development Forum (ADF), our global mission, editorial standards, and commitment to open-access scholarly dissemination.",
    keywords: "about ADF, Academic Development Forum, publishing mission, academic forum, scholarly dissemination",
  },
  "/academic-programmes": {
    title: "Academic Programmes & Faculty Development (FDP) — ADF",
    description: "International faculty development programmes, research workshops, capacity building seminars, and academic training by ADF.",
    keywords: "academic programmes, faculty development programme, FDP, academic workshops, research seminars",
  },
  "/announcements": {
    title: "Announcements & Call for Papers (CFP) — Academic Development Forum",
    description: "Latest academic announcements, calls for papers, chapter submissions, journal releases, and event updates from ADF.",
    keywords: "call for papers, CFP, academic announcements, submission deadlines, journal CFP",
  },
  "/chapter-publications": {
    title: "Book Chapter Publications — Convergence Series | ADF",
    description: "Submit your book chapter to ADF Convergence Series. Peer-reviewed edited volumes with ISBN, DOI, and international indexing.",
    keywords: "book chapter publication, edited volume, call for chapters, ISBN book chapter, convergence series",
  },
  "/contact": {
    title: "Contact ADF — Academic Development Forum Editorial Office",
    description: "Get in touch with Academic Development Forum for publication inquiries, journal submissions, editorial board applications, and support.",
    keywords: "contact ADF, academic publishing inquiry, editorial office contact, journal submission help",
  },
  "/editorial-board": {
    title: "Editorial Board & Reviewers — Academic Development Forum",
    description: "Distinguished international editorial board members, subject experts, and peer reviewers at Academic Development Forum.",
    keywords: "editorial board, academic editors, peer review panel, journal editors, international editorial board",
  },
  "/guidelines/author": {
    title: "Author Submission Guidelines & Manuscript Template — ADF",
    description: "Complete author guidelines, manuscript preparation instructions, reference formatting, and checklist for submissions to ADF.",
    keywords: "author guidelines, manuscript preparation, submission checklist, referencing style, academic publishing guidelines",
  },
  "/guidelines/editor": {
    title: "Editor Guidelines & Responsibilities — Academic Development Forum",
    description: "Roles, responsibilities, and ethical standards for editors managing peer review and volume curation at ADF.",
    keywords: "editor guidelines, editorial responsibilities, peer review ethics, COPE guidelines",
  },
  "/guidelines/reviewer": {
    title: "Peer Reviewer Guidelines & Evaluation Criteria — ADF",
    description: "Evaluation checklist, ethical principles, and double-blind peer review instructions for reviewers at ADF.",
    keywords: "reviewer guidelines, peer review criteria, manuscript evaluation, referee instructions",
  },
  "/journals": {
    title: "Peer-Reviewed Open Access Journals — International Journal of English for Academic Excellence (IJEAE)",
    description: "Discover open-access, double-blind peer-reviewed journals published by ADF, including the International Journal of English for Academic Excellence (IJEAE). Submit online.",
    keywords: "academic journals, peer-reviewed journal, IJEAE, applied linguistics journal, ELT research, open access journal",
  },
  "/literary-publications": {
    title: "Literary Publications & Creative Publishing — ADF",
    description: "Submit and publish literary works, poetry collections, novels, and creative monographs with international distribution through ADF.",
    keywords: "literary publications, poetry publishing, book publishing, creative writing, author publishing",
  },
  "/bookstore": {
    title: "Bookstore & Published Volumes — Academic Development Forum",
    description: "Browse and order peer-reviewed academic books, edited volumes, monographs, and conference proceedings published by ADF.",
    keywords: "academic bookstore, published books, academic monographs, buy academic books",
  },
  "/policies": {
    title: "Publication Ethics, Open Access & Plagiarism Policies — ADF",
    description: "ADF publication ethics, COPE compliance, open-access policy, CC BY 4.0 licensing, retraction guidelines, and plagiarism criteria.",
    keywords: "publication ethics, COPE compliance, open access policy, plagiarism policy, retraction policy",
  },
  "/search": {
    title: "Search Publications & Journals — Academic Development Forum",
    description: "Search research articles, book chapters, literary works, and academic programmes across ADF publications.",
    keywords: "search publications, research search, journal search",
  },
};

function PageEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    const seo = PAGE_SEO[pathname] ?? {
      title: "Academic Development Forum — Research, Literature & Programmes",
      description: "Academic Development Forum is an international publication house for peer-reviewed journals, edited book chapters, literary works, and academic development programmes.",
      keywords: "Academic Development Forum, ADF, journals, research, books",
    };

    document.title = seo.title;

    // Update meta description
    let descMeta = document.querySelector('meta[name="description"]');
    if (!descMeta) {
      descMeta = document.createElement("meta");
      descMeta.setAttribute("name", "description");
      document.head.appendChild(descMeta);
    }
    descMeta.setAttribute("content", seo.description);

    // Update meta keywords
    if (seo.keywords) {
      let keywordsMeta = document.querySelector('meta[name="keywords"]');
      if (!keywordsMeta) {
        keywordsMeta = document.createElement("meta");
        keywordsMeta.setAttribute("name", "keywords");
        document.head.appendChild(keywordsMeta);
      }
      keywordsMeta.setAttribute("content", seo.keywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", seo.title);
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute("content", seo.description);

    // Update canonical link
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", `https://www.adf.ijeae.com${pathname}`);

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
  return <div className="flex min-h-[60vh] items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-7xl font-bold text-foreground">404</h1><h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2><p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p><Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Go home</Link></div></div>;
}

class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) { return { error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error(error, info); }
  render() {
    if (this.state.error) return <div className="flex min-h-screen items-center justify-center bg-background px-4"><div className="max-w-md text-center"><h1 className="text-xl font-semibold tracking-tight text-foreground">This page didn't load</h1><p className="mt-2 text-sm text-muted-foreground">Something went wrong. You can refresh or return home.</p><div className="mt-6 flex justify-center gap-2"><button onClick={() => window.location.reload()} className="btn-primary">Try again</button><a href="/" className="btn-outline">Go home</a></div></div></div>;
    return this.props.children;
  }
}

export default function App() {
  return <ErrorBoundary><div className="flex min-h-screen flex-col bg-background text-foreground"><PageEffects /><AppBootstrap /><Toaster /><AdminLiveToolbar />
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
            <Route path="programmes" element={<AdminProgrammes />} />
          </Route>
      </Route>

      <Route path="*" element={<><SiteHeader /><main className="flex-1"><NotFound /></main><SiteFooter /></>} />
    </Routes>
  </div></ErrorBoundary>;
}
