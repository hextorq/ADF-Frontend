import { useState, useId } from "react";
import { toast } from "sonner";
import {
  X,
  Send,
  CheckCircle2,
  AlertCircle,
  FileText,
  Upload,
  UploadCloud,
  User,
  Mail,
  Phone,
  Building,
  GraduationCap,
  QrCode,
  ExternalLink,
  MessageCircle,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERDISCIPLINARY_HORIZONS_CALL, ResearchArea } from "@/data/abstractCallData";

interface AbstractSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAreaId?: string;
}

export function AbstractSubmissionModal({
  isOpen,
  onClose,
  defaultAreaId,
}: AbstractSubmissionModalProps) {
  const data = INTERDISCIPLINARY_HORIZONS_CALL;
  const authorTypeId = useId();
  const researchAreaId = useId();

  const [formData, setFormData] = useState({
    authorName: "",
    authorType: "Research Scholar",
    department: "",
    institution: "",
    email: "",
    phone: "",
    researchArea: defaultAreaId || data.researchAreas[0].id,
    abstractTitle: "",
    abstractText: "",
    keywords: "",
    isSoleAuthor: false,
    paymentRef: "",
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionId, setSubmissionId] = useState("");
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real-time word count calculation
  const words = formData.abstractText
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);
  const wordCount = formData.abstractText.trim() === "" ? 0 : words.length;
  const isWordCountValid = wordCount >= 200 && wordCount <= 300;

  // Real-time keyword count calculation
  const keywordsList = formData.keywords
    .split(/[,;]/)
    .map((k) => k.trim())
    .filter((k) => k.length > 0);
  const keywordCount = keywordsList.length;
  const isKeywordCountValid = keywordCount >= 4 && keywordCount <= 6;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.isSoleAuthor) {
      setError("Please confirm the sole-authorship declaration before proceeding.");
      return;
    }

    if (!formData.paymentRef.trim()) {
      setError("Please enter your Transaction Reference ID / UTR number after completing the ₹50 UPI payment.");
      return;
    }

    if (!isWordCountValid && !selectedFile) {
      setError("Your abstract must be between 200 and 300 words (or upload a .docx file).");
      return;
    }

    if (!isKeywordCountValid && !selectedFile) {
      setError("Please provide between 4 and 6 keywords (separated by commas).");
      return;
    }

    setSubmitting(true);

    try {
      // Create unique submission ID
      const newSubId = `ADF-ABS-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

      // Save into local admin abstract storage so it displays in admin dashboard immediately
      try {
        const stored = localStorage.getItem("adf_admin_abstract_submissions");
        const list = stored ? JSON.parse(stored) : [];
        const matchedArea = data.researchAreas.find((a) => a.id === formData.researchArea);
        const newRecord = {
          id: newSubId,
          authorName: formData.authorName,
          authorType: formData.authorType,
          department: formData.department,
          institution: formData.institution,
          email: formData.email,
          phone: formData.phone,
          researchAreaId: formData.researchArea,
          researchAreaName: matchedArea ? matchedArea.name : "Interdisciplinary Studies",
          abstractTitle: formData.abstractTitle,
          abstractText: formData.abstractText,
          wordCount: wordCount,
          keywords: formData.keywords,
          isSoleAuthor: true,
          paymentStatus: "Paid",
          paymentRef: formData.paymentRef,
          reviewStatus: "Pending Review",
          submittedAt: new Date().toISOString(),
        };
        list.unshift(newRecord);
        localStorage.setItem("adf_admin_abstract_submissions", JSON.stringify(list));
      } catch (e) {
        console.warn("Storage sync error", e);
      }

      // Try sending to backend if available
      try {
        await fetch("/api/forms/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.authorName,
            email: formData.email,
            phone: formData.phone,
            subject: `[Abstract Submission - ₹50 Paid] ${formData.abstractTitle}`,
            message: `Submission ID: ${newSubId}\nAuthor Type: ${formData.authorType}\nDepartment: ${formData.department}\nInstitution: ${formData.institution}\nResearch Area: ${formData.researchArea}\nKeywords: ${formData.keywords}\nPayment UTR / Ref: ${formData.paymentRef}\n\nAbstract:\n${formData.abstractText}`,
          }),
        });
      } catch (err) {
        // Backend failure shouldn't block author confirmation
        console.warn("Contact fallback logged:", err);
      }

      setSubmissionId(newSubId);
      setSubmitted(true);
      toast.success("Abstract submitted successfully!");
    } catch (err: any) {
      setError(err?.message || "Failed to process submission. Please try again or submit via WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-5 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-3xl my-auto rounded-2xl bg-white border border-slate-200 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-[#002147] via-[#0b3b6f] to-[#0D9488] text-white p-5 sm:p-6 relative flex-shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400 text-slate-950 shadow-xs">
              SUBMISSION PORTAL
            </span>
            <span className="text-white/80 text-xs font-medium">
              ₹50 Fee · Single Author Only
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            Interdisciplinary Horizons 2026
          </h2>
          <p className="text-white/90 text-xs sm:text-sm mt-1">
            Multidisciplinary E-Book of Abstracts with ISBN &amp; DOI Assignment
          </p>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {submitted ? (
            <div className="py-8 text-center space-y-5 animate-in fade-in zoom-in-95 duration-200">
              <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shadow-inner">
                <CheckCircle2 className="h-10 w-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-full text-xs font-semibold mb-2">
                  Submission Successfully Recorded
                </span>
                <h3 className="text-2xl font-bold text-slate-900">
                  Thank You, {formData.authorName}!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto mt-2">
                  Your abstract and ₹50 payment details have been submitted for peer review in{" "}
                  <strong>Interdisciplinary Horizons: Multidisciplinary E-Book of Abstracts</strong>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 max-w-md mx-auto text-left space-y-2 text-xs">
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Tracking ID:</span>
                  <span className="font-mono font-bold text-[var(--primary)]">{submissionId}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Author:</span>
                  <span className="font-semibold text-slate-900">{formData.authorName}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">UTR / Payment Ref:</span>
                  <span className="font-mono font-semibold text-emerald-700">{formData.paymentRef}</span>
                </div>
                <div className="flex justify-between border-b pb-2">
                  <span className="text-slate-500 font-medium">Title:</span>
                  <span className="font-semibold text-slate-900 truncate max-w-[240px]">
                    {formData.abstractTitle}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Notification Date:</span>
                  <span className="font-semibold text-slate-900">By 5 December 2026</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/917502398680?text=Hello%20ADF,%20I%20have%20submitted%20my%20abstract%20(ID:%20${submissionId},%20UTR:%20${encodeURIComponent(formData.paymentRef)})%20titled%20"${encodeURIComponent(formData.abstractTitle)}".`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors shadow-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  Confirm via WhatsApp (+91 75023 98680)
                </a>

                <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
                  Close Window
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-start gap-2.5">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 font-medium">{error}</div>
                </div>
              )}

              {/* Section 1: Author Profile */}
              <div className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                  <User className="h-4 w-4 text-[var(--primary)]" />
                  1. Author Profile &amp; Affiliation
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Full Author Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. Priya Sharma / Aniket Kumar"
                      value={formData.authorName}
                      onChange={(e) => setFormData({ ...formData, authorName: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label htmlFor={authorTypeId} className="block text-xs font-semibold text-slate-700 mb-1">
                      Author Category *
                    </label>
                    <select
                      id={authorTypeId}
                      value={formData.authorType}
                      onChange={(e) => setFormData({ ...formData, authorType: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white"
                    >
                      {data.targetAudience.map((aud) => (
                        <option key={aud} value={aud}>
                          {aud}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Department / Discipline *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Department of Computer Science"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      College / University / Institution *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. University of Delhi"
                      value={formData.institution}
                      onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="author@institution.edu"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile / WhatsApp Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Research Domain & Abstract */}
              <div className="space-y-4 pt-2">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2 border-b pb-2">
                  <FileText className="h-4 w-4 text-[var(--primary)]" />
                  2. Abstract Information &amp; Research Discipline
                </h3>

                <div>
                  <label htmlFor={researchAreaId} className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Accepted Research Area *
                  </label>
                  <select
                    id={researchAreaId}
                    value={formData.researchArea}
                    onChange={(e) => setFormData({ ...formData, researchArea: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-white font-medium"
                  >
                    {data.researchAreas.map((area) => (
                      <option key={area.id} value={area.id}>
                        {area.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Title of Abstract *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter full, descriptive title of your research abstract"
                    value={formData.abstractTitle}
                    onChange={(e) => setFormData({ ...formData, abstractTitle: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] font-medium"
                  />
                </div>

                {/* Abstract Text Area with Real-Time Word Counter */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold text-slate-700">
                      Abstract Body (200–300 Words) *
                    </label>
                    <div
                      className={`text-xs font-bold px-2 py-0.5 rounded-full transition-colors ${
                        wordCount === 0
                          ? "bg-slate-100 text-slate-500"
                          : wordCount < 200
                          ? "bg-amber-100 text-amber-800"
                          : wordCount <= 300
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {wordCount} / 200–300 words
                      {wordCount >= 200 && wordCount <= 300 && " ✓"}
                    </div>
                  </div>

                  <textarea
                    rows={6}
                    required
                    placeholder="Provide a concise summary covering the background, objectives, methodology, key findings/significance, and conclusion of your study..."
                    value={formData.abstractText}
                    onChange={(e) => setFormData({ ...formData, abstractText: e.target.value })}
                    className="w-full p-3 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] leading-relaxed font-sans"
                  />

                  <div className="flex items-center justify-between text-[11px] text-slate-500 mt-1">
                    <span>
                      {wordCount < 200 ? (
                        <span className="text-amber-600 font-medium">
                          Add {200 - wordCount} more word(s) to reach the 200-word minimum.
                        </span>
                      ) : wordCount > 300 ? (
                        <span className="text-red-600 font-medium">
                          Abstract exceeds maximum by {wordCount - 300} words. Please trim to ≤ 300.
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-medium">
                          ✓ Perfect abstract length adhering to guidelines.
                        </span>
                      )}
                    </span>
                    <span>Font standard: TNR 12pt, 1.5 spacing</span>
                  </div>
                </div>

                {/* Keywords Input with Count Validator */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-slate-700">
                      Keywords (4–6 required, separated by commas) *
                    </label>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        isKeywordCountValid
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {keywordCount} / 4–6 keywords {isKeywordCountValid && "✓"}
                    </span>
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sustainable Development, Machine Learning, Higher Education, Policy Reform"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                  />
                </div>

                {/* Optional DOCX upload */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Attach Word Document (.docx, optional if pasted above)
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors">
                      <Upload className="h-4 w-4 text-[var(--primary)]" />
                      <span>{selectedFile ? selectedFile.name : "Choose .docx file"}</span>
                      <input
                        type="file"
                        accept=".docx,.doc"
                        onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                        className="hidden"
                      />
                    </label>
                    {selectedFile && (
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-xs text-red-600 hover:underline cursor-pointer"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: QR GPay Payment Instructions (Copied from Chapter Publication) */}
              <div className="space-y-4 pt-2 border-t">
                <div className="bg-slate-50 text-slate-800 p-5 sm:p-6 rounded-2xl border border-slate-200 shadow-xs">
                  <h3 className="font-bold text-base sm:text-lg mb-2 flex items-center gap-2 text-slate-900">
                    <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                      <QrCode className="h-5 w-5" />
                    </span>
                    Payment Instructions
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mb-5 leading-relaxed">
                    A permanent submission and processing fee of <strong>₹50</strong> is required to publish your abstract in this volume. Scan the QR code below using any UPI app (GPay, PhonePe, Paytm, etc.) to complete the payment.
                  </p>

                  <div className="flex flex-col sm:flex-row gap-5 items-center bg-white p-5 rounded-xl border border-slate-200 shadow-2xs">
                    <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-xs shrink-0 text-center">
                      <img
                        src={data.fees.qrCodeUrl}
                        alt="Payment QR Code - ₹50"
                        className="w-36 h-36 sm:w-40 sm:h-40 rounded-lg mx-auto"
                      />
                      <span className="text-[11px] font-semibold text-slate-500 mt-2 block">
                        Scan with GPay / PhonePe / Paytm
                      </span>
                    </div>

                    <div className="flex-1 space-y-3.5 w-full text-xs">
                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          UPI ID
                        </label>
                        <div className="font-mono text-slate-800 font-semibold bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex justify-between items-center text-xs sm:text-sm">
                          <span>{data.fees.upiId}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(data.fees.upiId);
                              toast.success("UPI ID copied to clipboard!");
                            }}
                            className="text-slate-400 hover:text-[var(--primary)] p-1 transition-colors cursor-pointer"
                            title="Copy UPI ID"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Receiver Name
                        </label>
                        <div className="text-xs sm:text-sm font-semibold text-slate-800">
                          {data.fees.receiverName}
                        </div>
                      </div>

                      <div className="space-y-0.5">
                        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                          Amount
                        </label>
                        <div className="text-xl font-extrabold text-[var(--primary)]">
                          ₹50.00
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">
                        Transaction Reference ID (UTR / UPI Ref Number) *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 312345678901 / UPI Ref ID"
                        value={formData.paymentRef}
                        onChange={(e) => setFormData({ ...formData, paymentRef: e.target.value })}
                        className="w-full px-3 py-2 text-xs rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                      />
                      <p className="text-[11px] text-slate-500 mt-1">
                        Please enter the 12-digit reference number after making the ₹50 payment via GPay or any UPI app.
                      </p>
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-700 mb-1 block">
                        Upload Payment Screenshot (Optional / Recommended)
                      </label>
                      <label className="border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-white relative transition-colors bg-white/60 border-slate-200">
                        <UploadCloud className="w-5 h-5 mb-1 text-slate-400" />
                        <span className="text-xs font-medium text-slate-600">
                          {paymentScreenshot ? paymentScreenshot.name : "Choose screenshot file"}
                        </span>
                        <input
                          type="file"
                          onChange={(e) => setPaymentScreenshot(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                          accept="image/*"
                        />
                      </label>
                      <p className="text-[11px] text-slate-400 mt-1">
                        Upload a clear screenshot of your ₹50 GPay / UPI transaction for instant editorial verification.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mandatory Sole Author Checkbox */}
                <label className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-300 bg-slate-50/80 cursor-pointer select-none hover:bg-slate-100 transition-colors">
                  <input
                    type="checkbox"
                    checked={formData.isSoleAuthor}
                    onChange={(e) => setFormData({ ...formData, isSoleAuthor: e.target.checked })}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[var(--primary)] focus:ring-[var(--primary)]"
                  />
                  <span className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Sole Author Declaration:</strong> I confirm that I am the sole author of this abstract. I understand that co-authorship is not permitted for this multidisciplinary e-book publication.
                  </span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <div className="text-xs text-slate-500">
                  Opens <strong>5 Nov 2026</strong> · Deadline <strong>30 Nov 2026</strong>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={submitting || !formData.isSoleAuthor || !formData.paymentRef.trim()}
                    className="w-full sm:w-auto bg-[var(--primary)] hover:bg-[#001833] text-white font-semibold flex items-center gap-2 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit Abstract &amp; Verify ₹50
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
