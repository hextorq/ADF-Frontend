import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ArrowRight, Eye, Pause, Play, Sparkles } from "lucide-react";
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

  // Check if we should show the modal on the landing page
  useEffect(() => {
    // Only auto-trigger on the root landing page "/"
    if (!forceOpen && location.pathname !== "/") {
      return;
    }

    // Check if user already saw or skipped the welcome poster in this session
    const seen = sessionStorage.getItem("adf_landing_poster_seen");
    if (!forceOpen && seen === "true") {
      return;
    }

    // Small delay of 400ms for smooth page transition
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

  // Handle escape key
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

  // Calculate circular progress (5s total)
  const progressPercent = ((5 - secondsRemaining) / 5) * 100;
  const strokeDashoffset = 100 - progressPercent;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Welcome Announcement Poster"
        className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-4 md:p-6 animate-in fade-in duration-300 select-none"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleClose();
        }}
      >
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="relative flex flex-col items-center bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-2xl sm:rounded-3xl shadow-2xl shadow-indigo-950/60 max-w-lg w-full max-h-[92vh] overflow-hidden transition-all duration-300"
        >
          {/* Top Header Bar */}
          <div className="w-full flex items-center justify-between px-4 py-3 bg-slate-950/80 border-b border-slate-800 text-white z-20">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 tracking-wide">
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Special Call · {campaign.volume}</span>
              </div>
              <span className="hidden sm:inline-block text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                ₹0 Free
              </span>
            </div>

            {/* Skip Button with Animated Progress Indicator */}
            <div className="flex items-center gap-2">
              {isPaused ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-300/90 bg-amber-950/40 px-2 py-0.5 rounded-md border border-amber-500/20">
                  <Pause className="h-3 w-3" /> Paused
                </span>
              ) : (
                <div className="relative flex items-center justify-center w-6 h-6">
                  <svg className="w-6 h-6 -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-400 transition-all duration-1000 ease-linear"
                      strokeDasharray="100, 100"
                      strokeDashoffset={strokeDashoffset}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-[10px] font-bold text-slate-300 font-mono">
                    {secondsRemaining}
                  </span>
                </div>
              )}

              <button
                onClick={handleClose}
                className="group inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/90 hover:bg-rose-900/60 text-slate-300 hover:text-white border border-slate-700/80 hover:border-rose-700/80 text-xs font-semibold transition-all shadow-sm"
                title="Skip poster and continue to website"
              >
                <span>Skip</span>
                <span className="text-slate-400 group-hover:text-rose-300">({secondsRemaining}s)</span>
                <X className="h-3.5 w-3.5 ml-0.5" />
              </button>
            </div>
          </div>

          {/* Poster Image Stage */}
          <div className="relative flex-1 w-full overflow-hidden p-3 sm:p-4 flex items-center justify-center bg-slate-950/40">
            <div
              onClick={handleOpenFullPoster}
              className="relative group cursor-pointer max-h-[64vh] rounded-xl overflow-hidden shadow-2xl border-2 border-indigo-400/20 hover:border-indigo-400/60 transition-all duration-300"
              title="Click to view full poster with zoom"
            >
              <img
                src={campaign.posterUrl}
                alt="Art, Dreams & Fusion Official Poster"
                className="max-h-[64vh] w-auto object-contain block mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Hover overlay hint */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                <span className="self-end inline-flex items-center gap-1 bg-slate-900/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-full border border-slate-700 shadow">
                  <Eye className="h-3 w-3" /> Click to Zoom
                </span>
                <span className="self-center text-xs font-bold text-white bg-slate-900/90 px-4 py-1.5 rounded-lg border border-slate-700">
                  Full High-Resolution Poster
                </span>
              </div>
            </div>
          </div>

          {/* Bottom Action Strip */}
          <div className="w-full px-4 py-3 bg-slate-950 border-t border-slate-800/90 flex flex-col sm:flex-row items-center justify-between gap-2.5 z-20">
            <div className="text-center sm:text-left">
              <div className="text-xs font-bold text-slate-200 truncate">
                {campaign.title} · {campaign.subtitle}
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">
                Deadline: {campaign.deadlineFormatted} · ISBN Registered
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleOpenFullPoster}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 transition"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Zoom</span>
              </button>

              <Link
                to="/literary-publications/submit?campaign=art-dreams-fusion-vol-1"
                onClick={handleClose}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 transition shadow-md shadow-emerald-950/20"
              >
                <span>Submit Work (₹0 Free)</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
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
