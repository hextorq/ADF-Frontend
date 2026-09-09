import React, { useState, useEffect } from "react";
import {
  FileText,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Download,
  Eye,
  Save,
  Plus,
  RefreshCw,
  Clock,
  Layers,
  Upload,
  Check,
  X,
  MessageSquare,
  ShieldCheck,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

interface FormattingConfig {
  id?: number;
  version: string;
  name: string;
  is_active: boolean;
  general_settings: any;
  typography_settings: any;
  structure_settings: any;
  table_settings: any;
  figure_settings: any;
  reference_settings: any;
}

interface FormattedSubmission {
  submission_id: string;
  title: string;
  author_name: string;
  submission_type: string;
  publication_type: string;
  original_url: string;
  formatted_url: string;
  formatting_version: string;
  formatting_status: string;
  submission_status: string;
  author_confirmed: boolean;
  issues: string[];
  validation_report?: any;
  admin_notes?: string;
  created_at: string;
}

export default function AdminManuscriptFormatter() {
  const [activeTab, setActiveTab] = useState<"submissions" | "rules">("submissions");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Configurations
  const [configurations, setConfigurations] = useState<FormattingConfig[]>([]);
  const [activeConfig, setActiveConfig] = useState<FormattingConfig | null>(null);

  // Form State for Active Rule Set
  const [version, setVersion] = useState("ADF Format v1.0");
  const [name, setName] = useState("Official ADF Standard Academic Format");
  const [pageSize, setPageSize] = useState("Letter");
  const [bodyFont, setBodyFont] = useState("Times New Roman");
  const [bodySizePt, setBodySizePt] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(240); // 240 = single
  const [marginsDxa, setMarginsDxa] = useState(1440); // 1 inch
  const [refStyle, setRefStyle] = useState("APA 7th");

  // Submissions Audit
  const [submissions, setSubmissions] = useState<FormattedSubmission[]>([]);

  // Modals
  const [reportModalSubmission, setReportModalSubmission] = useState<FormattedSubmission | null>(null);
  const [revisionModalSubmission, setRevisionModalSubmission] = useState<FormattedSubmission | null>(null);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [updatingStatus, setUpdatingStatus] = useState(false);

  // Template Upload Modal
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadVersion, setUploadVersion] = useState("ADF Master Template v1.1");
  const [uploadName, setUploadName] = useState("ADF Standard Academic Template v1.1");
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadIsActive, setUploadIsActive] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchConfigs();
    fetchSubmissions();
  }, []);

  const fetchConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/formatter/config");
      const data = await res.json();
      if (data.configurations && Array.isArray(data.configurations)) {
        setConfigurations(data.configurations);
        const active = data.active || data.configurations[0];
        if (active) {
          setActiveConfig(active);
          populateForm(active);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to load formatting configurations");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/formatter/submissions");
      const data = await res.json();
      if (data.submissions && Array.isArray(data.submissions)) {
        setSubmissions(data.submissions);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const populateForm = (config: FormattingConfig) => {
    setVersion(config.version || "ADF Format v1.0");
    setName(config.name || "ADF Academic Format");
    setPageSize(config.general_settings?.pageSize || "Letter");
    setBodyFont(config.typography_settings?.bodyFont || "Times New Roman");
    setBodySizePt(config.typography_settings?.bodySizePt || 12);
    setLineSpacing(config.typography_settings?.lineSpacing || 240);
    setMarginsDxa(config.general_settings?.margins?.top || 1440);
    setRefStyle(config.reference_settings?.style || "APA 7th");
  };

  const handleSaveConfig = async () => {
    setSaving(true);
    try {
      const payload = {
        version,
        name,
        isActive: true,
        generalSettings: {
          pageSize,
          orientation: "portrait",
          margins: { top: 1060, bottom: marginsDxa, left: marginsDxa, right: marginsDxa },
          pageNumbering: { enabled: true, position: "bottom-right", format: "arabic" },
        },
        typographySettings: {
          bodyFont,
          bodySizePt,
          lineSpacing,
          firstLineIndentDxa: 720,
          heading1: { font: bodyFont, sizePt: 12, bold: true, spacingBefore: 240, spacingAfter: 240 },
          heading2: { font: bodyFont, sizePt: 12, bold: true, spacingBefore: 240, spacingAfter: 240 },
          heading3: { font: bodyFont, sizePt: 12, bold: true, italic: true, spacingBefore: 240, spacingAfter: 240 },
        },
        structureSettings: {
          title: { sizePt: 16, bold: true, alignment: "center", spacingBefore: 240, spacingAfter: 240 },
          authors: { sizePt: 10, bold: true, alignment: "both", spacingBefore: 240, spacingAfter: 360 },
          affiliations: { sizePt: 8, italic: false, alignment: "both", inFooter: true },
          abstract: { required: true, minWords: 250, maxWords: 300, heading: "ABSTRACT" },
          keywords: { required: true, minCount: 5, maxCount: 8, prefix: "KEYWORDS:" },
        },
        tableSettings: {
          numberingStyle: "Table {N}. ",
          captionPosition: "above",
          fontSizePt: 12,
        },
        figureSettings: {
          numberingStyle: "Figure {N}. ",
          captionPosition: "below",
          fontSizePt: 12,
        },
        referenceSettings: {
          style: refStyle,
          fontSizePt: 12,
          lineSpacing: 240,
          hangingIndentDxa: 720,
          alphabeticalSort: true,
        },
      };

      const res = await fetch("/api/formatter/config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save configuration");
      }

      toast.success(`Successfully saved and activated ${version}!`);
      fetchConfigs();
    } catch (err: any) {
      toast.error(err.message || "Could not save configuration");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string, notes?: string) => {
    setUpdatingStatus(true);
    try {
      const res = await fetch(`/api/formatter/submissions/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, adminNotes: notes || "" }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      toast.success(`Submission ${id} updated to ${status}`);
      setRevisionModalSubmission(null);
      setRevisionNotes("");
      fetchSubmissions();
    } catch (err: any) {
      toast.error(err.message || "Error updating submission status");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleUploadTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFile) return toast.error("Please choose a DOCX template file");

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("template", uploadFile);
      formData.append("version", uploadVersion);
      formData.append("name", uploadName);
      formData.append("isActive", uploadIsActive ? "true" : "false");

      const res = await fetch("/api/formatter/template/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to upload template");

      toast.success(`Template ${uploadVersion} uploaded successfully!`);
      setIsUploadModalOpen(false);
      setUploadFile(null);
      fetchConfigs();
    } catch (err: any) {
      toast.error(err.message || "Template upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif text-slate-900">Manuscript Management</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              ADF Formatter • {version}
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Official ADF Template Document Formatter: Audit formatted submissions, inspect validation reports, and configure master template rules.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl self-start sm:self-center">
          <button
            type="button"
            onClick={() => setActiveTab("submissions")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "submissions"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <FileText className="w-3.5 h-3.5 inline mr-1.5" />
            Submissions Audit ({submissions.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("rules")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "rules"
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sliders className="w-3.5 h-3.5 inline mr-1.5" />
            Template & Rules ({configurations.length})
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: SUBMISSIONS AUDIT (SECTION 32)                    */}
      {/* ======================================================== */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                ADF FORMATTER SUBMISSIONS AUDIT
              </div>
              <Button variant="ghost" size="sm" onClick={fetchSubmissions} className="h-8 text-xs gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </Button>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No formatted submissions recorded yet. Submissions processed via the ADF Formatter will appear here.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[10px]">
                    <tr>
                      <th className="p-3.5 pl-5">Submission ID</th>
                      <th className="p-3.5">Author & Title</th>
                      <th className="p-3.5">Publication Type</th>
                      <th className="p-3.5">Template Version</th>
                      <th className="p-3.5">Validation Status</th>
                      <th className="p-3.5">Warnings</th>
                      <th className="p-3.5">Author Confirmed</th>
                      <th className="p-3.5">Submission Status</th>
                      <th className="p-3.5 pr-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {submissions.map((sub) => {
                      const issuesCount = Array.isArray(sub.issues) ? sub.issues.length : 0;
                      const hasErrors = issuesCount > 0;
                      const report = sub.validation_report;
                      const reportStatus = report?.status || (hasErrors ? "REVIEW REQUIRED" : "READY FOR AUTHOR REVIEW");

                      return (
                        <tr key={sub.submission_id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="p-3.5 pl-5 font-mono font-bold text-slate-900 whitespace-nowrap">
                            #{sub.submission_id}
                          </td>

                          <td className="p-3.5 max-w-[220px]">
                            <div className="font-serif font-bold text-slate-900 truncate" title={sub.title}>
                              {sub.title || "Untitled Manuscript"}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              By {sub.author_name || "Author"} • {new Date(sub.created_at).toLocaleDateString()}
                            </div>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {sub.publication_type || sub.submission_type || "Book Chapter"}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap font-medium text-slate-600">
                            {sub.formatting_version || "ADF Format v1.0"}
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                              reportStatus === "READY FOR AUTHOR REVIEW"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              {reportStatus === "READY FOR AUTHOR REVIEW" ? (
                                <CheckCircle2 className="w-3 h-3" />
                              ) : (
                                <AlertTriangle className="w-3 h-3" />
                              )}
                              {reportStatus}
                            </span>
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            {issuesCount > 0 ? (
                              <span className="text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                                {issuesCount} Flagged
                              </span>
                            ) : (
                              <span className="text-emerald-700 font-medium">0 Warnings</span>
                            )}
                          </td>

                          <td className="p-3.5 whitespace-nowrap font-semibold">
                            {sub.author_confirmed ? (
                              <span className="text-emerald-700 flex items-center gap-1">
                                <Check className="w-3.5 h-3.5" /> Yes
                              </span>
                            ) : (
                              <span className="text-slate-400">Pending</span>
                            )}
                          </td>

                          <td className="p-3.5 whitespace-nowrap">
                            <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${
                              sub.submission_status === "Accepted"
                                ? "bg-emerald-600 text-white"
                                : sub.submission_status === "Rejected"
                                ? "bg-red-600 text-white"
                                : sub.submission_status === "Revision Requested"
                                ? "bg-amber-600 text-white"
                                : "bg-slate-100 text-slate-800 border"
                            }`}>
                              {sub.submission_status || "Submitted"}
                            </span>
                          </td>

                          {/* Action Buttons (Section 32) */}
                          <td className="p-3.5 pr-5 text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Validation Report Action */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setReportModalSubmission(sub)}
                                className="h-7 text-xs px-2 gap-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                                title="View Validation Report"
                              >
                                <Eye className="w-3 h-3" /> Report
                              </Button>

                              {/* Formatted File */}
                              {sub.formatted_url && (
                                <a
                                  href={sub.formatted_url}
                                  download
                                  className="h-7 px-2 text-xs font-medium inline-flex items-center gap-1 rounded border border-emerald-200 text-emerald-700 hover:bg-emerald-50 bg-white"
                                  title="Download Formatted DOCX"
                                >
                                  <Download className="w-3 h-3" /> Formatted
                                </a>
                              )}

                              {/* Original File */}
                              {sub.original_url && (
                                <a
                                  href={sub.original_url}
                                  download
                                  className="h-7 px-2 text-xs font-medium inline-flex items-center gap-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 bg-white"
                                  title="Download Original DOCX"
                                >
                                  Original
                                </a>
                              )}

                              {/* Request Revision */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setRevisionModalSubmission(sub);
                                  setRevisionNotes(sub.admin_notes || "");
                                }}
                                className="h-7 text-xs px-2 text-amber-700 hover:bg-amber-50"
                                title="Request Revision"
                              >
                                <MessageSquare className="w-3 h-3" />
                              </Button>

                              {/* Accept */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(sub.submission_id, "Accepted")}
                                className="h-7 text-xs px-2 text-emerald-700 hover:bg-emerald-50"
                                title="Accept Submission"
                              >
                                <Check className="w-3.5 h-3.5" />
                              </Button>

                              {/* Reject */}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleUpdateStatus(sub.submission_id, "Rejected")}
                                className="h-7 text-xs px-2 text-red-600 hover:bg-red-50"
                                title="Reject Submission"
                              >
                                <X className="w-3.5 h-3.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: TEMPLATE VERSIONING & RULES (SECTION 33)          */}
      {/* ======================================================== */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          {/* Version Selector Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Template Versions:</span>
              <div className="flex gap-2 flex-wrap">
                {configurations.map((c) => (
                  <button
                    key={c.version}
                    onClick={() => {
                      setActiveConfig(c);
                      populateForm(c);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                      version === c.version
                        ? "bg-blue-600 text-white border-blue-600 shadow-sm"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {c.version} {c.is_active && "✓ (Active)"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadModalOpen(true)}
                className="text-xs font-semibold gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Upload className="w-3.5 h-3.5" /> Upload Master DOCX
              </Button>
            </div>
          </div>

          {/* Configuration Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Layout */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
                <Layers className="w-4 h-4 text-blue-600" /> General & Page Layout
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Version Identifier</label>
                  <Input value={version} onChange={(e) => setVersion(e.target.value)} />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Configuration Name</label>
                  <Input value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Page Size</label>
                    <Select value={pageSize} onValueChange={setPageSize}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Letter">Letter (8.5" × 11.0" - ADF Official)</SelectItem>
                        <SelectItem value="A4">A4 Standard (210 × 297 mm)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Margins (dxa)</label>
                    <Input
                      type="number"
                      value={marginsDxa}
                      onChange={(e) => setMarginsDxa(Number(e.target.value))}
                    />
                    <span className="text-[10px] text-slate-400">1440 dxa = 1.0 inch</span>
                  </div>
                </div>

                <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl text-xs text-blue-900">
                  <span className="font-bold">Official ADF Master Template Margins:</span>
                  <div className="mt-0.5 text-blue-800">
                    Top: 1060 dxa (0.74 in) • Bottom/Left/Right: 1440 dxa (1.0 in) • Header: 144 dxa • Footer: 350 dxa
                  </div>
                </div>
              </div>
            </div>

            {/* Typography & Referencing */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
                <Sliders className="w-4 h-4 text-blue-600" /> Typography & Referencing
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Body Font Family</label>
                    <Input value={bodyFont} onChange={(e) => setBodyFont(e.target.value)} />
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Body Font Size (pt)</label>
                    <Input
                      type="number"
                      value={bodySizePt}
                      onChange={(e) => setBodySizePt(Number(e.target.value))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Line Spacing</label>
                    <Select value={lineSpacing.toString()} onValueChange={(v) => setLineSpacing(Number(v))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="240">Single Spaced (240 dxa - ADF Official)</SelectItem>
                        <SelectItem value="360">1.5 Lines (360 dxa)</SelectItem>
                        <SelectItem value="480">Double Spaced (480 dxa)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">First-line Indent</label>
                    <Input disabled value="0.5 inch (720 dxa)" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-600 block mb-1">Referencing Standard</label>
                  <Select value={refStyle} onValueChange={setRefStyle}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="APA 7th">APA 7th Edition (Official ADF Mandate)</SelectItem>
                      <SelectItem value="MLA 9th">MLA 9th Edition</SelectItem>
                      <SelectItem value="IEEE">IEEE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
                  <span className="font-bold text-slate-800">Heading Hierarchy:</span> Title: 16pt Bold Center • Headings: 12pt Bold (240 dxa spacing) • Footers: 8pt Times New Roman
                </div>
              </div>
            </div>
          </div>

          {/* Save Action */}
          <div className="flex justify-end pt-2">
            <Button
              type="button"
              onClick={handleSaveConfig}
              disabled={saving}
              className="btn-primary !py-2.5 !px-6 text-sm font-semibold gap-2 shadow-md hover:shadow-lg"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : `Save & Activate ${version}`}
            </Button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* MODAL: VALIDATION REPORT (SECTION 28 & 32)               */}
      {/* ======================================================== */}
      {reportModalSubmission && (
        <Dialog open={!!reportModalSubmission} onOpenChange={() => setReportModalSubmission(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-serif font-bold text-lg flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-blue-600" />
                ADF MANUSCRIPT VALIDATION REPORT
              </DialogTitle>
              <div className="text-xs text-slate-500">
                Submission #{reportModalSubmission.submission_id} • {reportModalSubmission.title}
              </div>
            </DialogHeader>

            <div className="space-y-6 pt-2">
              {/* Report Header Status */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-bold">Template Version Used</div>
                  <div className="font-serif font-bold text-base text-slate-900">
                    {reportModalSubmission.formatting_version || "ADF Master Template v1.0"}
                  </div>
                </div>
                <div>
                  <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${
                    (reportModalSubmission.issues && reportModalSubmission.issues.length > 0)
                      ? "bg-amber-100 text-amber-800"
                      : "bg-emerald-100 text-emerald-800"
                  }`}>
                    {(reportModalSubmission.issues && reportModalSubmission.issues.length > 0)
                      ? "REVIEW REQUIRED"
                      : "READY FOR AUTHOR REVIEW"}
                  </span>
                </div>
              </div>

              {/* Validation Checklist Items */}
              {reportModalSubmission.validation_report?.dashboard ? (
                <div className="space-y-4 text-xs">
                  {/* Structure */}
                  <div className="border rounded-xl p-4 bg-white">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                      <span>Structure Verification</span>
                      <span className="text-blue-600 font-semibold">12 Items</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {reportModalSubmission.validation_report.dashboard.structure?.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-2 p-1.5 rounded bg-slate-50">
                          {item.passed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            {item.details && <p className="text-[11px] text-slate-500">{item.details}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Formatting */}
                  <div className="border rounded-xl p-4 bg-white">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                      <span>Typography & Layout</span>
                      <span className="text-emerald-600 font-semibold">7 Items</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {reportModalSubmission.validation_report.dashboard.formatting?.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-2 p-1.5 rounded bg-slate-50">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            {item.details && <p className="text-[11px] text-slate-500">{item.details}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Content Checks & APA-7 */}
                  <div className="border rounded-xl p-4 bg-white">
                    <h4 className="font-bold text-slate-800 uppercase tracking-wider mb-2.5 flex items-center justify-between">
                      <span>Content Integrity & APA 7th Referencing</span>
                      <span className="text-purple-600 font-semibold">Audited</span>
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {reportModalSubmission.validation_report.dashboard.contentChecks?.map((item: any) => (
                        <div key={item.id} className="flex items-start gap-2 p-1.5 rounded bg-slate-50">
                          {item.passed ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          ) : (
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-semibold text-slate-800">{item.name}</span>
                            {item.details && <p className="text-[11px] text-slate-500">{item.details}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Warnings List */}
              {reportModalSubmission.issues && reportModalSubmission.issues.length > 0 && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Review Warnings Flagged ({reportModalSubmission.issues.length})
                  </div>
                  <ul className="space-y-1 pl-5 list-disc text-amber-900/90">
                    {reportModalSubmission.issues.map((issue, idx) => (
                      <li key={idx}>{issue}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Admin Notes if any */}
              {reportModalSubmission.admin_notes && (
                <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs">
                  <span className="font-bold text-slate-800 block mb-1">Previous Admin Feedback Notes:</span>
                  <p className="text-slate-600 whitespace-pre-wrap">{reportModalSubmission.admin_notes}</p>
                </div>
              )}
            </div>

            <DialogFooter className="pt-4 border-t flex flex-row items-center justify-between sm:justify-between">
              <div className="flex gap-2">
                {reportModalSubmission.formatted_url && (
                  <a
                    href={reportModalSubmission.formatted_url}
                    download
                    className="btn-primary !py-2 !px-3 text-xs font-semibold gap-1 inline-flex items-center"
                  >
                    <Download className="w-3.5 h-3.5" /> Formatted DOCX
                  </a>
                )}
                {reportModalSubmission.original_url && (
                  <a
                    href={reportModalSubmission.original_url}
                    download
                    className="btn-outline !py-2 !px-3 text-xs font-semibold gap-1 inline-flex items-center"
                  >
                    Original DOCX
                  </a>
                )}
              </div>
              <Button variant="outline" size="sm" onClick={() => setReportModalSubmission(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ======================================================== */}
      {/* MODAL: REQUEST REVISION (SECTION 32)                     */}
      {/* ======================================================== */}
      {revisionModalSubmission && (
        <Dialog open={!!revisionModalSubmission} onOpenChange={() => setRevisionModalSubmission(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="font-serif font-bold text-lg">
                Request Manuscript Revision
              </DialogTitle>
              <div className="text-xs text-slate-500">
                Provide feedback and revision instructions for submission #{revisionModalSubmission.submission_id}.
              </div>
            </DialogHeader>

            <div className="space-y-4 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Revision Feedback Notes for Author
                </label>
                <Textarea
                  value={revisionNotes}
                  onChange={(e) => setRevisionNotes(e.target.value)}
                  rows={4}
                  placeholder="e.g., Please expand abstract to 250-300 words as per ADF requirements, and provide full definitions for abbreviations at first appearance..."
                  className="text-xs"
                />
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" size="sm" onClick={() => setRevisionModalSubmission(null)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={updatingStatus}
                onClick={() => handleUpdateStatus(revisionModalSubmission.submission_id, "Revision Requested", revisionNotes)}
                className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold"
              >
                {updatingStatus ? "Submitting..." : "Submit Revision Request"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* ======================================================== */}
      {/* MODAL: UPLOAD MASTER TEMPLATE (SECTION 33)               */}
      {/* ======================================================== */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUploadTemplate} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="font-serif font-bold text-lg">
                Upload Master ADF Template (.docx)
              </DialogTitle>
              <div className="text-xs text-slate-500">
                Upload a new official ADF template file to register version (e.g., v1.1, v2.0).
              </div>
            </DialogHeader>

            <div className="space-y-3 pt-2">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Version String</label>
                <Input
                  required
                  value={uploadVersion}
                  onChange={(e) => setUploadVersion(e.target.value)}
                  placeholder="e.g., ADF Format v1.1"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Template Name</label>
                <Input
                  required
                  value={uploadName}
                  onChange={(e) => setUploadName(e.target.value)}
                  placeholder="e.g., ADF Standard Academic Format (2026 Edition)"
                  className="text-xs"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Choose .docx File</label>
                <Input
                  type="file"
                  required
                  accept=".docx"
                  onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                  className="text-xs"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="chk-active-tmpl"
                  checked={uploadIsActive}
                  onChange={(e) => setUploadIsActive(e.target.checked)}
                  className="rounded border-slate-300"
                />
                <label htmlFor="chk-active-tmpl" className="text-xs text-slate-700 font-medium">
                  Set this version as the active formatting template immediately
                </label>
              </div>
            </div>

            <DialogFooter className="pt-4 border-t">
              <Button variant="outline" size="sm" type="button" onClick={() => setIsUploadModalOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={uploading} className="btn-primary text-xs font-semibold">
                {uploading ? "Uploading..." : "Upload & Register Template"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
