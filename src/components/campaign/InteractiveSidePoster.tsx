import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  Maximize2, 
  Download, 
  ArrowRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  ChevronLeft,
  Calendar,
  CheckCircle2,
  BookMarked,
  Award
} from "lucide-react";
import { ART_DREAMS_FUSION_VOL_1 } from "@/data/campaigns";

export function InteractiveSidePoster() {
  const campaign = ART_DREAMS_FUSION_VOL_1;
  const location = useLocation();

  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  });
  const [isExpanded, setIsExpanded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Pop up smoothly on the right side after page loads
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard navigation (Escape closes expanded view)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    if (isExpanded) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
      setZoomLevel(1);
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  // Don't display on submission routes to keep focus clean
  if (location.pathname.includes("/submit")) {
    return null;
  }

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.6));
  const handleResetZoom = () => setZoomLevel(1);

  const GENRES = [
    "Short Story",
    "Poem",
    "Drawing",
    "Photograph",
    "Quotes",
    "Essay"
  ];

  return (
    <>
      {/* 1. RIGHT SIDE POSTER POP-UP */}
      <aside
        aria-label="Official Call for Submissions Poster"
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-out select-none pointer-events-auto ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {!isMinimized ? (
          /* THE VISUAL POSTER POP-UP (PURE POSTER, NO HEADER OR FOOTER) */
          <div className="relative group mr-0">
            <div
              onClick={() => setIsExpanded(true)}
              className="relative cursor-pointer w-[125px] sm:w-[175px] bg-white rounded-2xl border-2 border-white shadow-2xl shadow-slate-950/40 overflow-hidden transition-all duration-500 ease-out origin-bottom-right -rotate-[13deg] translate-x-[46%] hover:rotate-0 hover:translate-x-[-10px] hover:shadow-indigo-950/50"
              title="Click to expand full poster in site"
            >
              {/* Subtle Floating Minimize Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsMinimized(true);
                }}
                className="absolute top-2 right-2 z-20 p-1 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white shadow-md transition-colors"
                title="Minimize poster"
              >
                <X className="h-3 w-3" />
              </button>

              {/* Pure Poster Image (Edge-to-Edge) */}
              <div className="relative bg-slate-100 overflow-hidden">
                <img
                  src={campaign.posterUrl}
                  alt="Art, Dreams & Fusion Official Poster"
                  className="w-full h-auto object-contain block transition-transform duration-300 group-hover:scale-[1.02]"
                />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-slate-950/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-xs font-bold text-slate-900 shadow-lg">
                    <Maximize2 className="h-3.5 w-3.5 text-blue-700" />
                    Expand Full
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MINIMIZED POSTER TAB (DISCREET BOOKMARK ON RIGHT EDGE) */
          <button
            type="button"
            onClick={() => setIsMinimized(false)}
            className="flex items-center gap-1.5 bg-[#071a8c] hover:bg-[#050f55] text-white border-l-2 border-y border-amber-400 rounded-l-xl shadow-xl p-2 pr-3 hover:-translate-x-1 transition-all duration-200 cursor-pointer"
            title="Click to show official poster"
          >
            <ChevronLeft className="h-4 w-4 text-amber-300" />
            <div className="w-6 h-8 rounded overflow-hidden border border-white/30 shrink-0 bg-slate-900">
              <img
                src={campaign.posterUrl}
                alt="Poster thumbnail"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 leading-none">
                Anthology
              </span>
              <span className="text-xs font-bold text-white leading-tight mt-0.5">
                Poster
              </span>
            </div>
          </button>
        )}
      </aside>

      {/* 2. EXPANDED FULL POSTER VIEW IN SITE */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Art, Dreams & Fusion — Expanded Official Poster"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExpanded(false);
          }}
        >
          <div className="relative flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-4xl w-full max-h-[96vh] overflow-hidden">
            
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#071a8c] text-white border-b border-indigo-950">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
                  <img
                    src="/logo.png"
                    alt="Academic Development Forum Seal"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="border-l border-white/20 pl-3 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 block leading-tight">
                    Academic Development Forum
                  </span>
                  <h2 className="text-xs sm:text-sm font-bold text-white truncate block">
                    {campaign.title} — {campaign.volume}
                  </h2>
                </div>
              </div>

              {/* Controls: Zoom & Close */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10 text-white text-xs">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-white/20 rounded transition-colors"
                    title="Zoom out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2 py-1 text-[11px] font-mono hover:bg-white/20 rounded transition-colors"
                    title="Reset zoom"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-white/20 rounded transition-colors"
                    title="Zoom in"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>

                <a
                  href={campaign.posterUrl}
                  download="Art-Dreams-Fusion-Vol-1-Poster.jpg"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/10 transition-colors"
                  title="Download poster image"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                  title="Close expanded poster"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Poster Showcase Container */}
            <div className="relative flex-1 bg-gradient-to-b from-slate-100/90 to-slate-200/50 p-3 sm:p-5 flex items-center justify-center overflow-auto min-h-0">
              <div
                className="transition-transform duration-200 ease-out origin-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={campaign.posterUrl}
                  alt="Art, Dreams & Fusion - Official Publication Poster"
                  className="max-h-[66vh] sm:max-h-[72vh] w-auto object-contain rounded-xl shadow-2xl border border-slate-300/80 bg-white"
                />
              </div>
            </div>

            {/* Bottom Actions & Information Bar */}
            <div className="px-4 sm:px-6 py-3 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Category Quick Chips */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium text-[11px] mr-1 hidden md:inline">
                  Accepted Formats:
                </span>
                {GENRES.map((genre) => (
                  <Link
                    key={genre}
                    to={`/literary-publications/submit?campaign=art-dreams-fusion-vol-1&category=${encodeURIComponent(genre)}`}
                    onClick={() => setIsExpanded(false)}
                    className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-50 hover:text-blue-800 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                  >
                    {genre}
                  </Link>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  to="/literary-publications/submit?campaign=art-dreams-fusion-vol-1"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#071a8c] hover:bg-[#050f55] transition-colors shadow-sm"
                >
                  <span>Submit Manuscript (₹0 Free)</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

