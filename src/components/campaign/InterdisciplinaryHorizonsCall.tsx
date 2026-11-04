import { useState } from "react";
import { Link } from "react-router-dom";
import { Calendar, ArrowRight, Send, CheckCircle2, FileText } from "lucide-react";
import { INTERDISCIPLINARY_HORIZONS_CALL } from "@/data/abstractCallData";
import { AbstractSubmissionModal } from "./AbstractSubmissionModal";

export function InterdisciplinaryHorizonsCall() {
  const call = INTERDISCIPLINARY_HORIZONS_CALL;
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="py-5 bg-gradient-to-b from-slate-100/90 to-white border-b border-slate-200">
      <div className="container-academic">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#001c38] via-[#00274d] to-[#043d3b] text-white p-5 sm:p-6 shadow-md border border-teal-500/20">
          {/* Subtle Ambient Background Accents */}
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-64 h-64 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            {/* Left Content Column */}
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-xs">
                  Call for Abstracts 2026
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ₹50 Fee · Sole Author
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-200 font-medium">
                  <Calendar className="h-3 w-3 text-teal-400" />
                  Opens 5 Nov · Deadline 30 Nov 2026
                </span>
              </div>

              <div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white flex items-center gap-2">
                  <span>Interdisciplinary Horizons</span>
                  <span className="hidden sm:inline text-xs font-normal text-teal-200/80">
                    — Emerging Trends in Research, Innovation, and Sustainable Development
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 mt-0.5 leading-relaxed">
                  Published by ADF. Inviting Research Scholars, Students, and Faculty across 15 disciplines for publication in our Multidisciplinary E-Book (ISBN, DOI &amp; E-Certificate).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 pt-0.5">
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3 text-teal-400" />
                  200–300 words · 4–6 keywords
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-teal-400" />
                  15 Research Tracks
                </span>
                <span>•</span>
                <span className="text-slate-400">
                  Hard copy available upon request
                </span>
              </div>
            </div>

            {/* Right Action Column */}
            <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-slate-950 font-bold text-xs sm:text-sm shadow-sm transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
                Submit Abstract (₹50)
              </button>

              <Link
                to="/call-for-abstracts"
                className="inline-flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold border border-white/15 transition-colors"
              >
                View Full Guidelines
                <ArrowRight className="h-3.5 w-3.5 text-teal-300" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AbstractSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
