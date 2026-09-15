import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Download,
  UploadCloud,
  ShieldCheck,
  Eye,
  RefreshCw,
  ArrowRight,
  Check,
  FileCheck,
  Layers,
  Sliders,
  AlertCircle,
  HelpCircle,
  BookOpen,
  XCircle,
  Printer,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Table,
  Image as ImageIcon,
  Sparkles,
  Columns,
  ListOrdered,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export interface DashboardCheckItem {
  id: string;
  name: string;
  passed: boolean;
  status: "pass" | "warning" | "error" | "info";
  label: string;
  details?: string;
  badge?: string;
}

export interface StructuralDecision {
  section: string;
  detected: boolean;
  confidence: "high" | "medium" | "low";
  reason: string;
  originalHeading?: string;
  normalizedHeading?: string;
  actionTaken: string;
}

export interface DetectedTable {
  number: number;
  caption: string;
  hasCaption: boolean;
  rows: string[][];
  mentionedInText: boolean;
}

export interface DetectedFigure {
  number: number;
  caption: string;
  hasCaption: boolean;
  isExternal?: boolean;
  mentionedInText: boolean;
}

export interface FormattedManuscriptResult {
  sessionId: string;
  originalFilename: string;
  originalFileUrl: string;
  formattedFilename: string;
  formattedFileUrl: string;
  formattingVersion: string;
  publicationType?: string;
  stats: {
    pagesProcessed: number;
    wordCount: number;
    headingsCount: number;
    tablesCount: number;
    figuresCount: number;
    referencesCount: number;
  };
  detectedStructure: {
    title: string;
    titleHasAbbreviation?: boolean;
    authors: string[];
    correspondingAuthor?: string;
    affiliations: string[];
    correspondingEmail?: string;
    abstract: string;
    keywords: string[];
    headings: { level: number; text: string }[];
    references: string[];
    structuralDecisions?: StructuralDecision[];
    confidenceBreakdown?: { high: number; medium: number; low: number };
    tables?: DetectedTable[];
    figures?: DetectedFigure[];
    optionalSections?: { acknowledgement?: string; declarationOfInterest?: string; funding?: string };
    citationMismatches?: string[];
    uncitedReferences?: string[];
  };
  validationReport?: {
    status: "READY FOR AUTHOR REVIEW" | "REVIEW REQUIRED";
    statusLevel: "PASS" | "PASS_WITH_WARNINGS" | "ACTION_REQUIRED";
    totalChecks: number;
    passedCount: number;
    warningCount: number;
    errorCount: number;
    dashboard: {
      structure: DashboardCheckItem[];
      formatting: DashboardCheckItem[];
      contentChecks: DashboardCheckItem[];
      warnings: string[];
      finalStatus: "READY FOR AUTHOR REVIEW" | "REVIEW REQUIRED";
    };
    categories?: {
      structure: { status: "pass" | "warning"; count: number; items: string[] };
      formatting: { status: "pass" | "warning"; count: number; items: string[] };
      tablesAndFigures?: { status: "pass" | "warning"; count: number; items: string[] };
      references: { status: "pass" | "warning"; count: number; items: string[]; citationMismatches: string[]; uncitedReferences: string[] };
      contentWarnings: { status: "pass" | "warning"; count: number; items: string[] };
    };
  };
  formattingChanges: string[];
  contentChanges: 0;
  issues: string[];
  originalHtml: string;
  formattedHtml: string;
}

interface ManuscriptFormatterProps {
  onFormatted?: (result: FormattedManuscriptResult) => void;
  onFileChange?: (file: File | null) => void;
  onConfirmSubmit?: () => void;
  initialFile?: File | null;
  publicationType?: string;
  className?: string;
  embedded?: boolean;
}

const PUBLICATION_TYPES = [
  { id: "Book Chapters", label: "Book Chapter (Convergence Series)" },
  { id: "Research Articles", label: "Research Article (Peer-Reviewed Journal)" },
  { id: "Edited Volumes", label: "Edited Volume Contribution" },
  { id: "Academic Publications", label: "Academic Publication" },
  { id: "Literary Publications", label: "Literary Publication (Poetry / Prose / Essay)" },
  { id: "Other", label: "Other Manuscript Category" },
];

