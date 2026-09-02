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
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  original_url: string;
  formatted_url: string;
  formatting_version: string;
  formatting_status: string;
  author_confirmed: boolean;
  issues: string[];
  created_at: string;
}

export default function AdminManuscriptFormatter() {
  const [activeTab, setActiveTab] = useState<"rules" | "submissions">("rules");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Configurations
  const [configurations, setConfigurations] = useState<FormattingConfig[]>([]);
  const [activeConfig, setActiveConfig] = useState<FormattingConfig | null>(null);

  // Form State for Active Rule Set
  const [version, setVersion] = useState("ADF Format v1.0");
  const [name, setName] = useState("Official ADF Standard Academic Format");
  const [pageSize, setPageSize] = useState("A4");
  const [bodyFont, setBodyFont] = useState("Times New Roman");
  const [bodySizePt, setBodySizePt] = useState(12);
  const [lineSpacing, setLineSpacing] = useState(480); // 480 = double
  const [marginsDxa, setMarginsDxa] = useState(1440); // 1 inch
  const [refStyle, setRefStyle] = useState("APA 7th");

  // Submissions Audit
  const [submissions, setSubmissions] = useState<FormattedSubmission[]>([]);

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
    setPageSize(config.general_settings?.pageSize || "A4");
    setBodyFont(config.typography_settings?.bodyFont || "Times New Roman");
    setBodySizePt(config.typography_settings?.bodySizePt || 12);
    setLineSpacing(config.typography_settings?.lineSpacing || 480);
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
          margins: { top: marginsDxa, bottom: marginsDxa, left: marginsDxa, right: marginsDxa },
          pageNumbering: { enabled: true, position: "bottom-right", format: "arabic" },
        },
        typographySettings: {
          bodyFont,
          bodySizePt,
          lineSpacing,
          firstLineIndentDxa: 720,
          heading1: { font: bodyFont, sizePt: 14, bold: true, spacingBefore: 240, spacingAfter: 120 },
          heading2: { font: bodyFont, sizePt: 13, bold: true, italic: true, spacingBefore: 180, spacingAfter: 60 },
          heading3: { font: bodyFont, sizePt: 12, bold: true, italic: true, spacingBefore: 120, spacingAfter: 60 },
        },
        structureSettings: {
          title: { sizePt: 16, bold: true, alignment: "center", spacingAfter: 240 },
          authors: { sizePt: 12, alignment: "center", spacingAfter: 120 },
          affiliations: { sizePt: 11, italic: true, alignment: "center", spacingAfter: 240 },
          abstract: { required: true, minWords: 150, maxWords: 250, heading: "Abstract" },
          keywords: { required: true, minCount: 5, maxCount: 8, prefix: "Keywords: " },
        },
        tableSettings: {
          numberingStyle: "Table {N}: ",
          captionPosition: "above",
          fontSizePt: 10.5,
        },
        figureSettings: {
          numberingStyle: "Figure {N}: ",
          captionPosition: "below",
          fontSizePt: 10,
        },
        referenceSettings: {
          style: refStyle,
          fontSizePt: 12,
          lineSpacing,
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

  const handleNewVersion = () => {
    const nextVer = `ADF Format v${(configurations.length + 1).toFixed(1)}`;
    setVersion(nextVer);
    setName(`ADF Academic Format (${nextVer})`);
    toast.info(`Drafting new version: ${nextVer}`);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold font-serif text-slate-900">Manuscript Formatting</h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              {version} Active
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated manuscript standardization rules, typography, margins, and audit submission formatting.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1 rounded-xl self-start sm:self-center">
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
            Formatting Rules
          </button>
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
            Submission Audit ({submissions.length})
          </button>
        </div>
      </div>

      {/* TAB 1: RULES CONFIGURATION */}
      {activeTab === "rules" && (
        <div className="space-y-6">
          {/* Version Selector Bar */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Version:</span>
              <div className="flex gap-2">
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
                    {c.version} {c.is_active && "âœ“"}
                  </button>
                ))}
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNewVersion}
              className="text-xs font-semibold gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> New Version
            </Button>
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
                        <SelectItem value="A4">A4 (210 Ã— 297 mm)</SelectItem>
                        <SelectItem value="Letter">US Letter (8.5 Ã— 11 in)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Margins (Inches)</label>
                    <Select
                      value={marginsDxa.toString()}
                      onValueChange={(v) => setMarginsDxa(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1440">1.0 inch (Standard ADF)</SelectItem>
                        <SelectItem value="1080">0.75 inch</SelectItem>
                        <SelectItem value="1800">1.25 inch</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>

            {/* Typography */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-slate-900 flex items-center gap-2 border-b pb-3">
                <FileText className="w-4 h-4 text-blue-600" /> Typography & Spacing
              </h3>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Body Font Family</label>
                    <Select value={bodyFont} onValueChange={setBodyFont}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Times New Roman">Times New Roman (Official)</SelectItem>
                        <SelectItem value="Georgia">Georgia</SelectItem>
                        <SelectItem value="Arial">Arial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Body Font Size</label>
                    <Select
                      value={bodySizePt.toString()}
                      onValueChange={(v) => setBodySizePt(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="12">12 pt (Official ADF)</SelectItem>
                        <SelectItem value="11">11 pt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 block mb-1">Line Spacing</label>
                    <Select
                      value={lineSpacing.toString()}
                      onValueChange={(v) => setLineSpacing(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="480">Double-spaced (2.0)</SelectItem>
                        <SelectItem value="360">1.5 Lines</SelectItem>
                        <SelectItem value="240">Single Spaced (1.0)</SelectItem>
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
                      <SelectItem value="APA 7th">APA 7th Edition (Official)</SelectItem>
                      <SelectItem value="MLA 9th">MLA 9th Edition</SelectItem>
                      <SelectItem value="IEEE">IEEE</SelectItem>
                    </SelectContent>
                  </Select>
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

      {/* TAB 2: SUBMISSIONS AUDIT */}
      {activeTab === "submissions" && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-600">
                Formatted Submissions Log
              </div>
              <Button variant="ghost" size="sm" onClick={fetchSubmissions} className="h-8 text-xs">
                <RefreshCw className="w-3.5 h-3.5 mr-1" /> Refresh
              </Button>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center text-slate-500 text-sm">
                No formatted submissions recorded yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {submissions.map((sub) => {
                  const issuesList = Array.isArray(sub.issues) ? sub.issues : [];
                  return (
                    <div
                      key={sub.submission_id}
                      className="p-6 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border">
                            #{sub.submission_id}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                            {sub.submission_type}
                          </span>
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {new Date(sub.created_at).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="font-serif font-bold text-base text-slate-900">
                          {sub.title || "Untitled Manuscript"}
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-600 pt-1">
                          <div>
                            <span className="text-slate-400 block">Author:</span>
                            <span className="font-medium text-slate-800">{sub.author_name || "Author"}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Format Version:</span>
                            <span className="font-medium text-slate-800">{sub.formatting_version}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Status:</span>
                            <span className="font-semibold text-emerald-700 flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> {sub.formatting_status}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Author Confirmed:</span>
                            <span className="font-semibold text-emerald-700">âœ“ Yes</span>
                          </div>
                        </div>

                        {issuesList.length > 0 && (
                          <div className="text-xs text-amber-700 bg-amber-50/80 p-2 rounded-lg border border-amber-200 flex items-center gap-1.5 mt-2">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            <span>{issuesList.length} review notes flagged</span>
                          </div>
                        )}
                      </div>

                      {/* Action Links */}
                      <div className="flex sm:flex-col gap-2 shrink-0 self-end md:self-center">
                        {sub.formatted_url && (
                          <a
                            href={sub.formatted_url}
                            download
                            className="btn-primary !py-2 !px-3 text-xs font-semibold inline-flex items-center gap-1.5 shadow-sm"
                          >
                            <Download className="w-3.5 h-3.5" /> Download Formatted
                          </a>
                        )}
                        {sub.original_url && (
                          <a
                            href={sub.original_url}
                            download
                            className="btn-outline !py-2 !px-3 text-xs font-semibold inline-flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5" /> Original DOCX
                          </a>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

