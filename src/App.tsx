import { Component, type ErrorInfo, type ReactNode, useEffect } from "react";
import { Link, Route, Routes, useLocation } from "react-router-dom";
import { SiteHeader } from "@/components/site/SiteHeader";
import { SiteFooter } from "@/components/site/SiteFooter";
import Home from "@/routes/index";
import About from "@/routes/about";
import AcademicProgrammes from "@/routes/academic-programmes";
import Announcements from "@/routes/announcements";
import ChapterPublications from "@/routes/chapter-publications";
import Contact from "@/routes/contact";
import EditorialBoard from "@/routes/editorial-board";
import AuthorGuidelines from "@/routes/guidelines.author";
import EditorGuidelines from "@/routes/guidelines.editor";
import ReviewerGuidelines from "@/routes/guidelines.reviewer";
import Journals from "@/routes/journals";
import LiteraryPublications from "@/routes/literary-publications";
import Policies from "@/routes/policies";
import Search from "@/routes/search";

// Admin
import AdminLayout from "@/routes/admin/AdminLayout";
import AdminDashboard from "@/routes/admin/index";
import AnnouncementsAdmin from "@/routes/admin/announcements";
import AdminLogin from "@/routes/admin/login";
import RequireAdmin from "@/routes/admin/RequireAdmin";
import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { useContentStore } from "@/store/useContentStore";


const TITLES: Record<string, string> = {
  "/": "Academic Development Forum — Research, Literature & Programmes",
  "/about": "About ADF — Academic Development Forum",
  "/academic-programmes": "Academic Programmes — ADF",
  "/announcements": "Announcements — ADF",
  "/chapter-publications": "Chapter Publications — Convergence Series · ADF",
  "/contact": "Contact — ADF",
  "/editorial-board": "Editorial Board — ADF",
  "/guidelines/author": "Author Guidelines — ADF",
  "/guidelines/editor": "Editor Guidelines — ADF",
  "/guidelines/reviewer": "Reviewer Guidelines — ADF",
  "/journals": "Journals — Academic Development Forum",
  "/literary-publications": "Literary Publications — ADF",
  "/policies": "Publication Ethics & Policies — ADF",
  "/search": "Search Results — ADF",
};

function PageEffects() {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = TITLES[pathname] ?? "Academic Development Forum";
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
  return <ErrorBoundary><div className="flex min-h-screen flex-col bg-background text-foreground"><PageEffects /><AppBootstrap /><Toaster />
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<><SiteHeader /><main className="flex-1"><Home /></main><SiteFooter /></>} />
      <Route path="/about" element={<><SiteHeader /><main className="flex-1"><About /></main><SiteFooter /></>} />
      <Route path="/academic-programmes" element={<><SiteHeader /><main className="flex-1"><AcademicProgrammes /></main><SiteFooter /></>} />
      <Route path="/announcements" element={<><SiteHeader /><main className="flex-1"><Announcements /></main><SiteFooter /></>} />
      <Route path="/chapter-publications" element={<><SiteHeader /><main className="flex-1"><ChapterPublications /></main><SiteFooter /></>} />
      <Route path="/contact" element={<><SiteHeader /><main className="flex-1"><Contact /></main><SiteFooter /></>} />
      <Route path="/editorial-board" element={<><SiteHeader /><main className="flex-1"><EditorialBoard /></main><SiteFooter /></>} />
      <Route path="/guidelines/author" element={<><SiteHeader /><main className="flex-1"><AuthorGuidelines /></main><SiteFooter /></>} />
      <Route path="/guidelines/editor" element={<><SiteHeader /><main className="flex-1"><EditorGuidelines /></main><SiteFooter /></>} />
      <Route path="/guidelines/reviewer" element={<><SiteHeader /><main className="flex-1"><ReviewerGuidelines /></main><SiteFooter /></>} />
      <Route path="/journals" element={<><SiteHeader /><main className="flex-1"><Journals /></main><SiteFooter /></>} />
      <Route path="/literary-publications" element={<><SiteHeader /><main className="flex-1"><LiteraryPublications /></main><SiteFooter /></>} />
      <Route path="/policies" element={<><SiteHeader /><main className="flex-1"><Policies /></main><SiteFooter /></>} />
      <Route path="/search" element={<><SiteHeader /><main className="flex-1"><Search /></main><SiteFooter /></>} />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="announcements" element={<AnnouncementsAdmin />} />
        </Route>
      </Route>

      <Route path="*" element={<><SiteHeader /><main className="flex-1"><NotFound /></main><SiteFooter /></>} />
    </Routes>
  </div></ErrorBoundary>;
}
