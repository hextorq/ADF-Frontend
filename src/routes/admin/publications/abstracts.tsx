import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  ExternalLink,
  Download,
  Upload,
  Plus,
  Trash2,
  Eye,
  MessageCircle,
  Mail,
  Phone,
  Building,
  User,
  DollarSign,
  Layers,
  Calendar,
  Check,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Info,
  BookOpen,
  Award,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { INTERDISCIPLINARY_HORIZONS_CALL } from "@/data/abstractCallData";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { apiFetch, assetUrl } from "@/lib/api";

export interface AbstractSubmissionRecord {
  id: string;
  authorName: string;
  authorType: string;
  department: string;
  institution: string;
  email: string;
  phone: string;
  researchAreaId: string;
  researchAreaName: string;
  abstractTitle: string;
  abstractText: string;
  wordCount: number;
  keywords: string;
  isSoleAuthor: boolean;
  paymentStatus: "Paid" | "Pending";
  paymentRef: string;
  reviewStatus: "Pending Review" | "Accepted" | "Revision Required" | "Rejected";
  submittedAt: string;
  manuscriptUrl?: string | null;
  paymentScreenshotUrl?: string | null;
  adminNotes?: string;
}

const INITIAL_ABSTRACT_SUBMISSIONS: AbstractSubmissionRecord[] = [
  {
    id: "ADF-ABS-824102-101",
    authorName: "Dr. Ananya Sen",
    authorType: "Faculty Member",
    department: "Department of Computer Science",
    institution: "National Institute of Technology, Trichy",
    email: "ananya.sen@nitt.edu",
    phone: "+91 98401 23456",
    researchAreaId: "computer-science",
    researchAreaName: "Computer Science",
    abstractTitle: "Predictive Analytics for Sustainable Energy Distribution in Hybrid Micro-Grids",
    abstractText: "This research addresses the optimization of renewable resource balancing in modern decentralized micro-grids. Leveraging deep reinforcement learning and temporal convolutional networks, our proposed model forecasts intermittent solar-wind generation with an RMSE of 0.042 across seasonal benchmarks. Numerical simulations indicate an 18.4% reduction in peak-hour transmission curtailment compared to conventional linear programming heuristics. The framework offers practical utility for municipal clean-energy deployment initiatives.",
    wordCount: 228,
    keywords: "Smart Grids, Deep Learning, Renewable Energy, Predictive Dispatch, Sustainable Power",
    isSoleAuthor: true,
    paymentStatus: "Paid",
    paymentRef: "UPI/638291048201",
    reviewStatus: "Accepted",
    submittedAt: "2026-11-04T08:15:00Z",
  },
  {
    id: "ADF-ABS-824102-102",
    authorName: "Karthik Subramanian",
    authorType: "Research Scholar",
    department: "Department of English",
    institution: "Loyola College, Chennai",
    email: "karthik.subramanian@loyola.edu",
    phone: "+91 94440 98765",
    researchAreaId: "english-languages",
    researchAreaName: "English and Languages",
    abstractTitle: "Decolonial Narratives and Eco-Critical Metaphors in Contemporary South Asian Poetry",
    abstractText: "This paper undertakes a comparative eco-critical examination of vernacular poetry translated into contemporary Indian English. Drawing on postcolonial ecocriticism and spatial theory, the study analyzes how indigenous ecological vocabularies disrupt Cartesian nature-culture binaries in recent literary anthologies. The textual analysis illustrates how peripheral poetic meters register anthropogenic climate disruption through localized environmental mythologies, providing vital counter-narratives to dominant developmental discourses.",
    wordCount: 216,
    keywords: "Eco-Criticism, Decolonial Poetics, Translation Studies, Indian English Poetry, Environmental Humanities",
    isSoleAuthor: true,
    paymentStatus: "Paid",
    paymentRef: "UPI/819203810294",
    reviewStatus: "Pending Review",
    submittedAt: "2026-11-04T09:40:00Z",
  },
  {
    id: "ADF-ABS-824102-103",
    authorName: "Meera R. Nair",
    authorType: "Faculty Member",
    department: "Department of Education",
    institution: "Kerala University of Health & Allied Sciences",
    email: "meera.nair@kuhs.ac.in",
    phone: "+91 97451 12340",
    researchAreaId: "education",
    researchAreaName: "Education",
    abstractTitle: "Evaluating Generative AI Integration in Higher Education Pedagogical Assessment",
    abstractText: "The integration of generative artificial intelligence across university curricula necessitates a comprehensive reassessment of authentic learning outcomes. This study surveys 340 university educators to evaluate institutional readiness, rubric modifications, and critical-inquiry task design. Exploratory factor analysis reveals three distinct instructional response categories: defensive restriction, passive adoption, and scaffolded dialogic evaluation. Recommendations for higher education governance and faculty development programs are formulated.",
    wordCount: 234,
    keywords: "Generative AI, Higher Education, Authentic Assessment, Pedagogy, Faculty Development",
    isSoleAuthor: true,
    paymentStatus: "Pending",
    paymentRef: "Pay via WhatsApp",
    reviewStatus: "Revision Required",
    submittedAt: "2026-11-04T10:10:00Z",
  },
];

