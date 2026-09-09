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
    authors: string[];
    affiliations: string[];
    abstract: string;
    keywords: string[];
    headings: { level: number; text: string }[];
    references: string[];
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
  { id: "Literary Publications", label: "Literary Publication (Poetry / Prose / Essay)" },
];

const FORMATTING_STEPS = [
  "Detecting manuscript structure & title",
  "Extracting authors and affiliations",
  "Validating abstract word count (250–300 words)",
  "Verifying keywords & heading hierarchy",
  "Applying ADF typography (Times New Roman)",
  "Validating APA 7th references & in-text citations",
  "Standardizing table and figure positions",
  "Generating official ADF formatted DOCX",
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
  const [activeTab, setActiveTab] = useState<"original" | "formatted">("formatted");
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FormattedManuscriptResult | null>(null);

  // Author Review Confirmations (Section 31)
  const [reviewed, setReviewed] = useState(false);
  const [confirmedContent, setConfirmedContent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

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

      const data = await response.json();

      clearInterval(interval);
      setProgressIndex(FORMATTING_STEPS.length);

      if (!response.ok) {
        throw new Error(data.error || "Formatting failed");
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
  };

  const dashboard = result?.validationReport?.dashboard;
  const finalStatus = dashboard?.finalStatus || (result?.issues && result.issues.length > 0 ? "REVIEW REQUIRED" : "READY FOR AUTHOR REVIEW");

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
              Automatic Academic Document Standardization
            </div>
            <p className="text-xs text-blue-100/80 mt-1 max-w-2xl leading-relaxed">
              Automatically standardize your manuscript according to ADF's official publication format, including document structure, typography, layout, tables, figures and APA 7th edition references.
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
              Select your Word (.docx) file. The engine will analyze headings, author metadata, abstract, tables, figures, and APA 7th references according to the official ADF Master Template.
            </p>
          </div>

          {/* Publication Type Selector */}
          <div className="max-w-xl mx-auto bg-slate-50 p-4 rounded-xl border border-slate-200">
            <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wider">
              Publication Type
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
              Formatting rules and structural sections adapt according to the selected publication category.
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

          {/* Guarantee Notice */}
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold">Content Safety Guarantee:</span> This is a DOCUMENT STANDARDIZATION system, not an AI writing engine. It will <strong>never</strong> rewrite your research findings, change statistics, invent citations, or alter your manuscript meaning. If confidence is low, items are flagged for review.
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
          {/* FINAL STATUS BANNER (Section 28) */}
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

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border shadow-xs text-slate-700">
                {result.formattingChanges.length} Formatting Changes Applied
              </span>
              <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-white border shadow-xs text-purple-700">
                0 Content Rewrites
              </span>
            </div>
          </div>

          {/* ======================================================== */}
          {/* AUTOMATIC VALIDATION DASHBOARD (SECTION 28)              */}
          {/* ======================================================== */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-600" />
                  ADF MANUSCRIPT VALIDATION
                </h3>
                <p className="text-xs text-slate-500">
                  Comprehensive audit verifying structural presence, ADF typography, and APA 7th referencing.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* COLUMN 1: STRUCTURE */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      STRUCTURE
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                      12 Checks
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
              </div>

              {/* COLUMN 2: FORMATTING */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      FORMATTING
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                      7 Conforming
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
              </div>

              {/* COLUMN 3: CONTENT CHECKS & WARNINGS */}
              <div className="space-y-4">
                {/* Content Checks */}
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex items-center justify-between border-b pb-2.5 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      CONTENT CHECKS
                    </span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-purple-100 text-purple-800">
                      Integrity
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
                        <AlertTriangle className="w-4 h-4 text-amber-600" /> WARNINGS ({dashboard.warnings.length})
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
          </div>

          {/* ======================================================== */}
          {/* BEFORE / AFTER PREVIEW (SECTION 29)                       */}
          {/* ======================================================== */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900 font-serif">Visual Preview</h4>
                <p className="text-xs text-slate-500">Compare original submission against ADF standardized layout.</p>
              </div>

              {/* Preview Toggle */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setActiveTab("original")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "original"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ORIGINAL
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("formatted")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "formatted"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  ADF STANDARDIZED
                </button>
              </div>
            </div>

            {/* Document Sheet Preview Box */}
            <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 bg-slate-200/60 max-h-[520px] overflow-y-auto">
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 sm:p-14 mx-auto max-w-2xl min-h-[480px]">
                {activeTab === "original" ? (
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
            </div>
          </div>

          {/* ======================================================== */}
          {/* AUTHOR REVIEW CONFIRMATION (SECTION 31)                  */}
          {/* ======================================================== */}
          <div className="p-6 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-4">
            <div>
              <h4 className="font-serif font-bold text-base text-slate-900">ADF MANUSCRIPT REVIEW</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                "Your manuscript has been standardized according to the official ADF manuscript template."
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
                  I have reviewed the formatted manuscript.
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
                  I confirm that the manuscript content is correct.
                </label>
              </div>
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
              <RefreshCw className="w-3.5 h-3.5" /> Re-upload & Format
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
                <div className={`text-xs font-semibold flex items-center gap-1.5 px-3 py-2 rounded-lg border ${
                  reviewed && confirmedContent
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : "bg-slate-100 text-slate-500 border-slate-200"
                }`}>
                  <FileCheck className="w-4 h-4" />
                  {reviewed && confirmedContent ? "Ready for Submission" : "Complete Review Checkboxes Above"}
                </div>
              ) : (
                <Button
                  type="button"
                  disabled={!reviewed || !confirmedContent}
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
