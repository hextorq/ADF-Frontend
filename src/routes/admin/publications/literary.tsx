import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  BookOpen, 
  Edit3, 
  CheckCircle, 
  FileText, 
  UploadCloud, 
  Mail, 
  Trash2, 
  Edit, 
  Clock, 
  Layers, 
  Calendar,
  Globe2,
  Instagram,
  Filter
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch } from "@/lib/api";

const CAMPAIGN_ID = "art-dreams-fusion-vol-1";

export default function AdminLiteraryPublications() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<"all" | "campaign">("all");
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);

  const fetchSubmissions = async () => {
    try {
      const data = await apiFetch<any[]>("/publications/literary/admin");
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error("Failed to fetch literary submissions");
      setSubmissions([]);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStage = async (id: string, stage: string) => {
    try {
      await apiFetch(`/publications/literary/admin/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ current_stage: stage })
      });
      toast.success(`Stage updated to ${stage}`);
      fetchSubmissions();
    } catch (e: any) {
      toast.error(e.message || "Error updating stage");
    }
  };

  const publishToStore = async (id: string) => {
    setIsPublishing(id);
    try {
      const data = await apiFetch<{ bookId: number }>(`/publications/literary/admin/${id}/publish`, {
        method: 'POST'
      });
      toast.success(`Published to Store! Book ID: ${data.bookId}`);
      fetchSubmissions();
    } catch (e: any) {
      toast.error(e.message || "Error publishing to store");
    } finally {
      setIsPublishing(null);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      await apiFetch(`/publications/literary/admin/${id}`, { method: "DELETE" });
      toast.success("Submission deleted");
      fetchSubmissions();
    } catch (e: any) {
      toast.error(e.message || "Error deleting submission");
    }
  };

  const saveSubmission = async () => {
    if (!editingSub) return;
    try {
      await apiFetch(`/publications/literary/admin/${editingSub.id}`, {
        method: 'PATCH',
        body: JSON.stringify(editingSub)
      });
      toast.success("Submission updated successfully");
      setIsEditModalOpen(false);
      fetchSubmissions();
    } catch (e: any) {
      toast.error(e.message || "Error updating submission");
    }
  };

  const openEditModal = (sub: any) => {
    setEditingSub({ ...sub });
    setIsEditModalOpen(true);
  };

  // Filtered dataset
  const campaignSubmissions = submissions.filter(s => s.campaign_id === CAMPAIGN_ID || (s.campaign_name && s.campaign_name.includes("Art, Dreams & Fusion")));
  const displaySubmissions = activeFilter === "campaign" ? campaignSubmissions : submissions;

  // General stats
  const stats = [
    { label: "New Manuscripts", value: submissions.filter(s => s.current_stage === 'Submitted').length, icon: BookOpen },
    { label: "Under Editing", value: submissions.filter(s => s.current_stage === 'Editing').length, icon: Edit3 },
    { label: "Ready to Publish", value: submissions.filter(s => s.current_stage === 'Publication').length, icon: CheckCircle },
    { label: "First Call Submissions", value: campaignSubmissions.length, icon: FileText }
  ];

  // Campaign breakdown statistics
  const campaignTypes = ["Short Story", "Poem", "Drawing", "Photograph", "Quotes", "Essay"];
  const typeCounts = campaignTypes.reduce((acc, t) => {
    acc[t] = campaignSubmissions.filter(s => (s.submission_type || s.book_genre)?.toLowerCase() === t.toLowerCase()).length;
    return acc;
  }, {} as Record<string, number>);

  const englishCount = campaignSubmissions.filter(s => s.book_language?.toLowerCase() === "english").length;
  const tamilCount = campaignSubmissions.filter(s => s.book_language?.toLowerCase().includes("tamil")).length;

  const pendingReviewCount = campaignSubmissions.filter(s => s.current_stage === "Submitted" || s.current_stage === "Editorial Review").length;
  const acceptedCount = campaignSubmissions.filter(s => ["Accepted", "Editing", "Author Approval", "ISBN Assigned", "Cover Design", "Publication", "Book Store"].includes(s.current_stage)).length;
  const rejectedCount = campaignSubmissions.filter(s => s.current_stage === "Rejected").length;

  // Check deadline status
  const deadline = new Date("2026-09-20T23:59:59+05:30");
  const isDeadlineOpen = new Date().getTime() < deadline.getTime();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Literary Publications & Anthologies</h2>
          <p className="text-muted-foreground text-sm">Manage author submissions, editorial workflow, and campaign entries.</p>
        </div>

        {/* Campaign Filter Toggle */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Submissions ({submissions.length})
          </button>
          <button
            onClick={() => setActiveFilter("campaign")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeFilter === "campaign"
                ? "bg-[var(--primary)] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <BookOpen className="h-3.5 w-3.5 text-emerald-400" />
            <span>Art, Dreams & Fusion ({campaignSubmissions.length})</span>
          </button>
        </div>
      </div>

      {/* Top Standard Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm p-5">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-xs font-medium text-slate-600">{stat.label}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
            </div>
          );
        })}
      </div>

      {/* ========================================================
          CAMPAIGN MANAGEMENT OVERVIEW CARD
      ======================================================== */}
      {(activeFilter === "campaign" || campaignSubmissions.length > 0) && (
        <div className="rounded-2xl border border-amber-300/80 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 shadow-md space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/30">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    CAMPAIGN OVERVIEW
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${isDeadlineOpen ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-300'}`}>
                    {isDeadlineOpen ? "STATUS: OPEN" : "STATUS: CLOSED"}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-white mt-1">
                  Art, Dreams & Fusion — Volume I
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Submission Deadline</span>
                <span className="font-mono font-bold text-amber-300">20 September 2026</span>
              </div>
              <div className="bg-slate-800/80 border border-slate-700/80 px-3 py-2 rounded-xl">
                <span className="text-slate-400 block text-[10px]">Total Submissions</span>
                <span className="font-mono font-bold text-white text-base">{campaignSubmissions.length}</span>
              </div>
            </div>
          </div>

          {/* Breakdown Grids */}
          <div className="grid md:grid-cols-3 gap-6 pt-1 text-xs">
            
            {/* Review Status Counts */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                Review Workflow
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Pending Review:</span>
                <span className="font-mono font-bold text-amber-300">{pendingReviewCount}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">Accepted:</span>
                <span className="font-mono font-bold text-emerald-400">{acceptedCount}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Rejected:</span>
                <span className="font-mono font-bold text-rose-400">{rejectedCount}</span>
              </div>
            </div>

            {/* Submission Type Breakdown */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                By Submission Type
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
                {campaignTypes.map(t => (
                  <div key={t} className="flex items-center justify-between">
                    <span className="text-slate-400 truncate">{t}:</span>
                    <span className="font-mono font-bold text-slate-200">{typeCounts[t] || 0}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Breakdown */}
            <div className="bg-slate-850/60 p-4 rounded-xl border border-slate-800 space-y-2.5">
              <div className="font-semibold text-slate-300 uppercase tracking-wider text-[10px]">
                By Language
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800">
                <span className="text-slate-400">English:</span>
                <span className="font-mono font-bold text-indigo-300">{englishCount}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Tamil (தமிழ்):</span>
                <span className="font-mono font-bold text-emerald-300">{tamilCount}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Submissions Table */}
      <div className="rounded-xl border bg-white overflow-x-auto shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">ID</TableHead>
              <TableHead>Title / Work</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Type / Category</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displaySubmissions.map((sub) => {
              const isSubCampaign = sub.campaign_id === CAMPAIGN_ID || (sub.campaign_name && sub.campaign_name.includes("Art, Dreams & Fusion"));

              return (
                <TableRow key={sub.id} className={isSubCampaign ? "bg-amber-50/30" : ""}>
                  <TableCell className="font-mono text-xs font-semibold">
                    {sub.id}
                  </TableCell>

                  <TableCell className="max-w-[220px]">
                    <div className="font-medium text-slate-900 truncate" title={sub.book_title}>
                      {sub.book_title}
                    </div>
                    {isSubCampaign && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded mt-0.5">
                        <BookOpen className="h-2.5 w-2.5" /> First Call Vol I
                      </span>
                    )}
                  </TableCell>

                  <TableCell>
                    <div className="text-xs font-medium text-slate-900">{sub.author_name}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-[160px]">{sub.author_email}</div>
                    {sub.author_instagram && (
                      <div className="text-[10px] text-pink-600 flex items-center gap-1 mt-0.5">
                        <Instagram className="h-2.5 w-2.5" /> {sub.author_instagram}
                      </div>
                    )}
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="font-medium text-slate-800">
                      {sub.submission_type || sub.book_genre}
                    </span>
                  </TableCell>

                  <TableCell className="text-xs">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700">
                      {sub.book_language || "English"}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                      sub.payment_status === "Free" || isSubCampaign
                        ? "bg-emerald-100 text-emerald-800"
                        : sub.payment_status === "Paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-700"
                    }`}>
                      {sub.payment_status === "Free" || isSubCampaign ? "₹0 Free (Campaign)" : sub.payment_status}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {sub.current_stage || sub.status || "Submitted"}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Select defaultValue={sub.current_stage || "Submitted"} onValueChange={(val) => updateStage(sub.id, val)}>
                        <SelectTrigger className="w-[130px] h-8 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Submitted">Submitted</SelectItem>
                          <SelectItem value="Editorial Review">Editorial Review</SelectItem>
                          <SelectItem value="Editing">Editing</SelectItem>
                          <SelectItem value="Author Approval">Author Approval</SelectItem>
                          <SelectItem value="ISBN Assigned">ISBN Assigned</SelectItem>
                          <SelectItem value="Cover Design">Cover Design</SelectItem>
                          <SelectItem value="Publication">Publication</SelectItem>
                          <SelectItem value="Book Store">Book Store</SelectItem>
                          <SelectItem value="Rejected">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      {sub.current_stage === 'Publication' && (
                        <Button 
                          size="sm" 
                          className="h-8 text-xs bg-emerald-600 text-white hover:bg-emerald-500"
                          disabled={isPublishing === sub.id}
                          onClick={() => publishToStore(sub.id)}
                        >
                          {isPublishing === sub.id ? "..." : <UploadCloud className="w-3.5 h-3.5" />}
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 w-8 p-0"
                        onClick={() => window.open(`mailto:${sub.author_email}?subject=Regarding Your Anthology Submission: ${sub.book_title} (${sub.id})`)}
                        title="Email Author"
                      >
                        <Mail className="w-3.5 h-3.5 text-slate-600" />
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => openEditModal(sub)} className="h-8 w-8 p-0" title="View / Edit Details">
                        <Edit className="h-3.5 w-3.5 text-slate-600" />
                      </Button>

                      <Button variant="ghost" size="sm" onClick={() => deleteSubmission(sub.id)} className="text-red-500 hover:text-red-700 h-8 w-8 p-0" title="Delete Submission">
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}

            {displaySubmissions.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-28 text-center text-slate-500">
                  {activeFilter === "campaign" ? "No submissions found for Art, Dreams & Fusion Volume I." : "No literary submissions found."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* VIEW / EDIT SUBMISSION MODAL */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Submission Details: {editingSub?.id}</span>
              {editingSub?.campaign_id && (
                <span className="text-xs px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                  First Call Vol I
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          
          {editingSub && (
            <Tabs defaultValue="author" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="author">Author Details</TabsTrigger>
                <TabsTrigger value="book">Manuscript / Work</TabsTrigger>
                <TabsTrigger value="status">Workflow & Stage</TabsTrigger>
              </TabsList>
              
              <TabsContent value="author" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Author Name</Label>
                    <Input value={editingSub.author_name || ""} onChange={e => setEditingSub({...editingSub, author_name: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={editingSub.author_email || ""} onChange={e => setEditingSub({...editingSub, author_email: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone / WhatsApp</Label>
                    <Input value={editingSub.author_phone || ""} onChange={e => setEditingSub({...editingSub, author_phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={editingSub.author_country || ""} onChange={e => setEditingSub({...editingSub, author_country: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Instagram ID</Label>
                    <Input 
                      value={editingSub.author_instagram || ""} 
                      onChange={e => setEditingSub({...editingSub, author_instagram: e.target.value})} 
                      placeholder="@username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Author Photo</Label>
                    {editingSub.author_photo_url ? (
                      <div className="flex items-center gap-2">
                        <img src={editingSub.author_photo_url} alt="Author Portrait" className="w-10 h-10 rounded-full object-cover border" />
                        <a href={editingSub.author_photo_url} target="_blank" rel="noreferrer" className="text-xs text-blue-600 underline">
                          View Full Photo
                        </a>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 block pt-2">No photo uploaded</span>
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Postal Address</Label>
                  <Textarea value={editingSub.author_address || ""} onChange={e => setEditingSub({...editingSub, author_address: e.target.value})} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Author Bio</Label>
                  <Textarea value={editingSub.author_bio || ""} onChange={e => setEditingSub({...editingSub, author_bio: e.target.value})} rows={4} />
                </div>
              </TabsContent>
              
              <TabsContent value="book" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title</Label>
                    <Input value={editingSub.book_title || ""} onChange={e => setEditingSub({...editingSub, book_title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Submission Type / Category</Label>
                    <Input value={editingSub.submission_type || editingSub.book_genre || ""} onChange={e => setEditingSub({...editingSub, submission_type: e.target.value, book_genre: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input value={editingSub.book_language || ""} onChange={e => setEditingSub({...editingSub, book_language: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Word Count</Label>
                    <Input type="number" value={editingSub.word_count ?? ""} onChange={e => setEditingSub({...editingSub, word_count: parseInt(e.target.value) || 0})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Campaign Tag</Label>
                    <Input value={editingSub.campaign_name || "None"} readOnly className="bg-slate-50 text-slate-600" />
                  </div>
                  <div className="space-y-2">
                    <Label>Manuscript / File</Label>
                    <div className="flex gap-2 text-sm mt-2">
                      {editingSub.manuscript_url && (
                        <a href={editingSub.manuscript_url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline">
                          Open Work File
                        </a>
                      )}
                      {editingSub.cover_url && (
                        <a href={editingSub.cover_url} target="_blank" rel="noreferrer" className="text-blue-600 font-semibold underline ml-4">
                          Open Artwork/Cover
                        </a>
                      )}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Synopsis / Artist Statement</Label>
                  <Textarea value={editingSub.synopsis || ""} onChange={e => setEditingSub({...editingSub, synopsis: e.target.value})} rows={5} />
                </div>
              </TabsContent>

              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Stage</Label>
                    <Select value={editingSub.current_stage || "Submitted"} onValueChange={(val) => setEditingSub({...editingSub, current_stage: val})}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Submitted">Submitted</SelectItem>
                        <SelectItem value="Editorial Review">Editorial Review</SelectItem>
                        <SelectItem value="Editing">Editing</SelectItem>
                        <SelectItem value="Author Approval">Author Approval</SelectItem>
                        <SelectItem value="ISBN Assigned">ISBN Assigned</SelectItem>
                        <SelectItem value="Cover Design">Cover Design</SelectItem>
                        <SelectItem value="Publication">Publication</SelectItem>
                        <SelectItem value="Book Store">Book Store</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Editor Assigned</Label>
                    <Input value={editingSub.editor_assigned || ""} onChange={e => setEditingSub({...editingSub, editor_assigned: e.target.value})} placeholder="Name of Editor" />
                  </div>
                  <div className="space-y-2">
                    <Label>ISBN</Label>
                    <Input value={editingSub.isbn || ""} onChange={e => setEditingSub({...editingSub, isbn: e.target.value})} placeholder="e.g. 978-X-XXXX-XXXX-X" />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Input value={editingSub.payment_status || "Free"} readOnly className="bg-slate-50 text-slate-500 font-medium" />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
            <Button onClick={saveSubmission} className="btn-primary">Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