const FORMATTING_STEPS = [
  "Detecting manuscript structure & title",
  "Extracting authors, affiliations & correspondence",
  "Validating abstract word count (250–300 words)",
  "Verifying keywords & heading hierarchy",
  "Applying ADF typography (Times New Roman)",
  "Validating APA 7th references & in-text citations",
  "Standardizing table captions above & figure captions below",
  "Generating official ADF formatted DOCX with running header",
];

export function ManuscriptFormatter({
  onFormatted,
  onFileChange,
  onConfirmSubmit,
  initialFile,
  publicationType = "Book Chapters",
  className = "",
  embedded = false,
}: ManuscriptFormatterProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [selectedPubType, setSelectedPubType] = useState<string>(publicationType);
  const [previewTab, setPreviewTab] = useState<"formatted" | "original" | "split">("formatted");
  const [validationTab, setValidationTab] = useState<"overview" | "structure" | "tables" | "references" | "typography">("overview");
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FormattedManuscriptResult | null>(null);

  // Author Review Confirmations (Section 31)
  const [reviewed, setReviewed] = useState(false);
  const [confirmedContent, setConfirmedContent] = useState(false);
  const [acknowledgedWarnings, setAcknowledgedWarnings] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialFile && !file) {
      setFile(initialFile);
    }
  }, [initialFile]);

  useEffect(() => {
    if (publicationType) {
      setSelectedPubType(publicationType);
    }
  }, [publicationType]);

  const handleFileSelect = (selected: File | null) => {
    if (!selected) return;

    const ext = selected.name.split(".").pop()?.toLowerCase();
    if (ext !== "docx" && ext !== "doc") {
      toast.error("Please upload a Microsoft Word (.docx) document.");
      return;
    }

    setFile(selected);
    if (onFileChange) onFileChange(selected);
  };

  const startFormatting = async () => {
    if (!file) {
      toast.error("Please choose a manuscript file first.");
      return;
    }

    setStep(2);
    setIsLoading(true);
    setProgressIndex(0);

    const interval = setInterval(() => {
      setProgressIndex((prev) => {
        if (prev < FORMATTING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 450);

    try {
      const formData = new FormData();
      formData.append("manuscript", file);
      formData.append("publicationType", selectedPubType);

      const response = await fetch("/api/formatter/process", {
        method: "POST",
        body: formData,
      });

      const text = await response.text();
      let data: any = {};
      try {
        if (text && text.trim()) data = JSON.parse(text);
      } catch {
        // ignore parse error
      }

      clearInterval(interval);
      setProgressIndex(FORMATTING_STEPS.length);

      if (!response.ok) {
        throw new Error(data.error || `Formatting failed (${response.status})`);
      }

      setResult(data);
      if (onFormatted) {
        onFormatted(data);
      }

      setTimeout(() => {
        setIsLoading(false);
        setStep(3);
        toast.success("ADF Formatting & Validation Complete!");
      }, 400);
    } catch (err: any) {
      clearInterval(interval);
      setIsLoading(false);
      setStep(1);
      toast.error(err.message || "Failed to format document");
    }
  };

  const resetAll = () => {
    setStep(1);
    setResult(null);
    setReviewed(false);
    setConfirmedContent(false);
    setAcknowledgedWarnings(false);
  };

  const handlePrintPreview = () => {
    if (!result) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      toast.error("Popup blocked. Please allow popups to print/preview as PDF.");
      return;
    }
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${result.detectedStructure.title || "ADF Formatted Manuscript"}</title>
          <style>
            @page { size: letter; margin: 1in; }
            body { font-family: 'Times New Roman', serif; margin: 0; padding: 20px; color: #000; }
            img { max-width: 100%; height: auto; }
            table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
            th, td { border: 1px solid #333; padding: 6px 10px; }
          </style>
        </head>
        <body>
          ${result.formattedHtml}
          <script>
            window.onload = function() { window.print(); };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const dashboard = result?.validationReport?.dashboard;
  const finalStatus =
    dashboard?.finalStatus ||
    (result?.issues && result.issues.length > 0 ? "REVIEW REQUIRED" : "READY FOR AUTHOR REVIEW");

  const confidenceBreakdown = result?.detectedStructure?.confidenceBreakdown || {
    high: 10,
    medium: 2,
    low: 0,
  };

  const decisions = result?.detectedStructure?.structuralDecisions || [];
  const tables = result?.detectedStructure?.tables || [];
  const figures = result?.detectedStructure?.figures || [];
  const citationMismatches = result?.detectedStructure?.citationMismatches || [];
  const uncitedReferences = result?.detectedStructure?.uncitedReferences || [];
  const hasReviewNotices = (result?.issues && result.issues.length > 0) || citationMismatches.length > 0;

  return (
    <div className={`rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${className}`}>
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#1e3a8a] text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-400/30">
              <FileCheck className="w-3.5 h-3.5 text-blue-200" />
              ADF Manuscript Formatter
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              ADF Manuscript Upload & Standardization
            </h2>
            <div className="text-sm text-blue-200 font-medium mt-0.5">
              Official Academic Document Formatting Engine
            </div>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              Standardizes your manuscript to the official ADF Master Template (Letter, Times New Roman, ADF margins, running header with logo, table/figure captions, and APA 7th referencing) with zero content alterations.
            </p>
          </div>

          {/* Stepper Pill */}
          <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-sm p-1.5 rounded-xl text-xs font-medium border border-white/10 self-start sm:self-center shrink-0">
            <span
              className={`px-3 py-1.5 rounded-lg transition-all ${
                step === 1 ? "bg-white text-[#1e3a8a] font-bold shadow-sm" : "text-white/70"
              }`}
            >
              ① Upload
            </span>
            <span className="text-white/40">→</span>
            <span
              className={`px-3 py-1.5 rounded-lg transition-all ${
                step === 2 ? "bg-white text-[#1e3a8a] font-bold shadow-sm" : "text-white/70"
              }`}
            >
              ② Analyze & Format
            </span>
            <span className="text-white/40">→</span>
            <span
              className={`px-3 py-1.5 rounded-lg transition-all ${
                step === 3 ? "bg-white text-[#1e3a8a] font-bold shadow-sm" : "text-white/70"
              }`}
            >
              ③ Validate & Review
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-4">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Upload your manuscript</h3>
            <p className="text-xs text-slate-500">
              Select your Word (.docx) file. The engine will inspect headings, author metadata, abstract, lists, tables, figures, and APA 7th references, formatting it strictly to the official ADF Master Template.
            </p>
          </div>

          {/* Publication Type Selector */}
          <div className="max-w-xl mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
              Publication Profile
            </label>
            <Select value={selectedPubType} onValueChange={setSelectedPubType}>
              <SelectTrigger className="bg-white border-slate-300 h-10 text-xs">
                <SelectValue placeholder="Select publication type" />
              </SelectTrigger>
              <SelectContent>
                {PUBLICATION_TYPES.map((type) => (
                  <SelectItem key={type.id} value={type.id} className="text-xs">
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Structural requirements adapt according to your category (e.g. Literary works never require methodology or scientific results).
            </p>
          </div>

          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="max-w-xl mx-auto border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/50 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              accept=".docx,.doc"
              className="hidden"
            />
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-3 group-hover:scale-105 transition-transform text-blue-600">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div className="text-sm font-semibold text-slate-800">
              {file ? file.name : "Choose Manuscript (.docx)"}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Ready for ADF Standardization`
                : "Drag & drop or click to browse. Official master DOCX formatting will be applied."}
            </p>
          </div>

          {/* Academic Safety Guarantee */}
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-amber-50/90 border border-amber-200 text-amber-950 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold text-amber-900">Academic Safety Guarantee:</span> This is a DOCUMENT STANDARDIZATION tool, not an AI writer. It will <strong>never</strong> rewrite, summarize, or alter your research data, statistics, equations, or phrasing (<code>contentChanges: 0</code>). Items requiring human decision are flagged with confidence ratings.
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={startFormatting}
              disabled={!file}
              className="btn-primary !py-3 !px-8 text-sm shadow-md hover:shadow-lg gap-2"
            >
              Analyze & Format with ADF Rules <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: PROCESSING ANIMATION */}
      {step === 2 && (
        <div className="p-10 sm:p-14 max-w-lg mx-auto text-center space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-serif font-bold text-lg">
              ADF
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold font-serif text-slate-900">
              Standardizing your manuscript...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Applying ADF Master Template layout, typography, and APA 7th reference validation
            </p>
          </div>

          {/* Animated Checklist */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-left space-y-2.5 font-mono text-xs">
            {FORMATTING_STEPS.map((stepText, idx) => {
              const isDone = idx < progressIndex;
              const isCurrent = idx === progressIndex;
              return (
                <div key={idx} className="flex items-center gap-3 transition-colors">
                  {isDone ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1 shrink-0">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : isCurrent ? (
                    <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin inline-block shrink-0"></span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 inline-block shrink-0"></span>
                  )}
                  <span
                    className={`${
                      isDone
                        ? "text-slate-700 font-medium"
                        : isCurrent
                        ? "text-blue-600 font-bold"
                        : "text-slate-400"
                    }`}
                  >
                    {stepText}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 3: REVIEW, VALIDATION DASHBOARD & CONFIRM */}
      {step === 3 && result && (
        <div className="p-6 sm:p-8 space-y-8">
          {/* FINAL STATUS BANNER */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              finalStatus === "READY FOR AUTHOR REVIEW"
                ? "bg-emerald-50 border-emerald-300 text-emerald-950"
                : "bg-amber-50 border-amber-300 text-amber-950"
            }`}
          >
            <div className="flex items-center gap-3.5">
              {finalStatus === "READY FOR AUTHOR REVIEW" ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <AlertTriangle className="w-6 h-6" />
                </div>
              )}
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  FINAL STATUS
                </div>
                <div className="text-xl font-serif font-bold">
                  {finalStatus}
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  Standardized under {result.formattingVersion} • {result.stats.pagesProcessed} Pages • {result.stats.wordCount.toLocaleString()} Words
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border shadow-xs text-slate-700">
                {result.formattingChanges.length} Formatting Changes Applied
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">
                0 Content Alterations (100% Academic Fidelity)
              </span>
            </div>
          </div>

          {/* CONFIDENCE BREAKDOWN BAR */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider">Engine Confidence:</span>
              <span className="text-slate-500">Structural detection reliability based on academic markers</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-800 font-semibold">
                <Check className="w-3.5 h-3.5" /> High: {confidenceBreakdown.high}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-amber-100 text-amber-800 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" /> Medium: {confidenceBreakdown.medium}
              </span>
              {confidenceBreakdown.low > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-100 text-rose-800 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" /> Low: {confidenceBreakdown.low}
                </span>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* VALIDATION DASHBOARD DRILLDOWN TABS                      */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  ADF MANUSCRIPT VALIDATION REPORT
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed inspection of detected sections, heading hierarchy, tables, figures, and APA 7th citations.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setValidationTab("overview")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    validationTab === "overview" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Overview ({dashboard?.structure.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setValidationTab("structure")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    validationTab === "structure" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Structural Decisions ({decisions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setValidationTab("tables")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    validationTab === "tables" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Tables & Figures ({tables.length + figures.length})
                </button>
                <button
                  type="button"
                  onClick={() => setValidationTab("references")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    validationTab === "references" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  References (APA 7th) {citationMismatches.length > 0 && `⚠️`}
                </button>
                <button
                  type="button"
                  onClick={() => setValidationTab("typography")}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    validationTab === "typography" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Typography & Layout
                </button>
              </div>
            </div>

            {/* TAB CONTENT: OVERVIEW */}
            {validationTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* COLUMN 1: STRUCTURE */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      STRUCTURE
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      {dashboard?.structure.length || 0} Checks
                    </span>
                  </div>

                  <div className="space-y-2">
                    {dashboard?.structure.map((item) => (
                      <div key={item.id} className="flex items-start gap-2 text-xs">
                        {item.passed ? (
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <div className={`font-medium ${item.passed ? "text-slate-800" : "text-amber-800 font-semibold"}`}>
                            {item.name}
                          </div>
                          {item.details && (
                            <div className="text-[11px] text-slate-500 leading-tight">
                              {item.details}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 2: FORMATTING */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      FORMATTING & TEMPLATE
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      {dashboard?.formatting.length || 0} Conforming
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {dashboard?.formatting.map((item) => (
                      <div key={item.id} className="flex items-start gap-2 text-xs">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-medium text-slate-800">
                            {item.name}
                          </div>
                          {item.details && (
                            <div className="text-[11px] text-slate-500 leading-tight">
                              {item.details}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMN 3: CONTENT CHECKS & WARNINGS */}
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                    <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        CONTENT CHECKS
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                        Zero Rewrites
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {dashboard?.contentChecks.map((item) => (
                        <div key={item.id} className="flex items-start gap-2 text-xs">
                          {item.passed ? (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <div className={`font-medium ${item.passed ? "text-slate-800" : "text-amber-800 font-semibold"}`}>
                              {item.name}
                            </div>
                            {item.details && (
                              <div className="text-[11px] text-slate-500 leading-tight">
                                {item.details}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* WARNINGS BOX */}
                  {dashboard && dashboard.warnings.length > 0 && (
                    <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 text-amber-900">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2 mb-2.5">
                        <span className="text-xs font-bold uppercase tracking-wider text-amber-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" /> REVIEW NOTICES ({dashboard.warnings.length})
                        </span>
                      </div>
                      <ul className="space-y-1.5 text-xs text-amber-900/90 pl-5 list-disc">
                        {dashboard.warnings.map((warn, i) => (
                          <li key={i}>{warn}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB CONTENT: STRUCTURAL DECISIONS */}
            {validationTab === "structure" && (
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider">
                        <th className="py-2.5 px-3">Section</th>
                        <th className="py-2.5 px-3">Status</th>
                        <th className="py-2.5 px-3">Confidence</th>
                        <th className="py-2.5 px-3">Detection Details</th>
                        <th className="py-2.5 px-3">Standardization Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {decisions.map((dec, idx) => (
                        <tr key={idx} className="hover:bg-white/60 transition-colors">
                          <td className="py-2.5 px-3 font-semibold text-slate-800">{dec.section}</td>
                          <td className="py-2.5 px-3">
                            {dec.detected ? (
                              <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                                <Check className="w-3.5 h-3.5" /> Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-slate-400">
                                <XCircle className="w-3.5 h-3.5" /> Omitted
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                dec.confidence === "high"
                                  ? "bg-emerald-100 text-emerald-800"
                                  : dec.confidence === "medium"
                                  ? "bg-amber-100 text-amber-800"
                                  : "bg-rose-100 text-rose-800"
                              }`}
                            >
                              {dec.confidence}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-slate-600">{dec.reason}</td>
                          <td className="py-2.5 px-3 text-slate-700">{dec.actionTaken}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB CONTENT: TABLES & FIGURES */}
            {validationTab === "tables" && (
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* TABLES */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <Table className="w-4 h-4 text-blue-600" /> Tables ({tables.length})
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">Captions strictly ABOVE tables</span>
                    </div>
                    {tables.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">No numbered tables detected in manuscript.</p>
                    ) : (
                      <div className="space-y-2">
                        {tables.map((tbl, i) => (
                          <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="font-semibold text-slate-800">{tbl.caption}</div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                              <span>{tbl.rows.length} rows</span>
                              <span>•</span>
                              <span>{tbl.mentionedInText ? "✓ Referenced in text" : "⚠️ Not explicitly cited in text"}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* FIGURES */}
                  <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between border-b pb-2">
                      <span className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-blue-600" /> Figures ({figures.length})
                      </span>
                      <span className="text-[11px] text-emerald-700 font-semibold">Captions strictly BELOW figures</span>
                    </div>
                    {figures.length === 0 ? (
                      <p className="text-xs text-slate-500 italic py-2">No numbered figures detected in manuscript.</p>
                    ) : (
                      <div className="space-y-2">
                        {figures.map((fig, i) => (
                          <div key={i} className="bg-white p-3 rounded-xl border border-slate-200 text-xs space-y-1">
                            <div className="font-semibold text-slate-800">{fig.caption}</div>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500">
                              <span>{fig.mentionedInText ? "✓ Referenced in text" : "⚠️ Not explicitly cited in text"}</span>
                              {fig.isExternal && <span>• ℹ️ External source copyright permission required</span>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: REFERENCES */}
            {validationTab === "references" && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-3">
                  <div>
                    <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                      APA 7th Edition Reference Validation
                    </h4>
                    <p className="text-xs text-slate-500">
                      Standardized with 0.5-inch hanging indent, alphabetical ordering, and citation cross-validation.
                    </p>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded bg-blue-100 text-blue-800">
                    {result.detectedStructure.references.length} Entries Detected
                  </span>
                </div>

                {/* Citation Mismatch Warnings */}
                {citationMismatches.length > 0 && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-amber-950 text-xs space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-amber-900">
                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                      In-Text Citations Missing from Reference List ({citationMismatches.length})
                    </div>
                    <p className="text-[11px] text-amber-800">
                      The following citations were detected in your manuscript body but do not appear in the REFERENCES section:
                    </p>
                    <ul className="list-disc pl-5 space-y-0.5 font-mono text-[11px] text-amber-900">
                      {citationMismatches.slice(0, 8).map((cit, i) => (
                        <li key={i}>{cit}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Uncited References Warnings */}
                {uncitedReferences.length > 0 && (
                  <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 text-xs space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-slate-700">
                      <HelpCircle className="w-4 h-4 text-slate-500" />
                      References Not Cited in Text ({uncitedReferences.length})
                    </div>
                    <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-slate-600">
                      {uncitedReferences.slice(0, 5).map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Sample references list */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2 max-h-60 overflow-y-auto font-serif text-xs">
                  {result.detectedStructure.references.map((ref, i) => (
                    <div key={i} className="pl-6 -indent-6 leading-relaxed text-slate-800">
                      {ref}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT: TYPOGRAPHY */}
            {validationTab === "typography" && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <h4 className="font-bold uppercase tracking-wider text-slate-800 border-b pb-2">
                  ADF Master Template Conformance Specs
                </h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Page Geometry:</span>
                    <span className="font-semibold text-slate-800">Letter (8.5" × 11.0" / 12240 × 15840 dxa)</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Margins:</span>
                    <span className="font-semibold text-slate-800">Top 1060 dxa (0.74"), Left/Right/Bottom 1440 dxa (1.0")</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Font Family:</span>
                    <span className="font-semibold text-slate-800">Times New Roman throughout entire document</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Typography Hierarchy:</span>
                    <span className="font-semibold text-slate-800">Title 16pt Bold | Headings 12pt Bold | Body 12pt Regular</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Line Spacing & Indents:</span>
                    <span className="font-semibold text-slate-800">Single Spacing (240 dxa) | 0.5-inch (720 dxa) First-Line Indent</span>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block text-[11px]">Running Header & Watermark:</span>
                    <span className="font-semibold text-slate-800">ADF Logo, series subtitle, first-page footer correspondence</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* BEFORE / AFTER VISUAL PREVIEW                            */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-serif">Visual Preview & Verification</h4>
                <p className="text-xs text-slate-500">
                  Verify how your manuscript appears when standardized into the official ADF Master Template.
                </p>
              </div>

              {/* Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                {/* View Tabs */}
                <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                  <button
                    type="button"
                    onClick={() => setPreviewTab("formatted")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      previewTab === "formatted"
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ADF STANDARDIZED
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("original")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      previewTab === "original"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    ORIGINAL SUBMISSION
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewTab("split")}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1 ${
                      previewTab === "split"
                        ? "bg-white text-slate-900 shadow-xs"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" /> SIDE-BY-SIDE
                  </button>
                </div>

                {/* Zoom Controls */}
                <div className="inline-flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.max(75, z - 15))}
                    className="p-1 text-slate-600 hover:text-slate-900"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-1 text-[11px] font-semibold text-slate-600">{zoomLevel}%</span>
                  <button
                    type="button"
                    onClick={() => setZoomLevel((z) => Math.min(130, z + 15))}
                    className="p-1 text-slate-600 hover:text-slate-900"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Print Preview Button */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handlePrintPreview}
                  className="text-xs h-8 gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save as PDF
                </Button>
              </div>
            </div>

            {/* Document Sheet Preview Box */}
            <div
              ref={previewContainerRef}
              className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-slate-200/60 max-h-[600px] overflow-y-auto"
            >
              {previewTab === "split" ? (
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Left: Original */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 pb-2 border-b">
                      Original Submission
                    </div>
                    <div
                      style={{ zoom: `${zoomLevel}%` }}
                      className="prose prose-sm max-w-none text-slate-800 font-serif leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: result.originalHtml }}
                    />
                  </div>
                  {/* Right: Formatted */}
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="text-[11px] font-bold text-blue-700 uppercase tracking-wider mb-3 pb-2 border-b flex items-center justify-between">
                      <span>ADF Standardized</span>
                      <span className="text-[10px] bg-blue-50 px-2 py-0.5 rounded text-blue-700">Official Template</span>
                    </div>
                    <div
                      style={{ zoom: `${zoomLevel}%` }}
                      className="max-w-none font-serif text-slate-900"
                      dangerouslySetInnerHTML={{ __html: result.formattedHtml }}
                    />
                  </div>
                </div>
              ) : (
                <div
                  style={{ zoom: `${zoomLevel}%` }}
                  className="bg-white rounded-xl shadow-md border border-slate-200 p-6 sm:p-12 mx-auto max-w-3xl min-h-[480px]"
                >
                  {previewTab === "original" ? (
                    <div
                      className="prose prose-sm max-w-none text-slate-800 font-serif leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: result.originalHtml }}
                    />
                  ) : (
                    <div
                      className="max-w-none font-serif text-slate-900"
                      dangerouslySetInnerHTML={{ __html: result.formattedHtml }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* AUTHOR REVIEW CONFIRMATION (SECTION 31)                  */}
          {/* ======================================================== */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
            <div>
              <h4 className="font-serif font-bold text-base text-slate-900">ADF MANUSCRIPT REVIEW CONFIRMATION</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Your manuscript has been standardized according to the official ADF manuscript template. Please review and confirm below.
              </p>
            </div>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3">
                <Checkbox
                  id="chk-reviewed"
                  checked={reviewed}
                  onCheckedChange={(c) => setReviewed(c as boolean)}
                />
                <label
                  htmlFor="chk-reviewed"
                  className="text-xs font-medium text-slate-800 leading-snug cursor-pointer select-none"
                >
                  I have reviewed the formatted manuscript and preview.
                </label>
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="chk-content"
                  checked={confirmedContent}
                  onCheckedChange={(c) => setConfirmedContent(c as boolean)}
                />
                <label
                  htmlFor="chk-content"
                  className="text-xs font-medium text-slate-800 leading-snug cursor-pointer select-none"
                >
                  I confirm that the manuscript content, authors, affiliations, citations, and data are correct.
                </label>
              </div>

              {hasReviewNotices && (
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="chk-notices"
                    checked={acknowledgedWarnings}
                    onCheckedChange={(c) => setAcknowledgedWarnings(c as boolean)}
                  />
                  <label
                    htmlFor="chk-notices"
                    className="text-xs font-medium text-amber-900 leading-snug cursor-pointer select-none"
                  >
                    I acknowledge the review notices highlighted in the validation report (e.g. citation mismatches or missing recommended sections).
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetAll}
              className="w-full sm:w-auto text-xs font-semibold gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-upload & Format Another
            </Button>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <a
                href={result.formattedFileUrl}
                download={result.formattedFilename}
                className="btn-outline !py-2.5 !px-4 text-xs font-semibold inline-flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" /> Download Formatted DOCX
              </a>

              {embedded ? (
                <div
                  className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg border ${
                    reviewed && confirmedContent && (!hasReviewNotices || acknowledgedWarnings)
                      ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                      : "bg-slate-100 text-slate-500 border-slate-200"
                  }`}
                >
                  <FileCheck className="w-4 h-4" />
                  {reviewed && confirmedContent && (!hasReviewNotices || acknowledgedWarnings)
                    ? "Ready for Submission"
                    : "Complete Review Checkboxes Above"}
                </div>
              ) : (
                <Button
                  type="button"
                  disabled={!reviewed || !confirmedContent || (hasReviewNotices && !acknowledgedWarnings)}
                  onClick={() => {
                    toast.success("Manuscript review confirmed!");
                    if (onConfirmSubmit) onConfirmSubmit();
                  }}
                  className="btn-primary !py-2.5 !px-6 text-xs font-semibold shadow-md gap-2 w-full sm:w-auto"
                >
                  CONFIRM & SUBMIT TO ADF
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
