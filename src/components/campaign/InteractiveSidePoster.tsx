import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  X,
  Maximize2,
  Download,
  ArrowRight,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  Calendar,
  CheckCircle2,
  FileText,
  ExternalLink,
} from "lucide-react";
import { INTERDISCIPLINARY_HORIZONS_CALL } from "@/data/abstractCallData";

export function InteractiveSidePoster() {
  const call = INTERDISCIPLINARY_HORIZONS_CALL;
  const location = useLocation();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
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

  // Don't display on admin panel routes or directly on the call-for-abstracts page itself
  if (location.pathname.startsWith("/admin") || location.pathname === "/call-for-abstracts") {
    return null;
  }

  const handleZoomIn = () => setZoomLevel((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel((prev) => Math.max(prev - 0.25, 0.6));
  const handleResetZoom = () => setZoomLevel(1);

  const handlePosterClick = (e: React.MouseEvent) => {
    // If user clicked the maximize button directly, open lightbox
    // Otherwise prompt redirect directly to the page!
    navigate("/call-for-abstracts");
  };

  return (
    <>
      {/* 1. RIGHT SIDE POSTER POP-UP SLIDER */}
      <aside
        aria-label="Official Call for Abstracts Poster"
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-out select-none pointer-events-auto ${
          isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
        }`}
      >
        {!isMinimized ? (
          /* THE VISUAL POSTER POP-UP */
          <div className="relative group mr-0">
            <div
              onClick={handlePosterClick}
              className="relative cursor-pointer w-[150px] sm:w-[185px] bg-white rounded-2xl border-2 border-white shadow-2xl shadow-slate-950/40 overflow-hidden transition-all duration-500 ease-out origin-bottom-right -rotate-[13deg] translate-x-[46%] hover:rotate-0 hover:translate-x-[-12px] hover:shadow-indigo-950/60"
              title="Click to view full Call for Abstracts and Submit"
            >
              {/* Floating Quick Action Badge */}
              <div className="absolute top-2 left-2 z-20">
                <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-400 text-slate-950 shadow-md">
                  Active Call
                </span>
              </div>

              {/* Floating Controls: Minimize & Lightbox Zoom */}
              <div className="absolute top-2 right-2 z-20 flex items-center gap-1">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(true);
                  }}
                  className="p-1 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-md transition-colors cursor-pointer"
                  title="Expand poster modal"
                >
                  <Maximize2 className="h-3 w-3" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMinimized(true);
                  }}
                  className="p-1 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white shadow-md transition-colors cursor-pointer"
                  title="Minimize poster"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>

              {/* Poster Image */}
              <div className="relative bg-slate-100 overflow-hidden">
                <img
                  src={call.posterUrl}
                  alt="Interdisciplinary Horizons Official Poster"
                  className="w-full h-auto object-contain block transition-transform duration-300 group-hover:scale-[1.03]"
                />

                {/* Hover Redirect Prompt Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2.5 text-center text-white">
                  <span className="text-[10px] font-bold text-amber-300 uppercase tracking-wider mb-0.5">
                    Opens 5 Nov · ₹50
                  </span>
                  <span className="inline-flex items-center justify-center gap-1 w-full py-1.5 rounded-lg bg-teal-500 hover:bg-teal-600 text-slate-950 text-xs font-bold shadow-md transition-colors">
                    <span>View &amp; Submit</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MINIMIZED POSTER TAB (DISCREET BOOKMARK ON RIGHT EDGE) */
          <div className="flex flex-col items-end gap-1.5">
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-1.5 bg-[#002147] hover:bg-[#001833] text-white border-l-2 border-y border-amber-400 rounded-l-xl shadow-xl p-2 pr-3 hover:-translate-x-1 transition-all duration-200 cursor-pointer"
              title="Click to show Call for Abstracts poster"
            >
              <ChevronLeft className="h-4 w-4 text-amber-300" />
              <div className="w-6 h-8 rounded overflow-hidden border border-white/30 shrink-0 bg-slate-900">
                <img
                  src={call.posterUrl}
                  alt="Poster thumbnail"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-[9px] font-bold uppercase tracking-wider text-amber-300 leading-none">
                  Call 2026
                </span>
                <span className="text-xs font-bold text-white leading-tight mt-0.5">
                  Poster
                </span>
              </div>
            </button>

            <Link
              to="/call-for-abstracts"
              className="px-2.5 py-1 rounded-l-lg bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold shadow-md transition-colors"
              title="Submit Abstract Online"
            >
              Submit ₹50 →
            </Link>
          </div>
        )}
      </aside>

      {/* 2. EXPANDED FULL POSTER VIEW & REDIRECT MODAL */}
      {isExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Interdisciplinary Horizons — Official Call Poster"
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsExpanded(false);
          }}
        >
          <div className="relative flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-4xl w-full max-h-[96vh] overflow-hidden">
            {/* Header Bar */}
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-[#002147] text-white border-b border-indigo-950">
              <div className="flex items-center gap-3 min-w-0">
                <div className="h-9 w-9 rounded-lg bg-white p-1 flex items-center justify-center shadow-xs shrink-0">
                  <img
                    src="/logo.png"
                    alt="Academic Development Forum Seal"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="border-l border-white/20 pl-3 min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-teal-300 block leading-tight">
                    Academic Development Forum · Call for Abstracts 2026
                  </span>
                  <h2 className="text-xs sm:text-sm font-bold text-white truncate block">
                    {call.title}: {call.subtitle}
                  </h2>
                </div>
              </div>

              {/* Controls: Zoom, Download & Close */}
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center bg-white/10 rounded-lg p-0.5 border border-white/10 text-white text-xs">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1.5 hover:bg-white/20 rounded transition-colors cursor-pointer"
                    title="Zoom out"
                  >
                    <ZoomOut className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="px-2 py-1 text-[11px] font-mono hover:bg-white/20 rounded transition-colors cursor-pointer"
                    title="Reset zoom"
                  >
                    {Math.round(zoomLevel * 100)}%
                  </button>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1.5 hover:bg-white/20 rounded transition-colors cursor-pointer"
                    title="Zoom in"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                  </button>
                </div>

                <a
                  href={call.posterUrl}
                  download="ADF-Interdisciplinary-Horizons-2026-Poster.jpg"
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
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
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
                  src={call.posterUrl}
                  alt="Interdisciplinary Horizons - Official Publication Poster"
                  className="max-h-[66vh] sm:max-h-[72vh] w-auto object-contain rounded-xl shadow-2xl border border-slate-300/80 bg-white"
                />
              </div>
            </div>

            {/* Bottom Actions & Redirect Prompt Bar */}
            <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-xs text-slate-600 text-center sm:text-left">
                <span className="font-bold text-slate-900 block sm:inline mr-2">
                  Opens 5 Nov 2026 · Deadline 15 Dec 2026
                </span>
                <span className="text-slate-500">
                  Multidisciplinary E-Book (ISBN &amp; DOI) · ₹50 per abstract · 15 Research Tracks
                </span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <Link
                  to="/call-for-abstracts"
                  onClick={() => setIsExpanded(false)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 transition-colors shadow-md"
                >
                  <span>Go to Submission Portal &amp; Guidelines</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
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
