import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  ArrowRight, 
  Maximize2, 
  Download, 
  CheckCircle2, 
  Calendar, 
  BookMarked, 
  Award, 
  Pause,
  Play
} from "lucide-react";
import { ART_DREAMS_FUSION_VOL_1 } from "@/data/campaigns";
import { PosterModal } from "./PosterModal";

interface LandingPosterModalProps {
  forceOpen?: boolean;
  onCloseCallback?: () => void;
}

export function LandingPosterModal({ forceOpen = false, onCloseCallback }: LandingPosterModalProps) {
  const campaign = ART_DREAMS_FUSION_VOL_1;
  const location = useLocation();

  const [isOpen, setIsOpen] = useState(false);
  const [isFullPosterOpen, setIsFullPosterOpen] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Only trigger on root landing page "/" unless explicitly forced
    if (!forceOpen && location.pathname !== "/") {
      return;
    }

    // Check session storage so returning visitors aren't interrupted
    const seen = sessionStorage.getItem("adf_landing_poster_seen");
    if (!forceOpen && seen === "true") {
      return;
    }

    const initTimer = setTimeout(() => {
      setIsOpen(true);
      setSecondsRemaining(5);
    }, 400);

    return () => clearTimeout(initTimer);
  }, [location.pathname, forceOpen]);

  // 5-second countdown timer with pause on hover
  useEffect(() => {
    if (!isOpen || isPaused || isFullPosterOpen) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen, isPaused, isFullPosterOpen]);

  // ESC key to dismiss
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isFullPosterOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, isFullPosterOpen]);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("adf_landing_poster_seen", "true");
    if (onCloseCallback) onCloseCallback();
  };

  const handleOpenFullPoster = () => {
    setIsPaused(true);
    setIsFullPosterOpen(true);
  };

  if (!isOpen) {
    return (
      <PosterModal
        isOpen={isFullPosterOpen}
        onClose={() => {
          setIsFullPosterOpen(false);
          setIsPaused(false);
        }}
        posterUrl={campaign.posterUrl}
        title={`${campaign.title} - ${campaign.volume}`}
      />
    );
  }

  // Progress percentage for visual timer
  const progressPercent = ((5 - secondsRemaining) / 5) * 100;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Official Publication Call — Art, Dreams & Fusion"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-2 sm:p-4 md:p-6 animate-in fade-in duration-200"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative flex flex-col bg-white rounded-2xl shadow-2xl border border-slate-200/90 max-w-2xl lg:max-w-3xl w-full max-h-[96vh] overflow-hidden transition-all duration-300"
        >
          {/* Top Hairline Progress Bar */}
          <div className="w-full h-1 bg-slate-100 overflow-hidden relative">
            <div
              className={`h-full bg-gradient-to-r from-blue-700 via-indigo-600 to-amber-500 transition-all ${
                isPaused ? "duration-0" : "duration-1000 ease-linear"
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          {/* Institutional Header Bar */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-50/95 border-b border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Academic Development Forum Seal"
                className="h-8 w-auto object-contain shrink-0"
              />
              <div className="border-l border-slate-300 pl-3">
                <span className="text-[11px] font-bold tracking-wider uppercase text-slate-900 block leading-tight">
                  Academic Development Forum
                </span>
                <span className="text-[10px] text-slate-500 font-medium block">
                  Official Publication Call · {campaign.volume}
                </span>
              </div>
            </div>

            {/* Skip & Timer Controls */}
            <div className="flex items-center gap-2">
              {isPaused ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
                  <Pause className="h-3 w-3 text-amber-600" /> Paused (Reading)
                </span>
              ) : (
                <span className="text-[11px] font-mono font-medium text-slate-400 hidden sm:inline">
                  Closing in {secondsRemaining}s
                </span>
              )}

              <button
                onClick={handleClose}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-300 text-xs font-semibold transition-colors shadow-xs"
                title="Skip announcement and proceed to site"
              >
                <span>Skip</span>
                <span className="text-slate-400 font-mono">({secondsRemaining}s)</span>
                <X className="h-3.5 w-3.5 ml-0.5 text-slate-500" />
              </button>
            </div>
          </div>

          {/* Poster Showcase Section (The True Hero) */}
          <div className="relative flex-1 bg-gradient-to-b from-slate-100/70 to-slate-200/40 p-3 sm:p-5 flex flex-col items-center justify-center overflow-y-auto min-h-0">
            <div
              onClick={handleOpenFullPoster}
              className="group relative cursor-pointer rounded-xl overflow-hidden shadow-xl border border-slate-300/80 bg-white hover:shadow-2xl transition-all duration-300 max-h-[64vh] sm:max-h-[68vh]"
              title="Click to view full poster with zoom and inspection tools"
            >
              <img
                src={campaign.posterUrl}
                alt="Art, Dreams & Fusion - Official Publication Poster"
                className="max-h-[62vh] sm:max-h-[66vh] w-auto object-contain block mx-auto transition-transform duration-300 group-hover:scale-[1.01]"
              />
              
              {/* Subtle hover overlay for inspection */}
              <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/95 text-slate-900 text-xs font-bold shadow-lg">
                  <Maximize2 className="h-4 w-4 text-blue-700" /> Inspect &amp; Zoom High-Res
                </span>
              </div>
            </div>

            {/* Quick Metadata Pill Strip */}
            <div className="mt-2.5 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-[11px]">
                <CheckCircle2 className="h-3 w-3 text-emerald-600" /> ₹0 Free Submission
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-800 border border-blue-200 font-semibold text-[11px]">
                <BookMarked className="h-3 w-3 text-blue-600" /> ISBN Registered
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[11px]">
                <Award className="h-3 w-3 text-amber-600" /> Certificate Honored
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold text-[11px]">
                <Calendar className="h-3 w-3 text-slate-500" /> Deadline: {campaign.deadlineFormatted}
              </span>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-4 sm:px-6 py-3.5 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-left hidden sm:block">
              <span className="font-serif text-sm font-bold text-slate-900 block leading-tight">
                {campaign.title} — {campaign.volume}
              </span>
              <span className="text-xs text-slate-500 block">
                Open to all creators · English &amp; Tamil accepted
              </span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <Link
                to="/literary-publications/submit?campaign=art-dreams-fusion-vol-1"
                onClick={handleClose}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#071a8c] hover:bg-[#050f55] transition-colors shadow-sm"
              >
                <span>Submit Manuscript (Free)</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                type="button"
                onClick={handleOpenFullPoster}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 border border-slate-300 transition-colors"
                title="Open zoomable full-screen viewer"
              >
                <Maximize2 className="h-3.5 w-3.5 text-slate-600" />
                <span className="hidden sm:inline">Inspect</span>
              </button>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium px-2 py-1 transition-colors"
              >
                Continue to Site
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full zoomable lightbox */}
      <PosterModal
        isOpen={isFullPosterOpen}
        onClose={() => {
          setIsFullPosterOpen(false);
          setIsPaused(false);
        }}
        posterUrl={campaign.posterUrl}
        title={`${campaign.title} - ${campaign.volume}`}
      />
    </>
  );
}