const LOCAL_STORAGE_KEY = "adf_admin_abstract_submissions";
const CALL_STATUS_KEY = "adf_call_abstracts_status";

export default function AdminAbstractPublications() {
  const call = INTERDISCIPLINARY_HORIZONS_CALL;
  const [submissions, setSubmissions] = useState<AbstractSubmissionRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string>("All");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [selectedPayment, setSelectedPayment] = useState<string>("All");
  const [callActive, setCallActive] = useState(true);
  const [showCallDetails, setShowCallDetails] = useState(false);

  // Detail Modal state
  const [selectedSub, setSelectedSub] = useState<AbstractSubmissionRecord | null>(null);

  // New Submission Modal state
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newSubData, setNewSubData] = useState({
    authorName: "",
    authorType: "Research Scholar",
    department: "",
    institution: "",
    email: "",
    phone: "",
    researchAreaId: call.researchAreas[0].id,
    abstractTitle: "",
    abstractText: "",
    keywords: "",
    paymentStatus: "Paid" as "Paid" | "Pending",
    paymentRef: "Admin Entry",
  });

  const [loading, setLoading] = useState(false);

  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const remoteSubs = await apiFetch<any[]>("/publications/abstracts/admin");
      if (Array.isArray(remoteSubs) && remoteSubs.length > 0) {
        const normalized: AbstractSubmissionRecord[] = remoteSubs.map((r: any) => ({
          id: r.id,
          authorName: r.author_name || r.authorName,
          authorType: r.author_type || r.authorType || "Research Scholar",
          department: r.department || "",
          institution: r.institution || "",
          email: r.email || "",
          phone: r.phone || "",
          researchAreaId: r.research_area_id || r.researchAreaId || "",
          researchAreaName: r.research_area_name || r.researchAreaName || "",
          abstractTitle: r.abstract_title || r.abstractTitle || "",
          abstractText: r.abstract_text || r.abstractText || "",
          wordCount: r.word_count || r.wordCount || 0,
          keywords: r.keywords || "",
          isSoleAuthor: r.is_sole_author ?? r.isSoleAuthor ?? true,
          paymentStatus: r.payment_status || r.paymentStatus || "Pending",
          paymentRef: r.payment_ref || r.paymentRef || "",
          paymentScreenshotUrl: r.payment_screenshot_url || r.paymentScreenshotUrl || null,
          manuscriptUrl: r.manuscript_url || r.manuscriptUrl || null,
          reviewStatus: r.review_status || r.reviewStatus || "Pending Review",
          adminNotes: r.admin_notes || r.adminNotes || "",
          submittedAt: r.created_at || r.submittedAt || new Date().toISOString(),
        }));
        const remoteIds = new Set(remoteSubs.map((r: any) => r.id));
        let storedList: any[] = [];
        try {
          const s = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (s) storedList = JSON.parse(s);
        } catch {}
        const localOnly = storedList.filter((l) => !remoteIds.has(l.id));
        const merged = [...normalized, ...localOnly];
        setSubmissions(merged);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
        setLoading(false);
        return;
      }
    } catch (err) {
      console.warn("Backend fetch error, falling back to local storage:", err);
    }

    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setSubmissions(JSON.parse(stored));
      } else {
        setSubmissions(INITIAL_ABSTRACT_SUBMISSIONS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_ABSTRACT_SUBMISSIONS));
      }
    } catch {
      setSubmissions(INITIAL_ABSTRACT_SUBMISSIONS);
    }
    setLoading(false);
  };

  // Load submissions and call status
  useEffect(() => {
    loadSubmissions();
    try {
      const storedCallStatus = localStorage.getItem(CALL_STATUS_KEY);
      if (storedCallStatus !== null) {
        setCallActive(storedCallStatus === "true");
      }
    } catch {}
  }, []);

  const saveSubmissions = (updated: AbstractSubmissionRecord[]) => {
    setSubmissions(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn("Storage sync failed", e);
    }
  };

  const toggleCallStatus = () => {
    const nextStatus = !callActive;
    setCallActive(nextStatus);
    try {
      localStorage.setItem(CALL_STATUS_KEY, String(nextStatus));
    } catch (e) {
      console.warn("Failed to persist call status", e);
    }
    toast.success(nextStatus ? "Call is now OPEN for submissions" : "Call is now PAUSED / CLOSED");
  };

  const handleStatusChange = async (id: string, newStatus: AbstractSubmissionRecord["reviewStatus"]) => {
    const updated = submissions.map((sub) => (sub.id === id ? { ...sub, reviewStatus: newStatus } : sub));
    saveSubmissions(updated);
    try {
      await apiFetch(`/publications/abstracts/admin/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ review_status: newStatus }),
      });
    } catch (err) {
      console.warn("Failed to sync status to backend:", err);
    }
    toast.success(`Submission status updated to ${newStatus}`);
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub({ ...selectedSub, reviewStatus: newStatus });
    }
  };

  const handlePaymentToggle = async (id: string) => {
    let nextStatus: "Paid" | "Pending" = "Paid";
    const updated = submissions.map((sub) => {
      if (sub.id === id) {
        nextStatus = sub.paymentStatus === "Paid" ? "Pending" : "Paid";
        return { ...sub, paymentStatus: nextStatus };
      }
      return sub;
    });
    saveSubmissions(updated);
    try {
      await apiFetch(`/publications/abstracts/admin/${id}/payment`, {
        method: "PATCH",
        body: JSON.stringify({ payment_status: nextStatus }),
      });
    } catch (err) {
      console.warn("Failed to sync payment to backend:", err);
    }
    toast.success(`Payment marked as ${nextStatus}`);
    if (selectedSub && selectedSub.id === id) {
      setSelectedSub({
        ...selectedSub,
        paymentStatus: nextStatus,
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this abstract submission?")) {
      const updated = submissions.filter((sub) => sub.id !== id);
      saveSubmissions(updated);
      try {
        await apiFetch(`/publications/abstracts/admin/${id}`, {
          method: "DELETE",
        });
      } catch (err) {
        console.warn("Failed to delete on backend:", err);
      }
      toast.info("Submission removed");
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub(null);
      }
    }
  };

  const handleUploadAttachment = async (
    id: string,
    file: File,
    type: "manuscript" | "payment_screenshot"
  ) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const updated = submissions.map((s) => {
        if (s.id === id) {
          return {
            ...s,
            [type === "manuscript" ? "manuscriptUrl" : "paymentScreenshotUrl"]: dataUrl,
          };
        }
        return s;
      });
      saveSubmissions(updated);
      if (selectedSub && selectedSub.id === id) {
        setSelectedSub({
          ...selectedSub,
          [type === "manuscript" ? "manuscriptUrl" : "paymentScreenshotUrl"]: dataUrl,
        });
      }

      // Try syncing to backend
      try {
        const formData = new FormData();
        formData.append(type, file);
        const res = await fetch(`/api/publications/abstracts/admin/${id}/attachments`, {
          method: "PATCH",
          body: formData,
        });
        if (res.ok) {
          const resData = await res.json();
          if (resData?.submission) {
            const serverSub = resData.submission;
            const synced = submissions.map((s) => {
              if (s.id === id) {
                return {
                  ...s,
                  manuscriptUrl: serverSub.manuscript_url || s.manuscriptUrl,
                  paymentScreenshotUrl: serverSub.payment_screenshot_url || s.paymentScreenshotUrl,
                };
              }
              return s;
            });
            saveSubmissions(synced);
            if (selectedSub && selectedSub.id === id) {
              setSelectedSub({
                ...selectedSub,
                manuscriptUrl: serverSub.manuscript_url || selectedSub.manuscriptUrl,
                paymentScreenshotUrl: serverSub.payment_screenshot_url || selectedSub.paymentScreenshotUrl,
              });
            }
          }
        }
      } catch (err) {
        console.warn("Backend sync failed, stored local attachment:", err);
      }
      toast.success(`${type === "manuscript" ? "Abstract manuscript" : "Payment proof"} attached successfully!`);
    };
    reader.readAsDataURL(file);
  };

  const handleAddSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubData.authorName || !newSubData.abstractTitle || !newSubData.abstractText) {
      toast.error("Please fill in author name, abstract title, and text");
      return;
    }

    const words = newSubData.abstractText.trim().split(/\s+/).filter(Boolean).length;
    const matchedArea = call.researchAreas.find((a) => a.id === newSubData.researchAreaId);

    const newRecord: AbstractSubmissionRecord = {
      id: `ADF-ABS-${Math.floor(100000 + Math.random() * 900000)}-${submissions.length + 101}`,
      authorName: newSubData.authorName,
      authorType: newSubData.authorType,
      department: newSubData.department || "Independent",
      institution: newSubData.institution || "Independent Researcher",
      email: newSubData.email || "author@example.com",
      phone: newSubData.phone || "+91 75023 98680",
      researchAreaId: newSubData.researchAreaId,
      researchAreaName: matchedArea ? matchedArea.name : "Interdisciplinary Studies",
      abstractTitle: newSubData.abstractTitle,
      abstractText: newSubData.abstractText,
      wordCount: words,
      keywords: newSubData.keywords || "Interdisciplinary Research",
      isSoleAuthor: true,
      paymentStatus: newSubData.paymentStatus,
      paymentRef: newSubData.paymentRef || "Offline / Admin Recorded",
      reviewStatus: "Pending Review",
      submittedAt: new Date().toISOString(),
    };

    const updated = [newRecord, ...submissions];
    saveSubmissions(updated);
    setIsNewModalOpen(false);
    toast.success(`New abstract recorded: ${newRecord.id}`);
  };

  const exportCSV = () => {
    const headers = [
      "ID",
      "Author",
      "Category",
      "Institution",
      "Department",
      "Discipline",
      "Title",
      "WordCount",
      "Keywords",
      "PaymentStatus",
      "PaymentRef",
      "ReviewStatus",
      "ManuscriptAttachment",
      "PaymentAttachment",
      "Date",
    ];

    const rows = submissions.map((s) => [
      s.id,
      `"${s.authorName.replace(/"/g, '""')}"`,
      `"${s.authorType.replace(/"/g, '""')}"`,
      `"${s.institution.replace(/"/g, '""')}"`,
      `"${s.department.replace(/"/g, '""')}"`,
      `"${s.researchAreaName.replace(/"/g, '""')}"`,
      `"${s.abstractTitle.replace(/"/g, '""')}"`,
      s.wordCount,
      `"${s.keywords.replace(/"/g, '""')}"`,
      s.paymentStatus,
      `"${s.paymentRef.replace(/"/g, '""')}"`,
      s.reviewStatus,
      s.manuscriptUrl ? (s.manuscriptUrl.startsWith("data:") ? "Local Attached (.docx)" : s.manuscriptUrl) : "None",
      s.paymentScreenshotUrl ? (s.paymentScreenshotUrl.startsWith("data:") ? "Local Screenshot Attached" : s.paymentScreenshotUrl) : "None",
      new Date(s.submittedAt).toLocaleDateString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ADF_Abstract_Submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Submissions exported to CSV");
  };

  // Filter Submissions
  const filteredSubmissions = submissions.filter((s) => {
    const matchesSearch =
      searchQuery.trim() === "" ||
      s.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.abstractTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.keywords.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDiscipline = selectedDiscipline === "All" || s.researchAreaId === selectedDiscipline;
    const matchesStatus = selectedStatus === "All" || s.reviewStatus === selectedStatus;
    const matchesPayment = selectedPayment === "All" || s.paymentStatus === selectedPayment;

    return matchesSearch && matchesDiscipline && matchesStatus && matchesPayment;
  });

  // Metrics
  const totalCount = submissions.length;
  const pendingCount = submissions.filter((s) => s.reviewStatus === "Pending Review").length;
  const acceptedCount = submissions.filter((s) => s.reviewStatus === "Accepted").length;
  const revisionCount = submissions.filter((s) => s.reviewStatus === "Revision Required").length;
  const paidCount = submissions.filter((s) => s.paymentStatus === "Paid").length;
  const totalRevenue = paidCount * call.fees.amount;

  return (
    <div className="space-y-6">
      {/* Top Banner & Title Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-teal-100 text-teal-800 border border-teal-200">
              Active Volume Call
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-xs font-bold transition-colors ${
                callActive
                  ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                  : "bg-slate-100 text-slate-600 border border-slate-300"
              }`}
            >
              {callActive ? "● Call is OPEN for Submissions" : "○ Call is PAUSED / CLOSED"}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Call for Abstracts: Interdisciplinary Horizons
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Multidisciplinary E-Book of Abstracts · Opens 5 Nov · Deadline 15 Dec 2026 · ₹50 Fee · ISBN &amp; DOI
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setShowCallDetails(!showCallDetails)}
            variant="outline"
            size="sm"
            className="text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Info className="h-3.5 w-3.5 text-blue-600" />
            {showCallDetails ? "Hide Call Details" : "View Call Guidelines"}
            {showCallDetails ? <ChevronUp className="h-3 w-3 ml-0.5" /> : <ChevronDown className="h-3 w-3 ml-0.5" />}
          </Button>

          <Button
            onClick={() => setIsNewModalOpen(true)}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Record Submission
          </Button>

          <Link
            to="/call-for-abstracts"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
            Live Author Portal
          </Link>

          <Button
            onClick={loadSubmissions}
            variant="outline"
            size="sm"
            disabled={loading}
            className="text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-slate-500 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>

          <Button
            onClick={exportCSV}
            variant="outline"
            size="sm"
            className="text-xs font-semibold rounded-xl flex items-center gap-1.5"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            Export CSV
          </Button>

          <Button
            onClick={toggleCallStatus}
            size="sm"
            className={`text-xs font-semibold rounded-xl cursor-pointer ${
              callActive
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }`}
          >
            {callActive ? "Pause Call" : "Open Call"}
          </Button>
        </div>
      </div>

      {/* Expandable Official Call Specifications Panel */}
      {showCallDetails && (
        <div className="bg-gradient-to-br from-slate-900 via-[#002147] to-[#043d3b] text-white p-6 rounded-2xl shadow-md border border-teal-500/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-400">Official Call Document</span>
              <h2 className="text-lg font-bold text-white">
                INTERDISCIPLINARY HORIZONS: Emerging Trends in Research, Innovation, and Sustainable Development
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-amber-300 font-bold block">Published by: Academic Development Forum</span>
              <span className="text-[11px] text-slate-300">Contact: +91 75023 98680</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-1">
              <div className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">Key Schedule</div>
              <div><strong>Opens:</strong> 5 November 2026</div>
              <div><strong>Deadline:</strong> 15 December 2026</div>
              <div><strong>Fee:</strong> ₹50 per abstract</div>
              <div><strong>Target:</strong> Scholars, Students, Faculty, Academicians</div>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-1">
              <div className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">Submission Rules</div>
              <div><strong>Word Count:</strong> 200–300 words</div>
              <div><strong>Keywords:</strong> 4–6 keywords</div>
              <div><strong>Format:</strong> Word (.docx) or PDF (.pdf), Times New Roman 12 pt, 1.5 line spacing</div>
              <div><strong className="text-amber-300">Author Policy:</strong> One author per abstract; co-authorship not permitted</div>
            </div>

            <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-1">
              <div className="font-bold text-teal-300 uppercase tracking-wider text-[10px]">Publication Perks</div>
              <div>• Publication in Multidisciplinary E-Book</div>
              <div>• ISBN for the e-book</div>
              <div>• DOI for the entire e-book</div>
              <div>• Individual e-certificate for each author</div>
              <div>• Free digital copy &amp; official ADF website listing</div>
              <div className="text-[10px] text-slate-400 mt-1">* Hard copy available upon request (printing &amp; courier borne by author)</div>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-teal-300 block mb-1.5">
              15 Accepted Research Disciplines:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {call.researchAreas.map((area) => (
                <span
                  key={area.id}
                  className="px-2 py-0.5 rounded-md bg-white/10 text-white/90 text-[11px] border border-white/10"
                >
                  {area.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Metric Cards Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Received</span>
            <FileText className="h-4 w-4 text-blue-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 mt-1.5">{totalCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Abstract submissions</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Under Review</span>
            <Clock className="h-4 w-4 text-amber-600" />
          </div>
          <div className="text-2xl font-extrabold text-amber-600 mt-1.5">{pendingCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Awaiting editorial decision</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Accepted</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1.5">{acceptedCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Approved for e-book</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Revision Needed</span>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </div>
          <div className="text-2xl font-extrabold text-orange-600 mt-1.5">{revisionCount}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">Author action required</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Fees Collected</span>
            <DollarSign className="h-4 w-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-teal-700 mt-1.5">₹{totalRevenue}</div>
          <div className="text-[11px] text-slate-400 mt-0.5">{paidCount} of {totalCount} verified (₹50/sub)</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search author, title, institution, ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--primary)] bg-slate-50/50"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Discipline filter */}
          <select
            value={selectedDiscipline}
            onChange={(e) => setSelectedDiscipline(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="All">All 15 Disciplines</option>
            {call.researchAreas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.name}
              </option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="All">All Review Statuses</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Accepted">Accepted</option>
            <option value="Revision Required">Revision Required</option>
            <option value="Rejected">Rejected</option>
          </select>

          {/* Payment filter */}
          <select
            value={selectedPayment}
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 font-medium focus:outline-none"
          >
            <option value="All">All Payment</option>
            <option value="Paid">₹50 Paid</option>
            <option value="Pending">Payment Pending</option>
          </select>

          {(searchQuery || selectedDiscipline !== "All" || selectedStatus !== "All" || selectedPayment !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedDiscipline("All");
                setSelectedStatus("All");
                setSelectedPayment("All");
              }}
              className="px-2.5 py-1.5 text-xs text-red-600 hover:underline font-semibold"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Submissions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">Tracking ID</th>
                <th className="py-3.5 px-4">Author Profile</th>
                <th className="py-3.5 px-4">Discipline</th>
                <th className="py-3.5 px-4">Abstract Title &amp; Length</th>
                <th className="py-3.5 px-4">Fee (₹50)</th>
                <th className="py-3.5 px-4">Attachments</th>
                <th className="py-3.5 px-4">Editorial Decision</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    No abstract submissions found matching criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* ID */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-mono font-bold text-blue-700">{sub.id}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(sub.submittedAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="font-bold text-slate-900">{sub.authorName}</div>
                      <div className="text-[11px] text-slate-500">{sub.authorType}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[200px]" title={sub.institution}>
                        {sub.institution}
                      </div>
                    </td>

                    {/* Discipline */}
                    <td className="py-3.5 px-4 align-top">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-800 border border-teal-200/80">
                        {sub.researchAreaName}
                      </span>
                    </td>

                    {/* Title & Word count */}
                    <td className="py-3.5 px-4 align-top max-w-[280px]">
                      <div className="font-medium text-slate-900 line-clamp-2" title={sub.abstractTitle}>
                        {sub.abstractTitle}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                            sub.wordCount >= 200 && sub.wordCount <= 300
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {sub.wordCount} words {sub.wordCount >= 200 && sub.wordCount <= 300 && "✓"}
                        </span>
                      </div>
                    </td>

                    {/* Fee */}
                    <td className="py-3.5 px-4 align-top">
                      <button
                        onClick={() => handlePaymentToggle(sub.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold cursor-pointer transition-colors ${
                          sub.paymentStatus === "Paid"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                        title="Click to toggle payment verification"
                      >
                        {sub.paymentStatus === "Paid" ? <Check className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                        {sub.paymentStatus === "Paid" ? "₹50 Paid" : "Pending"}
                      </button>
                    </td>

                    {/* Customer Attachments */}
                    <td className="py-3.5 px-4 align-top">
                      <div className="flex flex-col gap-1.5 min-w-[125px]">
                        {sub.manuscriptUrl ? (
                          <a
                            href={sub.manuscriptUrl.startsWith("data:") ? sub.manuscriptUrl : assetUrl(sub.manuscriptUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            download={sub.manuscriptUrl.startsWith("data:") ? `${sub.id}_Abstract.docx` : undefined}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 transition-colors w-fit"
                            title="Download / View customer abstract document"
                          >
                            <FileText className="h-3.5 w-3.5 text-blue-600 flex-shrink-0" />
                            <span>{sub.manuscriptUrl && sub.manuscriptUrl.toLowerCase().includes('.pdf') ? 'Abstract PDF' : 'Abstract Doc'}</span>
                          </a>
                        ) : (
                          <label className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-blue-600 cursor-pointer w-fit py-0.5" title="Click to attach .docx abstract file">
                            <Upload className="h-3 w-3" />
                            <span>Attach Doc</span>
                            <input
                              type="file"
                              accept=".pdf,.docx,.doc,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleUploadAttachment(sub.id, e.target.files[0], "manuscript");
                                }
                              }}
                            />
                          </label>
                        )}

                        {sub.paymentScreenshotUrl ? (
                          <a
                            href={sub.paymentScreenshotUrl.startsWith("data:") ? sub.paymentScreenshotUrl : assetUrl(sub.paymentScreenshotUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 transition-colors w-fit"
                            title="View UPI / GPay transaction attachment"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0" />
                            <span>Payment Proof</span>
                          </a>
                        ) : (
                          <label className="inline-flex items-center gap-1 text-[10px] text-slate-400 hover:text-emerald-600 cursor-pointer w-fit py-0.5" title="Click to attach payment receipt screenshot">
                            <Upload className="h-3 w-3" />
                            <span>Attach Receipt</span>
                            <input
                              type="file"
                              accept="image/*,.pdf"
                              className="hidden"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  handleUploadAttachment(sub.id, e.target.files[0], "payment_screenshot");
                                }
                              }}
                            />
                          </label>
                        )}
                      </div>
                    </td>

                    {/* Status Select */}
                    <td className="py-3.5 px-4 align-top">
                      <select
                        value={sub.reviewStatus}
                        onChange={(e) => handleStatusChange(sub.id, e.target.value as any)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg border focus:outline-none ${
                          sub.reviewStatus === "Accepted"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : sub.reviewStatus === "Revision Required"
                            ? "bg-orange-50 text-orange-800 border-orange-200"
                            : sub.reviewStatus === "Rejected"
                            ? "bg-red-50 text-red-800 border-red-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        <option value="Pending Review">Pending Review</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Revision Required">Revision Required</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 align-top text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedSub(sub)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                        title="View Full Abstract"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      <a
                        href={`https://wa.me/${sub.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                          `Greetings ${sub.authorName}! Academic Development Forum (ADF) is happy to collaborate with you. Regarding your abstract submission (ID: ${sub.id}) for "Interdisciplinary Horizons" titled "${sub.abstractTitle}": `
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors inline-block"
                        title="Message Author on WhatsApp"
                      >
                        <MessageCircle className="h-4 w-4" />
                      </a>

                      <button
                        onClick={() => handleDelete(sub.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Delete record"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Abstract View & Decision Dialog */}
      {selectedSub && (
        <Dialog open={!!selectedSub} onOpenChange={() => setSelectedSub(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {selectedSub.id}
                </span>
                <span className="text-xs text-slate-400">
                  Submitted: {new Date(selectedSub.submittedAt).toLocaleString()}
                </span>
              </div>
              <DialogTitle className="text-lg font-bold text-slate-900 leading-snug">
                {selectedSub.abstractTitle}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs sm:text-sm text-slate-700">
              {/* Author Card */}
              <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 grid grid-cols-2 gap-3">
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Author Name</span>
                  <span className="font-bold text-slate-900">{selectedSub.authorName}</span> ({selectedSub.authorType})
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Discipline Track</span>
                  <span className="font-bold text-teal-800">{selectedSub.researchAreaName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Affiliation</span>
                  <span className="font-medium text-slate-800">{selectedSub.department}, {selectedSub.institution}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px] font-medium">Contact Details</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <a href={`mailto:${selectedSub.email}`} className="text-blue-600 hover:underline">
                      {selectedSub.email}
                    </a>
                    <span>·</span>
                    <a href={`tel:${selectedSub.phone}`} className="text-slate-700">
                      {selectedSub.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Abstract Body */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                    Abstract Text ({selectedSub.wordCount} words)
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded ${
                      selectedSub.wordCount >= 200 && selectedSub.wordCount <= 300
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    Target: 200–300 words
                  </span>
                </div>
                <div className="p-4 rounded-xl border border-slate-200 bg-white leading-relaxed text-slate-800 text-xs sm:text-sm font-serif">
                  {selectedSub.abstractText}
                </div>
              </div>

              {/* Keywords */}
              <div>
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block mb-1">
                  Keywords
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedSub.keywords.split(/[,;]/).map((k) => (
                    <span key={k} className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs border">
                      {k.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Customer Attachments & Transaction Proof */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Customer Attachments &amp; Proofs
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {selectedSub.manuscriptUrl && selectedSub.paymentScreenshotUrl
                      ? "Both files attached"
                      : selectedSub.manuscriptUrl || selectedSub.paymentScreenshotUrl
                      ? "1 file attached"
                      : "No files uploaded by author"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {/* Abstract Manuscript File */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <FileText className="h-4 w-4 text-blue-600" />
                          Abstract Document (PDF / Word .docx)
                        </span>
                        {selectedSub.manuscriptUrl ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Available
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                            Not Uploaded
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        {selectedSub.manuscriptUrl
                          ? "Original manuscript submitted by author."
                          : "Author submitted text directly in form."}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      {selectedSub.manuscriptUrl ? (
                        <a
                          href={selectedSub.manuscriptUrl.startsWith("data:") ? selectedSub.manuscriptUrl : assetUrl(selectedSub.manuscriptUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={selectedSub.manuscriptUrl.startsWith("data:") ? `${selectedSub.id}_Abstract.docx` : undefined}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors shadow-xs"
                        >
                          <Download className="h-3.5 w-3.5" />
                          Download Abstract File
                        </a>
                      ) : null}

                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="h-3.5 w-3.5 text-slate-500" />
                        <span>{selectedSub.manuscriptUrl ? "Replace File (PDF/Word)" : "Upload PDF or Word"}</span>
                        <input
                          type="file"
                          accept=".docx,.doc,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleUploadAttachment(selectedSub.id, e.target.files[0], "manuscript");
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Payment Receipt / Transaction Screenshot */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-col justify-between gap-3 shadow-xs">
                    <div>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          Payment Screenshot / Receipt
                        </span>
                        {selectedSub.paymentScreenshotUrl ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Verified / Attached
                          </span>
                        ) : (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                            Missing Proof
                          </span>
                        )}
                      </div>

                      {/* If screenshot exists, display inline thumbnail */}
                      {selectedSub.paymentScreenshotUrl && (
                        <div className="mt-2.5">
                          <a
                            href={selectedSub.paymentScreenshotUrl.startsWith("data:") ? selectedSub.paymentScreenshotUrl : assetUrl(selectedSub.paymentScreenshotUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block group relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50 hover:border-emerald-500 transition-colors"
                          >
                            <img
                              src={selectedSub.paymentScreenshotUrl.startsWith("data:") ? selectedSub.paymentScreenshotUrl : assetUrl(selectedSub.paymentScreenshotUrl)}
                              alt="Payment Screenshot"
                              className="max-h-36 w-full object-contain mx-auto p-1 group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs font-bold transition-opacity">
                              Click to view full receipt
                            </div>
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
                      {selectedSub.paymentScreenshotUrl ? (
                        <a
                          href={selectedSub.paymentScreenshotUrl.startsWith("data:") ? selectedSub.paymentScreenshotUrl : assetUrl(selectedSub.paymentScreenshotUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors shadow-xs"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          Open Full Image
                        </a>
                      ) : null}

                      <label className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold cursor-pointer transition-colors">
                        <Upload className="h-3.5 w-3.5 text-slate-500" />
                        <span>{selectedSub.paymentScreenshotUrl ? "Replace Receipt" : "Upload Receipt"}</span>
                        <input
                          type="file"
                          accept="image/*,.pdf"
                          className="hidden"
                          onChange={(e) => {
                            if (e.target.files?.[0]) {
                              handleUploadAttachment(selectedSub.id, e.target.files[0], "payment_screenshot");
                            }
                          }}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee & Declaration */}
              <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-amber-950 block text-[11px] uppercase tracking-wider">
                    UPI / GPay Transaction Reference (UTR):
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-mono font-bold text-sm text-amber-900 bg-white px-2.5 py-1 rounded border border-amber-300">
                      {selectedSub.paymentRef || "Not provided"}
                    </span>
                    {selectedSub.paymentRef && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(selectedSub.paymentRef);
                          toast.success("Transaction UTR copied!");
                        }}
                        className="p-1 rounded text-amber-700 hover:text-amber-950 hover:bg-amber-100 transition-colors cursor-pointer"
                        title="Copy Reference ID"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePaymentToggle(selectedSub.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold cursor-pointer transition-colors shadow-xs ${
                      selectedSub.paymentStatus === "Paid"
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-amber-600 hover:bg-amber-700 text-white"
                    }`}
                  >
                    {selectedSub.paymentStatus === "Paid" ? "✓ ₹50 Payment Verified" : "Mark ₹50 as Paid"}
                  </button>
                </div>
              </div>
            </div>

            <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2 border-t">
              <div className="flex items-center gap-2 mr-auto">
                <span className="text-xs font-semibold text-slate-600">Decision:</span>
                <select
                  value={selectedSub.reviewStatus}
                  onChange={(e) => handleStatusChange(selectedSub.id, e.target.value as any)}
                  className="text-xs font-bold px-2 py-1.5 rounded-lg border focus:outline-none"
                >
                  <option value="Pending Review">Pending Review</option>
                  <option value="Accepted">Accepted</option>
                  <option value="Revision Required">Revision Required</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <a
                href={`https://wa.me/${selectedSub.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                  `Greetings ${selectedSub.authorName}! Academic Development Forum (ADF) is happy to collaborate with you. Regarding your abstract submission (ID: ${selectedSub.id}) for "Interdisciplinary Horizons" titled "${selectedSub.abstractTitle}": your review status is currently "${selectedSub.reviewStatus}". Thank you for collaborating with ADF!`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700"
              >
                <MessageCircle className="h-3.5 w-3.5" />
                Notify on WhatsApp
              </a>

              <Button variant="outline" size="sm" onClick={() => setSelectedSub(null)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Record New / Walk-In Submission Modal */}
      {isNewModalOpen && (
        <Dialog open={isNewModalOpen} onOpenChange={() => setIsNewModalOpen(false)}>
          <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-600" />
                Record Offline / Walk-in Abstract
              </DialogTitle>
              <p className="text-xs text-slate-500">
                Directly add an abstract received via email, WhatsApp, or hard copy.
              </p>
            </DialogHeader>

            <form onSubmit={handleAddSubmission} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Author Name *</label>
                  <input
                    type="text"
                    required
                    value={newSubData.authorName}
                    onChange={(e) => setNewSubData({ ...newSubData, authorName: e.target.value })}
                    placeholder="Full name of sole author"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Author Category</label>
                  <select
                    value={newSubData.authorType}
                    onChange={(e) => setNewSubData({ ...newSubData, authorType: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Research Scholar">Research Scholar</option>
                    <option value="Student">Student</option>
                    <option value="Faculty Member">Faculty Member</option>
                    <option value="Academicians">Academician</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Institution</label>
                  <input
                    type="text"
                    value={newSubData.institution}
                    onChange={(e) => setNewSubData({ ...newSubData, institution: e.target.value })}
                    placeholder="College / University"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Department</label>
                  <input
                    type="text"
                    value={newSubData.department}
                    onChange={(e) => setNewSubData({ ...newSubData, department: e.target.value })}
                    placeholder="e.g. Dept of Economics"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={newSubData.email}
                    onChange={(e) => setNewSubData({ ...newSubData, email: e.target.value })}
                    placeholder="author@example.com"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone / WhatsApp</label>
                  <input
                    type="text"
                    value={newSubData.phone}
                    onChange={(e) => setNewSubData({ ...newSubData, phone: e.target.value })}
                    placeholder="+91 XXXXX XXXXX"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Research Discipline</label>
                <select
                  value={newSubData.researchAreaId}
                  onChange={(e) => setNewSubData({ ...newSubData, researchAreaId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                >
                  {call.researchAreas.map((area) => (
                    <option key={area.id} value={area.id}>
                      {area.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">Abstract Title *</label>
                <input
                  type="text"
                  required
                  value={newSubData.abstractTitle}
                  onChange={(e) => setNewSubData({ ...newSubData, abstractTitle: e.target.value })}
                  placeholder="Full title of the research abstract"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Abstract Body (200–300 words recommended) *
                </label>
                <textarea
                  rows={4}
                  required
                  value={newSubData.abstractText}
                  onChange={(e) => setNewSubData({ ...newSubData, abstractText: e.target.value })}
                  placeholder="Paste or write the abstract text..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-serif focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Keywords (4–6)</label>
                  <input
                    type="text"
                    value={newSubData.keywords}
                    onChange={(e) => setNewSubData({ ...newSubData, keywords: e.target.value })}
                    placeholder="Keyword1, Keyword2, ..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">Payment Status</label>
                  <select
                    value={newSubData.paymentStatus}
                    onChange={(e) => setNewSubData({ ...newSubData, paymentStatus: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none"
                  >
                    <option value="Paid">₹50 Paid</option>
                    <option value="Pending">Payment Pending</option>
                  </select>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                  Save Abstract
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
