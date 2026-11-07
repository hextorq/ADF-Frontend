import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  Sparkles,
  BookOpen,
  Award,
  BookMarked,
  Globe,
  CheckCircle2,
  FileText,
  Send,
  MessageCircle,
  Mail,
  Phone,
  Printer,
  ChevronRight,
  ShieldAlert,
  Info,
  ExternalLink,
  Layers,
  GraduationCap,
  Users,
  Briefcase,
  Cpu,
  Atom,
  HeartPulse,
  Scale,
  Leaf,
  Palette,
  Languages,
  TrendingUp,
  Tv,
  Sprout,
  Binary,
  Wand2,
  QrCode,
  Copy,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { INTERDISCIPLINARY_HORIZONS_CALL, ResearchArea } from "@/data/abstractCallData";
import { AbstractSubmissionModal } from "@/components/campaign/AbstractSubmissionModal";

const AREA_ICONS: Record<string, any> = {
  Languages,
  Palette,
  GraduationCap,
  Users,
  Atom,
  Cpu,
  Binary,
  Briefcase,
  TrendingUp,
  Leaf,
  HeartPulse,
  Scale,
  Tv,
  Sprout,
  Layers,
};

export default function CallForAbstractsPage() {
  const data = INTERDISCIPLINARY_HORIZONS_CALL;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAreaId, setSelectedAreaId] = useState<string | undefined>(undefined);

  const handleOpenModal = (areaId?: string) => {
    setSelectedAreaId(areaId);
    setIsModalOpen(true);
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      {/* Page Header */}
      <PageHeader
        cmsKey="page.call_for_abstracts"
        eyebrow="Call for Abstract Submission 2026"
        title="Interdisciplinary Horizons"
        description="Emerging Trends in Research, Innovation, and Sustainable Development — Multidisciplinary E-Book of Abstracts published by Academic Development Forum."
        crumbs={[
          { label: "Publications", to: "/chapter-publications" },
          { label: "Call for Abstracts" },
        ]}
      />

      <div className="container-academic space-y-10 mt-8">
        {/* Hero Card Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#002147] via-[#083363] to-[#043d3b] text-white p-6 sm:p-10 lg:p-12 shadow-xl border border-indigo-900/50 overflow-hidden">
          <div className="absolute top-0 right-0 -mt-16 -mr-16 w-80 h-80 bg-teal-400/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-80 h-80 bg-blue-400/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 shadow-xs">
                {data.badge}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                ₹50 Submission Fee
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-teal-500/20 text-teal-200 border border-teal-400/30">
                ISBN & DOI Assigned
              </span>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
                {data.title}
              </h1>
              <p className="text-xl sm:text-2xl text-teal-200 font-semibold">
                {data.subtitle}
              </p>
              <p className="text-sm sm:text-base text-slate-200 max-w-3xl pt-1">
                Published by <strong>{data.publisher}</strong>. An international open-access multidisciplinary compendium showcasing high-caliber empirical and theoretical contributions from researchers across the globe.
              </p>
            </div>

            {/* Target Audience Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-slate-300 font-medium">Inviting:</span>
              {data.targetAudience.map((item) => (
                <span
                  key={item}
                  className="px-3 py-1 rounded-lg bg-white/10 text-xs font-medium text-white border border-white/10"
                >
                  {item}
                </span>
              ))}
            </div>

            {/* Important Dates & CTA */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-6 border-t border-white/15">
              <div className="flex flex-wrap items-center gap-6 text-xs sm:text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-300" />
                  <span>Submission Opens: <strong>{data.dates.opensDate}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-300" />
                  <span>Submission Deadline: <strong className="text-amber-300">{data.dates.deadlineDate}</strong></span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-gradient-to-r from-teal-400 to-emerald-500 hover:from-teal-500 hover:to-emerald-600 text-slate-950 font-extrabold px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2 text-sm"
                >
                  <Send className="h-4 w-4" />
                  Submit Abstract Online (₹50)
                </Button>

                <a
                  href="#official-poster"
                  className="px-4 py-2.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-300 font-bold text-sm flex items-center gap-1.5 border border-amber-400/30 transition-colors"
                >
                  <Sparkles className="h-4 w-4 text-amber-300" />
                  View Visual Poster
                </a>

                <a
                  href={data.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm flex items-center gap-2 border border-white/15 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  WhatsApp Inquiry
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Showcase: Official Figma Pro Designer Poster */}
        <section id="official-poster" className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800">
                  <Sparkles className="h-3 w-3 text-teal-600" />
                  Official Call Document &amp; Poster
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Extended to 15 Dec 2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Official Visual Call for Abstracts Poster
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                New Gen Figma UI/UX Designer Edition · Multidisciplinary E-Book Series 2026
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <a
                href={data.posterUrl}
                download="ADF-Call-For-Abstracts-2026.jpg"
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs sm:text-sm flex items-center gap-2 border border-slate-300 transition-colors cursor-pointer"
                title="Download high-resolution official poster"
              >
                <Printer className="h-4 w-4 text-slate-600" />
                <span>Download Poster</span>
              </a>
              <Button
                onClick={() => handleOpenModal()}
                className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <Send className="h-4 w-4 text-slate-950" />
                Submit Abstract (₹50)
              </Button>
            </div>
          </div>

          {/* Visual Poster Display */}
          <div className="max-w-3xl mx-auto shadow-2xl rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
            <img
              src={data.posterUrl}
              alt="Interdisciplinary Horizons Official Call for Abstracts Poster"
              className="w-full h-auto object-contain block"
            />
          </div>
        </section>

        {/* Section 1: Submission Guidelines & Policy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b pb-4">
                <FileText className="h-6 w-6 text-[var(--primary)]" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Submission Guidelines & Formatting Criteria
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Abstract Length</div>
                  <div className="text-base font-bold text-slate-900">{data.guidelines.wordCount.label}</div>
                  <div className="text-xs text-slate-500">Concise summary of background, aims, methods & results.</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Keywords</div>
                  <div className="text-base font-bold text-slate-900">{data.guidelines.keywordsCount.label}</div>
                  <div className="text-xs text-slate-500">Specific terms separated by semicolons or commas.</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Typography & Spacing</div>
                  <div className="text-base font-bold text-slate-900">{data.guidelines.font}</div>
                  <div className="text-xs text-slate-500">{data.guidelines.lineSpacing} in PDF (.pdf) or Word (.docx).</div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-xs text-slate-500 font-semibold uppercase">Language & Format</div>
                  <div className="text-base font-bold text-slate-900">{data.guidelines.language}</div>
                  <div className="text-xs text-slate-500">{data.guidelines.format} files accepted.</div>
                </div>
              </div>

              {/* Sole Author Policy Banner */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs sm:text-sm">
                  <div className="font-bold">Strict Authorship Policy:</div>
                  <p className="leading-relaxed">
                    <strong>One author per abstract.</strong> Co-authorship is strictly not permitted for this volume. Every accepted entry will feature an individual author biography and personal verifiable e-certificate.
                  </p>
                </div>
              </div>

              {/* Automated Formatter Callout */}
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 text-teal-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <Wand2 className="h-6 w-6 text-teal-700 flex-shrink-0" />
                  <div className="text-xs sm:text-sm">
                    <span className="font-bold">Need APA 7th Edition Formatting?</span>
                    <p className="text-slate-600">Standardize your research papers with our official ADF APA 7th Formatter engine.</p>
                  </div>
                </div>
                <Link
                  to="/chapter-publications/submit"
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white font-medium text-xs whitespace-nowrap transition-colors"
                >
                  Use Formatter Engine →
                </Link>
              </div>
            </div>

            {/* Section 2: Publication Benefits */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 border-b pb-4">
                <Award className="h-6 w-6 text-[var(--primary)]" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                  Author Publication Benefits
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {data.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className={`p-4 rounded-xl border flex items-start gap-3.5 ${
                      benefit.highlight
                        ? "bg-emerald-50/50 border-emerald-200"
                        : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    <div className="p-2 rounded-lg bg-white border border-slate-200 text-teal-700 shadow-2xs">
                      {benefit.icon === "BookOpen" && <BookOpen className="h-5 w-5 text-teal-600" />}
                      {benefit.icon === "BookMarked" && <BookMarked className="h-5 w-5 text-blue-600" />}
                      {benefit.icon === "Globe" && <Globe className="h-5 w-5 text-indigo-600" />}
                      {benefit.icon === "Award" && <Award className="h-5 w-5 text-amber-600" />}
                      {benefit.icon === "Download" && <FileText className="h-5 w-5 text-slate-700" />}
                      {benefit.icon === "CheckCircle2" && <CheckCircle2 className="h-5 w-5 text-emerald-600" />}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">{benefit.title}</h3>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Hard Copy Notice */}
              <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 flex items-start gap-3 text-xs sm:text-sm">
                <Printer className="h-5 w-5 text-slate-600 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">Hard Copy Edition: </strong>
                  <span>{data.hardCopyPolicy.terms}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Submission Summary, Dates & Contact */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Action Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-5 text-center">
              <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-800 border border-teal-200">
                OFFICIAL CFP 2026
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">Ready to Submit?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Upload your research abstract before the closing date.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Submission Opens:</span>
                  <span className="font-bold text-slate-900">{data.dates.opensDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Deadline:</span>
                  <span className="font-bold text-amber-700">{data.dates.deadlineDate}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500">Processing Fee:</span>
                  <span className="font-bold text-emerald-700">{data.fees.formatted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Publication:</span>
                  <span className="font-bold text-slate-900">ISBN E-Book</span>
                </div>
              </div>

              <Button
                onClick={() => handleOpenModal()}
                className="w-full bg-[var(--primary)] hover:bg-[#001833] text-white font-bold py-3 text-sm rounded-xl shadow-md flex items-center justify-center gap-2"
              >
                <Send className="h-4 w-4" />
                Submit Abstract Online
              </Button>

              <a
                href={data.contact.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-300 text-emerald-800 bg-emerald-50 hover:bg-emerald-100 text-xs font-semibold transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                WhatsApp: {data.contact.phone}
              </a>
            </div>

            {/* GPay / UPI Payment Instructions Card (Copied from Chapter Publication) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-center">
              <div className="flex items-center justify-center gap-2">
                <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                  <QrCode className="h-5 w-5" />
                </span>
                <h3 className="font-bold text-slate-900 text-base">GPay / UPI Payment (₹50)</h3>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Scan using any UPI app (Google Pay, PhonePe, Paytm, BHIM) to complete the ₹50 submission fee.
              </p>

              <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-xs inline-block mx-auto">
                <img
                  src={data.fees.qrCodeUrl}
                  alt="Payment QR Code - ₹50"
                  className="w-40 h-40 rounded-lg mx-auto"
                />
                <span className="text-[10px] font-semibold text-slate-400 mt-1.5 block">
                  Scan to Pay ₹50.00
                </span>
              </div>

              <div className="space-y-2 text-xs text-left bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">UPI ID</span>
                  <div className="font-mono font-bold text-slate-800 flex items-center gap-1.5">
                    <span>{data.fees.upiId}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.fees.upiId);
                        toast.success("UPI ID copied!");
                      }}
                      className="text-slate-400 hover:text-[var(--primary)] p-0.5 cursor-pointer"
                      title="Copy UPI ID"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Receiver</span>
                  <span className="font-semibold text-slate-700 truncate max-w-[170px]" title={data.fees.receiverName}>
                    {data.fees.receiverName}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-400 font-semibold uppercase text-[10px]">Amount</span>
                  <span className="font-bold text-[var(--primary)] text-sm">₹50.00</span>
                </div>
              </div>
            </div>

            {/* Official Publisher Card */}
            <div className="bg-gradient-to-br from-[#002147] to-[#043d3b] text-white rounded-2xl p-6 shadow-sm space-y-4">
              <div className="text-xs uppercase tracking-wider text-teal-300 font-bold">Publisher</div>
              <h3 className="text-lg font-bold text-white">Academic Development Forum</h3>
              <p className="text-xs text-teal-100 italic">
                &ldquo;{data.publisherTagline}&rdquo;
              </p>

              <div className="pt-2 border-t border-white/10 space-y-2 text-xs text-slate-200">
                <div className="flex items-center gap-2">
                  <Globe className="h-3.5 w-3.5 text-teal-400" />
                  <a href={data.contact.website} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {data.contact.website}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-teal-400" />
                  <a href={`mailto:${data.contact.email}`} className="hover:underline">
                    {data.contact.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5 text-teal-400" />
                  <span>{data.contact.phoneFormatted}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: All 15 Accepted Research Areas Grid */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
                15 Research Tracks
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Accepted Research Areas & Topic Domains
              </h2>
            </div>
            <span className="text-xs text-slate-500 font-medium">
              Click any track to submit an abstract directly
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.researchAreas.map((area) => {
              const IconComp = AREA_ICONS[area.iconName] || BookOpen;

              return (
                <div
                  key={area.id}
                  className="group p-5 rounded-2xl border border-slate-200 hover:border-teal-400 hover:shadow-md transition-all flex flex-col justify-between space-y-4 bg-slate-50/50 hover:bg-white"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-[var(--primary)] group-hover:bg-teal-50 group-hover:text-teal-700 transition-colors">
                        <IconComp className="h-5 w-5" />
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 group-hover:text-[var(--primary)] transition-colors">
                        {area.name}
                      </h3>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {area.description}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {area.topics.map((t) => (
                        <span
                          key={t}
                          className="px-2 py-0.5 rounded-full bg-white text-[11px] text-slate-600 border border-slate-200"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenModal(area.id)}
                    className="w-full text-xs font-bold border-slate-300 hover:bg-[var(--primary)] hover:text-white hover:border-[var(--primary)] transition-colors flex items-center justify-center gap-1.5"
                  >
                    Submit in {area.shortName}
                    <ChevronRight className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal */}
      <AbstractSubmissionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultAreaId={selectedAreaId}
      />
    </div>
  );
}

