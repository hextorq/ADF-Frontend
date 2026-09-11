import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  Eye, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Feather, 
  Palette, 
  Camera, 
  Quote, 
  FileText,
  RotateCcw,
  CheckCircle2,
  Minimize2
} from "lucide-react";
import { ART_DREAMS_FUSION_VOL_1 } from "@/data/campaigns";
import { PosterModal } from "./PosterModal";
import { LandingPosterModal } from "./LandingPosterModal";

export function InteractiveSidePoster() {
  const campaign = ART_DREAMS_FUSION_VOL_1;
  const location = useLocation();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isFullPosterOpen, setIsFullPosterOpen] = useState(false);
  const [replayLandingPoster, setReplayLandingPoster] = useState(false);
  const [activeCategory, setActiveCategory] = useState("Short Story");

  // Dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const target = new Date(campaign.deadlineIso).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [campaign.deadlineIso]);

  // Don't display on submission routes to keep focus clean
  if (location.pathname.includes("/submit")) {
    return null;
  }

  const CATEGORIES = [
    { name: "Short Story", icon: BookOpen },
    { name: "Poem", icon: Feather },
    { name: "Drawing", icon: Palette },
    { name: "Photograph", icon: Camera },
    { name: "Quotes", icon: Quote },
    { name: "Essay", icon: FileText },
  ];

  return (
    <>
      {/* Docked Right Side Container */}
      <aside
        aria-label="Interactive ADF Call for Submissions Poster"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center transition-all duration-300 select-none pointer-events-auto"
      >
        {/* EXPANDED INTERACTIVE POPUP CARD */}
        {isExpanded ? (
          <div
            className="mr-2 sm:mr-3 w-[290px] sm:w-[320px] rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/98 to-slate-950 border-2 border-indigo-400/40 shadow-2xl shadow-slate-950/80 backdrop-blur-xl text-white overflow-hidden animate-in slide-in-from-right duration-300"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-3.5 py-2.5 bg-slate-950 border-b border-slate-800">
              <div className="flex items-center gap-1.5 min-w-0">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold text-slate-100 truncate">
                  ADF Call · {campaign.volume}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ₹0
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                  title="Minimize to side tab"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Poster Thumbnail & Quick Zoom */}
            <div className="p-3 bg-slate-950/60 border-b border-slate-800/80">
              <div
                onClick={() => setIsFullPosterOpen(true)}
                className="group relative cursor-pointer rounded-xl overflow-hidden border border-indigo-400/30 bg-slate-950 shadow-md transition-all hover:border-indigo-400/80"
                title="Click to view full poster with zoom and download"
              >
                <img
                  src={campaign.posterUrl}
                  alt={campaign.title}
                  className="w-full h-36 object-contain object-top transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 text-xs font-bold text-white border border-slate-700 shadow">
                    <Eye className="h-3.5 w-3.5 text-emerald-400" />
                    Open Poster
                  </span>
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-slate-300">
                <span className="font-semibold text-white truncate max-w-[170px]">
                  {campaign.title}
                </span>
                <button
                  type="button"
                  onClick={() => setIsFullPosterOpen(true)}
                  className="text-emerald-400 hover:underline flex items-center gap-0.5 font-medium"
                >
                  <Eye className="h-3 w-3" /> Full View
                </button>
              </div>
            </div>

            {/* Live Countdown Strip */}
            <div className="px-3.5 py-2 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-400 font-medium text-[11px]">
                <Clock className="h-3 w-3 text-amber-400 shrink-0" />
                <span>Deadline:</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-xs font-bold text-slate-200">
                <span className="text-emerald-400">{timeLeft.days}d</span>
                <span className="text-slate-500">:</span>
                <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
                <span className="text-slate-500">:</span>
                <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                <span className="text-slate-500">:</span>
                <span className="text-amber-300">{String(timeLeft.seconds).padStart(2, "0")}s</span>
              </div>
            </div>

            {/* Quick Category Selector */}
            <div className="p-3 space-y-2">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400 flex items-center justify-between">
                <span>Select Genre:</span>
                <span className="text-emerald-400 font-medium">Free Entry</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      className={`flex flex-col items-center justify-center p-1.5 rounded-lg border text-[10px] font-medium transition cursor-pointer ${
                        isSelected
                          ? "bg-indigo-600 border-indigo-400 text-white shadow-xs font-bold"
                          : "bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800 hover:text-white"
                      }`}
                    >
                      <Icon className={`h-3 w-3 mb-0.5 ${isSelected ? "text-amber-300" : "text-slate-400"}`} />
                      <span className="truncate max-w-full">{cat.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Benefits Checklist */}
              <div className="pt-1.5 space-y-1 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span>100% Free · No publication fee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span>ISBN Registered + Certificate</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-1.5">
                <Link
                  to={`/literary-publications/submit?campaign=art-dreams-fusion-vol-1&category=${encodeURIComponent(activeCategory)}`}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 shadow-md transition"
                >
                  <span>Submit {activeCategory}</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setIsFullPosterOpen(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                  >
                    <Eye className="h-3 w-3" />
                    <span>View Poster</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplayLandingPoster(true)}
                    className="inline-flex items-center justify-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-medium bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                    title="Replay landing page poster"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Replay</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* INNOVATIVE DOCKED POSTER TAB (COLLAPSED / PEEK MODE) */
          <div
            onClick={() => setIsExpanded(true)}
            className="group cursor-pointer flex items-center bg-gradient-to-l from-slate-900 via-slate-900 to-slate-950/95 border-l-2 border-y border-indigo-400/40 rounded-l-2xl shadow-xl shadow-slate-950/60 p-2 pr-2.5 text-white hover:border-indigo-400 hover:scale-105 transition-all duration-300"
            title="Click to interact with official Call for Submissions poster"
          >
            {/* Left expand chevron indicator */}
            <div className="mr-1 text-slate-400 group-hover:text-emerald-400 transition-colors">
              <ChevronLeft className="h-4 w-4 animate-pulse" />
            </div>

            {/* Poster Thumbnail Pill */}
            <div className="relative w-8 h-11 rounded-md overflow-hidden border border-indigo-300/40 shadow shrink-0 bg-slate-950 mr-2">
              <img
                src={campaign.posterUrl}
                alt="Poster"
                className="w-full h-full object-cover object-top"
              />
              <span className="absolute -top-1 -right-1 flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            {/* Stacked Vertical / Horizontal Info Badge */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">
                  Open Call
                </span>
                <span className="text-[9px] font-bold px-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ₹0 Free
                </span>
              </div>
              <span className="text-xs font-bold text-slate-100 group-hover:text-white transition-colors truncate max-w-[110px]">
                {campaign.title}
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-medium">
                {timeLeft.days}d remaining
              </span>
            </div>
          </div>
        )}
      </aside>

      {/* Lightbox Modal */}
      <PosterModal
        isOpen={isFullPosterOpen}
        onClose={() => setIsFullPosterOpen(false)}
        posterUrl={campaign.posterUrl}
        title={`${campaign.title} - ${campaign.volume}`}
      />

      {/* Replay 5-second Landing Poster Modal */}
      {replayLandingPoster && (
        <LandingPosterModal
          forceOpen={true}
          onCloseCallback={() => setReplayLandingPoster(false)}
        />
      )}
    </>
  );
}
