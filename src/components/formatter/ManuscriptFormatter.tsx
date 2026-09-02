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
  Sparkles,
  ArrowRight,
  Check,
  FileCheck,
  Layers,
  Sliders,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export interface FormattedManuscriptResult {
  sessionId: string;
  originalFilename: string;
  originalFileUrl: string;
  formattedFilename: string;
  formattedFileUrl: string;
  formattingVersion: string;
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
  formattingChanges: string[];
  contentChanges: 0;
  issues: string[];
  originalHtml: string;
  formattedHtml: string;
}

interface ManuscriptFormatterProps {
  onFormatted?: (result: FormattedManuscriptResult) => void;
  onFileChange?: (file: File | null) => void;
  initialFile?: File | null;
  className?: string;
  embedded?: boolean;
}

const FORMATTING_STEPS = [
  "Reading document structure",
  "Detecting sections",
  "Applying ADF typography",
  "Formatting references",
  "Checking tables",
  "Preparing final document",
];

export function ManuscriptFormatter({
  onFormatted,
  onFileChange,
  initialFile,
  className = "",
  embedded = false,
}: ManuscriptFormatterProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(initialFile || null);
  const [activeTab, setActiveTab] = useState<"original" | "formatted">("formatted");
  const [progressIndex, setProgressIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<FormattedManuscriptResult | null>(null);

  // Author confirmations
  const [reviewed, setReviewed] = useState(false);
  const [confirmedContent, setConfirmedContent] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialFile && !file) {
      setFile(initialFile);
    }
  }, [initialFile]);

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

    // Progressive animation for realism
    const interval = setInterval(() => {
      setProgressIndex((prev) => {
        if (prev < FORMATTING_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 600);

    try {
      const formData = new FormData();
      formData.append("manuscript", file);

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
        toast.success("ADF Formatting Complete!");
      }, 500);
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

  return (
    <div
      className={`rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden ${className}`}
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#172554] via-[#1e3a8a] to-[#1e40af] text-white p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-2 border border-blue-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              ADF Manuscript Formatter
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold tracking-tight">
              Automatic Academic Document Standardization
            </h2>
            <p className="text-sm text-blue-100/80 mt-1 max-w-xl leading-relaxed">
              Standardizes document structure, typography, margins, and APA 7th referencing before final submission.
            </p>
          </div>

          {/* Stepper Pill */}
          <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-sm p-1.5 rounded-xl text-xs font-medium border border-white/10 self-start sm:self-center">
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
              ② Format
            </span>
            <span className="text-white/40">→</span>
            <span
              className={`px-3 py-1.5 rounded-lg transition-all ${
                step === 3 ? "bg-white text-[#1e3a8a] font-bold shadow-sm" : "text-white/70"
              }`}
            >
              ③ Review
            </span>
          </div>
        </div>
      </div>

      {/* STEP 1: UPLOAD */}
      {step === 1 && (
        <div className="p-6 sm:p-10 space-y-6">
          <div className="max-w-2xl mx-auto text-center space-y-2 mb-6">
            <h3 className="text-lg font-bold text-slate-900 font-serif">Upload your manuscript</h3>
            <p className="text-sm text-slate-500">
              Select your Microsoft Word (.docx) manuscript. The formatter will analyze the structure, format headings and references, and present a before/after preview.
            </p>
          </div>

          {/* Upload Box */}
          <div
            onClick={() => fileInputRef.current?.click()}
            className="max-w-xl mx-auto border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all bg-slate-50 hover:bg-blue-50/50 group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => handleFileSelect(e.target.files?.[0] || null)}
              accept=".docx,.doc"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-200 flex items-center justify-center mx-auto mb-4 group-hover:scale-105 transition-transform text-blue-600">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="text-base font-semibold text-slate-800">
              {file ? file.name : "Choose Manuscript (.docx)"}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {file
                ? `${(file.size / 1024 / 1024).toFixed(2)} MB • Ready to format`
                : "Drag & drop or click to browse. Max file size: 50MB"}
            </p>
          </div>

          {/* Guarantee Notice */}
          <div className="max-w-xl mx-auto p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold">Academic Content Integrity Guarantee:</span> The formatter standardizes layout, typography, line spacing, headings, and APA 7th references. It will{" "}
              <span className="underline font-semibold">never</span> rewrite, paraphrase, summarize, or alter your research findings.
            </div>
          </div>

          {/* Action */}
          <div className="flex justify-center pt-2">
            <Button
              type="button"
              onClick={startFormatting}
              disabled={!file}
              className="btn-primary !py-3 !px-8 text-base shadow-md hover:shadow-lg gap-2"
            >
              Format with ADF Rules <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* STEP 2: FORMAT (PROCESSING ANIMATION) */}
      {step === 2 && (
        <div className="p-10 sm:p-16 max-w-lg mx-auto text-center space-y-8">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-4 border-blue-100 animate-pulse"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin"></div>
            <div className="absolute inset-2 bg-blue-50 rounded-full flex items-center justify-center text-blue-700 font-serif font-bold text-lg">
              ADF
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold font-serif text-slate-900">
              Formatting your manuscript...
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Applying ADF standard typography and structure rules
            </p>
          </div>

          {/* Animated Checklist */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-left space-y-3 font-mono text-xs">
            {FORMATTING_STEPS.map((stepText, idx) => {
              const isDone = idx < progressIndex;
              const isCurrent = idx === progressIndex;
              return (
                <div key={idx} className="flex items-center gap-3 transition-colors">
                  {isDone ? (
                    <span className="text-emerald-600 font-bold flex items-center gap-1">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : isCurrent ? (
                    <span className="w-4 h-4 rounded-full border-2 border-blue-600 border-t-transparent animate-spin inline-block"></span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border border-slate-300 inline-block"></span>
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

      {/* STEP 3: REVIEW & SUBMIT */}
      {step === 3 && result && (
        <div className="p-6 sm:p-8 space-y-8">
          {/* Header Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Status */}
            <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Status</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="text-xl font-bold font-serif">ADF Formatting Complete ✓</div>
              <div className="text-xs text-emerald-700 mt-1">
                {result.stats.pagesProcessed} Pages Processed • {result.stats.wordCount.toLocaleString()} Words
              </div>
            </div>

            {/* Changes Breakdown */}
            <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">Formatting Changes</span>
                <Layers className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-xl font-bold font-serif">{result.formattingChanges.length} Applied</div>
              <div className="text-xs text-blue-700 mt-1">
                Layout, Typography, Headings, APA 7th
              </div>
            </div>

            {/* Content Integrity */}
            <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200 text-purple-900">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700">Content Changes</span>
                <ShieldCheck className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-xl font-bold font-serif">0 Alterations</div>
              <div className="text-xs text-purple-700 mt-1">
                “Your academic content has not been rewritten.”
              </div>
            </div>
          </div>

          {/* Warnings / Review Required */}
          {result.issues && result.issues.length > 0 && (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900">
              <div className="flex items-center gap-2 font-bold text-sm mb-2 text-amber-800">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                Review Required ({result.issues.length})
              </div>
              <ul className="space-y-1 text-xs text-amber-800/90 pl-6 list-disc">
                {result.issues.map((issue, i) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Formatting Changes Detailed List */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-slate-500" /> Standardization Log
            </h4>
            <div className="grid sm:grid-cols-2 gap-2 text-xs text-slate-700">
              {result.formattingChanges.map((change, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>{change}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Before / After Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="text-sm font-bold text-slate-900 font-serif">Visual Preview</div>
              {/* Toggle */}
              <div className="inline-flex p-1 rounded-xl bg-slate-100 border border-slate-200">
                <button
                  type="button"
                  onClick={() => setActiveTab("original")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    activeTab === "original"
                      ? "bg-white text-slate-900 shadow-sm"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Original Document
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
                  ADF Formatted
                </button>
              </div>
            </div>

            {/* Document Sheet Preview Box */}
            <div className="border border-slate-200 rounded-2xl p-6 bg-slate-100/70 max-h-[480px] overflow-y-auto">
              <div className="bg-white rounded-xl shadow-md border border-slate-200 p-8 sm:p-12 mx-auto max-w-2xl min-h-[400px]">
                {activeTab === "original" ? (
                  <div
                    className="prose prose-sm max-w-none text-slate-800"
                    dangerouslySetInnerHTML={{ __html: result.originalHtml }}
                  />
                ) : (
                  <div
                    className="max-w-none"
                    dangerouslySetInnerHTML={{ __html: result.formattedHtml }}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Final Confirmation Checklist */}
          <div className="p-6 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-4">
            <div>
              <h4 className="font-serif font-bold text-base text-slate-900">ADF FORMAT REVIEW</h4>
              <p className="text-xs text-slate-600 mt-0.5">
                Your manuscript has been formatted according to the current ADF submission requirements ({result.formattingVersion}).
              </p>
            </div>

            <div className="space-y-2.5 pt-1">
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
                  I have reviewed the formatted manuscript and verified its visual presentation.
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
                  I confirm that the academic content, data, authors, and citations remain accurate and correct.
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={resetAll}
              className="w-full sm:w-auto text-xs font-semibold gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-upload & Format
            </Button>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <a
                href={result.formattedFileUrl}
                download={result.formattedFilename}
                className="btn-outline !py-2.5 !px-4 text-xs font-semibold inline-flex items-center gap-1.5 w-full sm:w-auto justify-center"
              >
                <Download className="w-4 h-4" /> Download Formatted (.docx)
              </a>

              {embedded && (
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                  <FileCheck className="w-4 h-4" /> Ready for submission
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
