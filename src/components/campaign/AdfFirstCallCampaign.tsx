import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  CheckCircle2,
  ArrowRight,
  Award,
  BookMarked,
  BookOpen,
  Feather,
  Palette,
  Camera,
  Quote,
  FileText,
  Eye,
  Globe2,
  Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ART_DREAMS_FUSION_VOL_1 } from "@/data/campaigns";
import { PosterModal } from "./PosterModal";

export function AdfFirstCallCampaign() {
  const campaign = ART_DREAMS_FUSION_VOL_1;
  const [isPosterModalOpen, setIsPosterModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("Short Story");

  // Dynamic countdown timer
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
  }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });

  useEffect(() => {
    const target = new Date(campaign.deadlineIso).getTime();

    const calculateTime = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isExpired: false });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [campaign.deadlineIso]);

  const CATEGORIES = [
    { name: "Short Story", icon: BookOpen, rule: "Page limit 5 or <2000 words | A4 | TNR 12 | 1.5" },
    { name: "Poem", icon: Feather, rule: "Max 2 Pages" },
    { name: "Drawing", icon: Palette, rule: "One Page Artwork (High-Res)" },
    { name: "Photograph", icon: Camera, rule: "One Page Photograph (High-Res)" },
    { name: "Quotes", icon: Quote, rule: "Minimum of 10 Quotes" },
    { name: "Essay", icon: FileText, rule: "Page limit 5 or <2000 words | A4 | TNR 12 | 1.5" },
  ];

  return (
    <section id="adf-first-call" className="py-10 bg-slate-100/60 border-b border-slate-200/80">
      <div className="container-academic">

        {/* Main Highlighted Card: Blends with ADF Royal & Mint palette */}
        <div className="relative rounded-2xl bg-gradient-to-br from-[#eef2ff] via-[#f7f9ff] to-[#f0fdf4] border-2 border-indigo-200/90 shadow-lg shadow-indigo-950/5 p-4 sm:p-8 overflow-hidden">

          {/* Top Decorative Brand Gradient Stripe */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[var(--primary)] via-[#22c55e] to-[var(--primary)]" />

          {/* Subtle Ambient Glows */}
          <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top Header Strip */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-indigo-100/80 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs font-bold shadow-xs">
                ₹0 Free Submission & Publication
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
              <Calendar className="h-3.5 w-3.5 text-[var(--primary)]" />
              <span>Deadline: <strong className="text-[var(--ink)] font-semibold">{campaign.deadlineFormatted}</strong></span>
            </div>
          </div>

          {/* Two-Column Content: Left Details & Right Poster */}
          <div className="grid lg:grid-cols-12 gap-8 items-center pt-6 relative z-10">

            {/* Left Column: Details (8 cols) */}
            <div className="lg:col-span-8 space-y-5">
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[var(--ink)] tracking-tight leading-tight">
                  {campaign.title}
                </h2>
                <p className="font-serif text-base sm:text-lg text-[var(--primary)] italic font-medium mt-0.5">
                  {campaign.subtitle} — <span className="font-sans text-xs font-bold not-italic px-2 py-0.5 rounded bg-[var(--primary)] text-white uppercase shadow-xs">{campaign.volume}</span>
                </p>
                <p className="text-xs sm:text-sm text-[var(--ink-soft)] mt-2 leading-relaxed">
                  Inaugural literary anthology celebrating everyday creativity. Welcoming original contributions across short stories, poems, visual art, photography, quotes, and essays.
                </p>
              </div>

              {/* Welcomed Works Selector */}
              <div>
                <div className="text-xs uppercase tracking-wider text-slate-600 font-bold mb-2 flex items-center justify-between">
                  <span>Welcome Works (Click to select):</span>
                  <span className="text-[11px] text-[var(--primary)] font-semibold hidden sm:inline">
                    Languages: English & Tamil
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = activeCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setActiveCategory(cat.name)}
                        className={`text-left p-2.5 sm:p-3 rounded-xl border transition-all text-xs flex flex-col justify-between cursor-pointer ${isActive
                            ? "bg-[var(--primary)] border-[var(--primary)] shadow-sm text-white ring-2 ring-[var(--primary)]/20"
                            : "bg-white/95 border-indigo-100/90 hover:border-indigo-300 text-slate-800 shadow-xs hover:bg-white"
                          }`}
                      >
                        <div className="flex items-center gap-1.5 font-semibold">
                          <Icon className={`h-3.5 w-3.5 ${isActive ? "text-amber-300" : "text-[var(--primary)]"}`} />
                          <span className="truncate">{cat.name}</span>
                        </div>
                        <span className={`text-[10px] mt-1 line-clamp-1 ${isActive ? "text-indigo-100" : "text-slate-500"}`}>
                          {cat.rule}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Important Points Strip */}
              <div className="grid sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">100% Free</strong>
                    <span className="text-slate-600 text-[11px]">No submission or publication fee.</span>
                  </div>
                </div>

                <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-2.5">
                  <Award className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Author Benefits</strong>
                    <span className="text-slate-600 text-[11px]">Certificate + ISBN registered.</span>
                  </div>
                </div>

                <div className="bg-white/90 p-3 rounded-xl border border-indigo-100 shadow-xs flex items-start gap-2.5">
                  <Globe2 className="h-4 w-4 text-[var(--primary)] shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Languages</strong>
                    <span className="text-slate-600 text-[11px]">English & Tamil (Latha Font).</span>
                  </div>
                </div>
              </div>

              {/* Countdown & Action Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-indigo-100/80">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-600 uppercase font-bold flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5 text-amber-600" /> Deadline in:
                  </span>
                  {!timeLeft.isExpired ? (
                    <div className="flex items-center gap-1 font-mono text-xs sm:text-sm font-bold bg-white text-slate-900 px-3 py-1.5 rounded-lg border border-indigo-200 shadow-xs">
                      <span>{timeLeft.days}d</span>
                      <span className="text-slate-400">:</span>
                      <span>{String(timeLeft.hours).padStart(2, "0")}h</span>
                      <span className="text-slate-400">:</span>
                      <span>{String(timeLeft.minutes).padStart(2, "0")}m</span>
                      <span className="text-slate-400">:</span>
                      <span className="text-emerald-600">{String(timeLeft.seconds).padStart(2, "0")}s</span>
                    </div>
                  ) : (
                    <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                      SUBMISSIONS CLOSED
                    </span>
                  )}
                </div>

                <div className="flex flex-col xs:flex-row items-stretch xs:items-center gap-2.5 w-full sm:w-auto">
                  <Link
                    to={`/literary-publications/submit?campaign=art-dreams-fusion-vol-1&category=${encodeURIComponent(activeCategory)}`}
                    className="btn-primary flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold py-2.5 px-5 rounded-xl shadow-sm text-center"
                  >
                    <span>Submit {activeCategory} (Free)</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsPosterModalOpen(true)}
                    className="bg-white text-slate-800 hover:text-[var(--primary)] hover:border-indigo-300 text-xs flex items-center justify-center gap-1 h-9 rounded-xl border-slate-200 shadow-xs"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>View Poster</span>
                  </Button>
                </div>
              </div>

            </div>

            {/* Right Column: Poster Preview (4 cols) */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center">
              <div
                onClick={() => setIsPosterModalOpen(true)}
                className="group relative cursor-pointer rounded-2xl overflow-hidden shadow-md border-2 border-white bg-white hover:border-[var(--primary)] hover:shadow-xl transition-all duration-300 max-w-[210px] sm:max-w-[230px]"
                title="Click to view full official poster"
              >
                <img
                  src={campaign.posterUrl}
                  alt="Art, Dreams & Fusion Volume I Poster"
                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-900 bg-white/95 px-3 py-1.5 rounded-full shadow">
                    <Eye className="h-3 w-3" /> Zoom Poster
                  </span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <button
                  onClick={() => setIsPosterModalOpen(true)}
                  className="text-[11px] text-[var(--primary)] hover:underline font-semibold"
                >
                  Click to view full poster
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Poster Lightbox Modal */}
      <PosterModal
        isOpen={isPosterModalOpen}
        onClose={() => setIsPosterModalOpen(false)}
        posterUrl={campaign.posterUrl}
        title={`${campaign.title} - ${campaign.volume}`}
      />
    </section>
  );
}
