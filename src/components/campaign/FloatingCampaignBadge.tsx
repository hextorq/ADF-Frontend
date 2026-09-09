import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, X, ArrowRight } from "lucide-react";
import { ART_DREAMS_FUSION_VOL_1 } from "@/data/campaigns";

export function FloatingCampaignBadge() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if user previously dismissed badge this session
    const dismissed = sessionStorage.getItem("adf_campaign_dismissed");
    if (dismissed === "true") {
      setIsDismissed(true);
      return;
    }

    // Delay appearance slightly for better UX
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem("adf_campaign_dismissed", "true");
  };

  // Don't show on the submission page itself to avoid visual clutter
  if (location.pathname.includes("/submit")) {
    return null;
  }

  // Check if campaign deadline has passed
  const deadline = new Date("2026-09-20T23:59:59+05:30");
  if (new Date().getTime() > deadline.getTime()) {
    return null;
  }

  if (!isVisible || isDismissed) return null;

  return (
    <>
      {/* Desktop Floating Badge (Bottom-Right) */}
      <aside 
        aria-label="ADF First Call promotional alert"
        className="hidden md:flex fixed bottom-6 right-6 z-40 items-center gap-3 p-3 pl-4 rounded-2xl bg-slate-900/95 border border-indigo-400/30 shadow-2xl shadow-slate-950/60 backdrop-blur-md text-white transition-all duration-300 hover:scale-[1.02]"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-500 flex items-center justify-center text-white shadow-md shrink-0">
            <BookOpen className="h-4 w-4" />
          </div>

          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase text-emerald-400">
                Anthology Call
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-[10px] text-emerald-300 font-medium">₹0 FREE</span>
            </div>
            <div className="text-xs font-semibold text-slate-100 truncate max-w-[210px]">
              {ART_DREAMS_FUSION_VOL_1.title} · {ART_DREAMS_FUSION_VOL_1.volume}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          <Link
            to="/literary-publications/submit?campaign=art-dreams-fusion-vol-1"
            className="btn-primary !bg-gradient-to-r !from-emerald-500 !to-teal-600 hover:!from-emerald-400 hover:!to-teal-500 !text-white text-xs font-bold !py-1.5 !px-3 !rounded-lg flex items-center gap-1 shadow"
          >
            <span>Submit</span>
            <ArrowRight className="h-3 w-3" />
          </Link>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Dismiss notification"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </aside>

      {/* Mobile Sticky Bottom Bar */}
      <aside 
        aria-label="ADF First Call mobile alert"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 border-t border-indigo-500/30 px-4 py-2.5 backdrop-blur-md flex items-center justify-between shadow-2xl"
      >
        <div className="flex items-center gap-2 min-w-0 pr-2">
          <BookOpen className="h-4 w-4 text-emerald-400 shrink-0" />
          <div className="truncate">
            <div className="text-[10px] font-bold text-emerald-300 uppercase leading-none">
              Anthology · {ART_DREAMS_FUSION_VOL_1.volume}
            </div>
            <div className="text-xs font-semibold text-white truncate">
              {ART_DREAMS_FUSION_VOL_1.title}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/literary-publications/submit?campaign=art-dreams-fusion-vol-1"
            className="btn-primary !bg-emerald-500 hover:!bg-emerald-400 !text-slate-950 text-xs font-bold !py-1.5 !px-3 !rounded-lg"
          >
            Submit ₹0
          </Link>
          <button
            onClick={handleDismiss}
            className="p-1 text-slate-400 hover:text-white"
            title="Dismiss"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </aside>
    </>
  );
}
