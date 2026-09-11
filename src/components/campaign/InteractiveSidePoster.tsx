import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  X, 
  Eye, 
  ArrowRight, 
  Clock, 
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
  Maximize2,
  Download,
  Info
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
  const [activeCategoryId, setActiveCategoryId] = useState("short-story");

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

  const CATEGORY_DATA = [
    {
      id: "short-story",
      name: "Short Story",
      icon: BookOpen,
      specs: "Up to 5 pages / max 2000 words",
      format: "Times New Roman 12, 1.5 line spacing (English or Tamil)",
      notes: "Original narratives celebrating authentic everyday experiences."
    },
    {
      id: "poem",
      name: "Poem",
      icon: Feather,
      specs: "Maximum 2 pages",
      format: "Original poetic works across any meter or free verse",
      notes: "English or Tamil (Latha Font) celebrating everyday voices."
    },
    {
      id: "drawing",
      name: "Drawing & Art",
      icon: Palette,
      specs: "1-Page artwork",
      format: "High-resolution digital scan or export (JPEG / PNG / PDF)",
      notes: "Sketches, watercolors, digital art, or ink illustrations."
    },
    {
      id: "photograph",
      name: "Photography",
      icon: Camera,
      specs: "1-Page high-res photo",
      format: "Raw or edited photograph (JPEG / PNG)",
      notes: "Capturing authentic stories, nature, candid moods, and people."
    },
    {
      id: "quotes",
      name: "Quotes",
      icon: Quote,
      specs: "Minimum of 10 quotes",
      format: "Collection of 10+ original philosophical or reflective quotes",
      notes: "Inspiring observations, human truths, and deep musings."
    },
    {
      id: "essay",
      name: "Essay",
      icon: FileText,
      specs: "Up to 5 pages / max 2000 words",
      format: "Times New Roman 12, 1.5 spacing (English or Tamil)",
      notes: "Reflective essays, cultural commentaries, or creative non-fiction."
    },
  ];

  const currentCategory = CATEGORY_DATA.find((c) => c.id === activeCategoryId) || CATEGORY_DATA[0];

  return (
    <>
      {/* Docked Right Side Container */}
      <aside
        aria-label="Academic Development Forum — Call for Submissions Bulletin"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center transition-all duration-300 select-none pointer-events-auto"
      >
        {/* EXPANDED INTERACTIVE DOSSIER */}
        {isExpanded ? (
          <div
            className="mr-2 sm:mr-4 w-[330px] sm:w-[360px] rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/20 text-slate-900 overflow-hidden animate-in slide-in-from-right duration-300 flex flex-col max-h-[88vh]"
          >
            {/* Executive Header Bar */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#071a8c] text-white">
              <div className="flex items-center gap-2 min-w-0">
                <img
                  src="/logo.png"
                  alt="ADF Seal"
                  className="h-6 w-auto object-contain brightness-0 invert shrink-0"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-blue-200 block leading-none">
                    Academic Development Forum
                  </span>
                  <span className="text-xs font-bold text-white truncate block mt-0.5">
                    Call for Works · {campaign.volume}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  ₹0 Free
                </span>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="p-1 rounded-md text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
                  title="Minimize to side tab"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto p-4 space-y-3.5 flex-1">
              
              {/* Poster Spotlight Card */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-2.5">
                <div
                  onClick={() => setIsFullPosterOpen(true)}
                  className="group relative cursor-pointer rounded-lg overflow-hidden border border-slate-200 bg-white shadow-xs transition-all hover:shadow-md max-h-40"
                  title="Click to view full poster with zoom tools"
                >
                  <img
                    src={campaign.posterUrl}
                    alt={campaign.title}
                    className="w-full h-36 object-contain object-top mx-auto transition-transform duration-300 group-hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-slate-950/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/95 text-xs font-bold text-slate-900 shadow">
                      <Maximize2 className="h-3.5 w-3.5 text-blue-700" />
                      Inspect Poster
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-serif font-bold text-slate-900 truncate max-w-[180px]">
                    {campaign.title}
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsFullPosterOpen(true)}
                    className="text-blue-700 hover:text-blue-900 text-[11px] font-semibold flex items-center gap-1 hover:underline"
                  >
                    <Maximize2 className="h-3 w-3" /> Zoom
                  </button>
                </div>
              </div>

              {/* Dignified Institutional Countdown */}
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-2.5">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-2">
                  <span className="flex items-center gap-1 text-slate-700">
                    <Clock className="h-3.5 w-3.5 text-blue-700" />
                    Submission Cutoff:
                  </span>
                  <span className="font-bold text-slate-900">{campaign.deadlineFormatted}</span>
                </div>

                <div className="grid grid-cols-4 gap-1.5 text-center">
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block leading-none">
                      {timeLeft.days}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block mt-1">
                      Days
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block leading-none">
                      {String(timeLeft.hours).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block mt-1">
                      Hours
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <span className="font-mono text-xs sm:text-sm font-bold text-slate-900 block leading-none">
                      {String(timeLeft.minutes).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block mt-1">
                      Mins
                    </span>
                  </div>
                  <div className="p-1.5 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <span className="font-mono text-xs sm:text-sm font-bold text-blue-700 block leading-none">
                      {String(timeLeft.seconds).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-slate-500 block mt-1">
                      Secs
                    </span>
                  </div>
                </div>
              </div>

              {/* Innovative Category Selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <span>Select Creative Format:</span>
                  <span className="text-emerald-700 font-semibold lowercase">no fee</span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {CATEGORY_DATA.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = activeCategoryId === cat.id;
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategoryId(cat.id)}
                        className={`flex flex-col items-center justify-center p-2 rounded-lg border text-[11px] font-medium transition cursor-pointer ${
                          isSelected
                            ? "bg-[#071a8c] border-[#071a8c] text-white shadow-xs font-semibold"
                            : "bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:border-slate-300"
                        }`}
                      >
                        <Icon className={`h-3.5 w-3.5 mb-1 ${isSelected ? "text-amber-300" : "text-slate-500"}`} />
                        <span className="truncate max-w-full">{cat.name}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Dynamic Category Specs Card */}
                <div className="p-3 rounded-xl bg-blue-50/70 border border-blue-100 text-xs space-y-1">
                  <div className="font-bold text-blue-950 flex items-center justify-between">
                    <span>{currentCategory.name} Guidelines</span>
                    <span className="text-[10px] font-normal text-blue-700 bg-blue-100/70 px-1.5 py-0.5 rounded">
                      {currentCategory.specs}
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-900 leading-snug">
                    {currentCategory.format}
                  </p>
                  <p className="text-[10px] text-slate-600 italic">
                    {currentCategory.notes}
                  </p>
                </div>
              </div>

              {/* Direct Call to Action */}
              <div className="space-y-2 pt-1">
                <Link
                  to={`/literary-publications/submit?campaign=art-dreams-fusion-vol-1&category=${encodeURIComponent(currentCategory.name)}`}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-[#071a8c] hover:bg-[#050f55] text-white shadow-sm transition"
                >
                  <span>Submit {currentCategory.name} (Free)</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsFullPosterOpen(true)}
                    className="flex-1 inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
                  >
                    <Eye className="h-3 w-3 text-slate-500" />
                    <span>View Poster</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplayLandingPoster(true)}
                    className="inline-flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg text-[11px] font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
                    title="Replay full welcome announcement"
                  >
                    <RotateCcw className="h-3 w-3 text-slate-500" />
                    <span>Replay</span>
                  </button>
                </div>
              </div>

              {/* Accreditation Footnote */}
              <div className="pt-2 border-t border-slate-100 text-[10px] text-slate-500 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-600" /> ISBN Registered
                </span>
                <span>•</span>
                <span>Certificate Awarded</span>
                <span>•</span>
                <span>100% Free Entry</span>
              </div>

            </div>
          </div>
        ) : (
          /* PRESTIGE DOCKED POSTER TAB (COLLAPSED STATE) */
          <div
            onClick={() => setIsExpanded(true)}
            className="group cursor-pointer flex items-center bg-[#071a8c] border-l-[3px] border-y border-amber-400 text-white rounded-l-xl shadow-xl shadow-slate-900/25 p-2 pr-3 hover:-translate-x-1.5 transition-transform duration-200"
            title="Click to interact with official Call for Submissions"
          >
            {/* Left Chevron */}
            <div className="mr-1 text-amber-300 group-hover:text-white transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </div>

            {/* Poster Thumbnail */}
            <div className="relative w-8 h-11 rounded overflow-hidden border border-white/30 shadow-xs shrink-0 bg-slate-900 mr-2.5">
              <img
                src={campaign.posterUrl}
                alt="Poster"
                className="w-full h-full object-cover object-top"
              />
            </div>

            {/* Vertical Stack */}
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1">
                <span className="text-[9px] font-extrabold uppercase tracking-wider text-amber-300 leading-none">
                  Official Call
                </span>
                <span className="text-[8px] font-bold px-1 py-0.2 rounded bg-emerald-500/30 text-emerald-200">
                  ₹0
                </span>
              </div>
              <span className="text-xs font-bold text-white truncate max-w-[120px] leading-tight mt-0.5">
                Art, Dreams &amp; Fusion
              </span>
              <span className="text-[10px] text-blue-200 font-medium">
                {timeLeft.days} days remaining
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
