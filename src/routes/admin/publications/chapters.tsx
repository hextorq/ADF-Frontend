import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, CheckCircle, Clock, FileText, Plus, Trash2, Edit, Eye, Download, Users, File, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { apiFetch, uploadImage, assetUrl } from "@/lib/api";
import { useCMSStore, Activity as ActivityType } from "@/store/useCMSStore";

export default function AdminChapterPublications() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newVolume, setNewVolume] = useState({
    title: "",
    theme: "",
    description: "",
    submission_deadline: "",
    pages: 0,
    cover_url: "",
    pdf_url: ""
  });
  const [editingVolumeId, setEditingVolumeId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [viewingSubmission, setViewingSubmission] = useState<any | null>(null);
  const [activeTab, setActiveTab] = useState("submissions");
  const [paymentFilter, setPaymentFilter] = useState<string>("All");
  const [isPublishDialogOpen, setIsPublishDialogOpen] = useState(false);
  const [publishVolumeId, setPublishVolumeId] = useState<string>("");
  const [publishPdfFile, setPublishPdfFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const [subs, vols] = await Promise.all([
        apiFetch<any[]>("/publications/chapters/admin"),
        apiFetch<any[]>("/publications/chapters/volumes")
      ]);
      
      setSubmissions(Array.isArray(subs) ? subs : []);
      setVolumes(Array.isArray(vols) ? vols : []);
    } catch (e) {
      toast.error("Failed to fetch chapter data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStage = async (id: string, stage: string) => {
    try {
      await apiFetch(`/publications/chapters/admin/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ stage })
      });
      toast.success(`Stage updated to ${stage}`);
      
      const newActivity: ActivityType = {
        id: Date.now().toString(),
        title: `Chapter stage updated: ${stage}`,
        description: `Status changed to '${stage}' for submission ${id}`,
        time: new Date().toISOString(),
        category: "Review",
        iconName: "CheckCircle",
        pinned: false,
        visible: true
      };
      const currentActivities = useCMSStore.getState().activities || [];
      useCMSStore.getState().setActivities([newActivity, ...currentActivities]);
      
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Error updating stage");
    }
  };

  const updatePaymentStatus = async (id: string, payment_status: string) => {
    try {
      await apiFetch(`/publications/chapters/admin/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ payment_status })
      });
      toast.success(`Payment status updated to ${payment_status}`);
      // Update local state for immediate UI reflection in the modal
      setViewingSubmission((prev: any) => prev ? { ...prev, payment_status } : null);
      
      const newActivity: ActivityType = {
        id: Date.now().toString(),
        title: `Payment status updated: ${payment_status}`,
        description: `Payment status changed to '${payment_status}' for submission ${id}`,
        time: new Date().toISOString(),
        category: "Payment",
        iconName: "FileText",
        pinned: false,
        visible: true
      };
      const currentActivities = useCMSStore.getState().activities || [];
      useCMSStore.getState().setActivities([newActivity, ...currentActivities]);

      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Error updating payment status");
    }
  };

  const createVolume = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newVolume.title);
      formData.append("theme", newVolume.theme);
      formData.append("description", newVolume.description);
      formData.append("submission_deadline", newVolume.submission_deadline);
      formData.append("pages", String(newVolume.pages || 0));
      
      if (coverImage) {
        formData.append("cover_image", coverImage);
      } else if (newVolume.cover_url) {
        formData.append("cover_url", newVolume.cover_url);
      }
      
      if (pdfFile) {
        formData.append("pdf_file", pdfFile);
      } else if ((newVolume as any).pdf_url) {
        formData.append("pdf_url", (newVolume as any).pdf_url);
      }

      const url = editingVolumeId 
        ? `/api/publications/chapters/volumes/${editingVolumeId}`
        : "/api/publications/chapters/volumes";
      const method = editingVolumeId ? "PATCH" : "POST";

      const token = localStorage.getItem("adf_admin_token");
      const res = await fetch(import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL + url : url, {
        method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || res.statusText);
      }
      
      toast.success(`Volume ${editingVolumeId ? 'updated' : 'created'} successfully`);
      setIsDialogOpen(false);
      setNewVolume({ title: "", theme: "", description: "", submission_deadline: "", pages: 0, cover_url: "", pdf_url: "" } as any);
      setCoverImage(null);
      setEditingVolumeId(null);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || `Failed to ${editingVolumeId ? 'update' : 'create'} volume`);
    }
  };

  const submitPublish = async () => {
    if (!publishVolumeId) return toast.error("Select a volume to publish");
    if (!publishPdfFile) return toast.error("Please upload the Manuscript PDF");
    
    try {
      const formData = new FormData();
      formData.append("status", "published");
      formData.append("pdf_file", publishPdfFile);
      
      const token = localStorage.getItem("adf_admin_token");
      const url = `/api/publications/chapters/volumes/${publishVolumeId}`;
      const res = await fetch(import.meta.env.VITE_API_BASE_URL ? import.meta.env.VITE_API_BASE_URL + url : url, {
        method: "PATCH",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formData
      });
      
      if (!res.ok) throw new Error("Failed to publish volume");
      
      toast.success("Volume published to releases!");
      setIsPublishDialogOpen(false);
      setPublishVolumeId("");
      setPublishPdfFile(null);
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Failed to publish volume");
    }
  };

  const openEditVolume = (vol: any) => {
    if (!vol) {
      setNewVolume({ title: "", theme: "", description: "", submission_deadline: "", pages: 0, cover_url: "", pdf_url: "" } as any);
      setEditingVolumeId(null);
    } else {
      setNewVolume({
        title: vol.title,
        theme: vol.theme,
        description: vol.description,
        submission_deadline: vol.submission_deadline ? vol.submission_deadline.split('T')[0] : "",
        pages: vol.pages || 0,
        cover_url: vol.cover_url || "",
        pdf_url: vol.pdf_url || ""
      });
      setEditingVolumeId(vol.id);
    }
    setCoverImage(null);
    setIsDialogOpen(true);
  };

  const deleteVolume = async (id: string) => {
    if (!confirm("Delete this volume?")) return;
    try {
      await apiFetch(`/publications/chapters/volumes/${id}`, { method: "DELETE" });
      toast.success("Volume deleted");
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Error deleting volume");
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Delete this submission?")) return;
    try {
      await apiFetch(`/publications/chapters/admin/${id}`, { method: "DELETE" });
      toast.success("Submission deleted");
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Error deleting submission");
    }
  };

  const publishVolume = async (id: string) => {
    try {
      await apiFetch(`/publications/chapters/volumes/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status: "published" })
      });
      toast.success("Volume published successfully");
      fetchData();
    } catch (e: any) {
      toast.error(e.message || "Error publishing volume");
    }
  };

  const stats = [
    { label: "Total Volumes", value: volumes.length, icon: BookOpen },
    { label: "Pending Reviews", value: submissions.filter(s => ['Submitted', 'Editorial Screening', 'Peer Review', 'Revision'].includes(s.stage)).length, icon: Clock },
    { label: "Accepted", value: submissions.filter(s => s.stage === 'Accepted').length, icon: CheckCircle },
    { label: "Published Chapters", value: submissions.filter(s => s.stage === 'Published' || s.stage === 'Payment Verified').length, icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chapter Publications</h2>
          <p className="text-muted-foreground">Manage volumes, submissions, and peer reviews.</p>
        </div>
        {activeTab === "volumes" && (
          <Button onClick={() => openEditVolume(null)}>
            <Plus className="h-4 w-4 mr-2" /> New Volume
          </Button>
        )}
        
        {activeTab === "publish" && (
          <Button onClick={() => { setPublishVolumeId(""); setPublishPdfFile(null); setIsPublishDialogOpen(true); }}>
            <Plus className="h-4 w-4 mr-2" /> Publish Volume
          </Button>
        )}
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingVolumeId ? 'Edit Volume' : 'Create New Volume'}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Title (e.g. Convergence Vol. V)</Label>
                <Input value={newVolume.title} onChange={e => setNewVolume({...newVolume, title: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Theme / Topic</Label>
                <Input value={newVolume.theme} onChange={e => setNewVolume({...newVolume, theme: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={newVolume.description} onChange={e => setNewVolume({...newVolume, description: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Submission Deadline</Label>
                  <Input type="date" value={newVolume.submission_deadline} onChange={e => setNewVolume({...newVolume, submission_deadline: e.target.value})} />
                </div>
                <div className="grid gap-2">
                  <Label>Expected Pages</Label>
                  <Input type="number" value={newVolume.pages || ""} onChange={e => setNewVolume({...newVolume, pages: parseInt(e.target.value) || 0})} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Cover Image</Label>
                <Input type="file" accept="image/*" onChange={e => setCoverImage(e.target.files?.[0] || null)} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button onClick={createVolume}>{editingVolumeId ? 'Save Changes' : 'Create Volume'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* PUBLISH DIALOG */}
        <Dialog open={isPublishDialogOpen} onOpenChange={setIsPublishDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Publish Volume & Upload Manuscript</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Select Volume to Publish</Label>
                <Select value={publishVolumeId} onValueChange={setPublishVolumeId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a volume..." />
                  </SelectTrigger>
                  <SelectContent>
                    {volumes.filter(v => v.status !== 'published').map(v => (
                      <SelectItem key={v.id} value={v.id.toString()}>{v.title}</SelectItem>
                    ))}
                    {volumes.filter(v => v.status !== 'published').length === 0 && (
                      <SelectItem value="none" disabled>No unpublished volumes found</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Upload Compiled Manuscript (PDF)</Label>
                <Input type="file" accept="application/pdf" onChange={e => setPublishPdfFile(e.target.files?.[0] || null)} />
                <p className="text-xs text-slate-500">This PDF will be available for public download.</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsPublishDialogOpen(false)}>Cancel</Button>
              <Button onClick={submitPublish}>Publish to Releases</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow p-6">
              <div className="flex flex-row items-center justify-between space-y-0 pb-2">
                <h3 className="tracking-tight text-sm font-medium">{stat.label}</h3>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
            </div>
          );
        })}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="submissions">Submissions</TabsTrigger>
            <TabsTrigger value="volumes">Volumes</TabsTrigger>
            <TabsTrigger value="publish">Publish</TabsTrigger>
          </TabsList>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-500 hidden sm:inline-block">Filter Payment:</span>
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-[140px] bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <TabsContent value="submissions">
          <div className="rounded-md border bg-white overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Submission ID</TableHead>
                  <TableHead>Volume Name</TableHead>
                  <TableHead>Chapter Title</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.filter(sub => paymentFilter === "All" || sub.payment_status === paymentFilter).map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.id}</TableCell>
                    <TableCell>{sub.volume_title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{sub.chapter_title}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                        sub.payment_status === 'Success' ? 'bg-green-100 text-green-800' : 
                        sub.payment_status === 'Failed' ? 'bg-red-100 text-red-800' : 
                        'bg-orange-100 text-orange-800'
                      }`}>
                        {sub.payment_status || 'Pending'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sub.stage}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Select defaultValue={sub.stage} onValueChange={(val) => updateStage(sub.id, val)}>
                          <SelectTrigger className="w-[140px] h-8 text-xs">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Submitted">Submitted</SelectItem>
                            <SelectItem value="Editorial Screening">Editorial Screening</SelectItem>
                            <SelectItem value="Peer Review">Peer Review</SelectItem>
                            <SelectItem value="Revision">Revision</SelectItem>
                            <SelectItem value="Accepted">Accepted</SelectItem>
                            <SelectItem value="Payment Verified">Payment Verified</SelectItem>
                            <SelectItem value="Published">Published</SelectItem>
                            <SelectItem value="Rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="ghost" size="sm" onClick={() => setViewingSubmission(sub)} className="text-blue-500 hover:text-blue-700 h-8 w-8 p-0" title="View Details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteSubmission(sub.id)} className="text-red-500 hover:text-red-700 h-8 w-8 p-0" title="Delete Submission">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {submissions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No submissions found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="volumes">
          <div className="rounded-md border bg-white overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Theme / Topic</TableHead>
                  <TableHead>Deadline</TableHead>
                  <TableHead>Pages</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volumes.map((vol) => (
                  <TableRow key={vol.id}>
                    <TableCell className="font-medium">{vol.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{vol.theme}</TableCell>
                    <TableCell>{new Date(vol.submission_deadline).toLocaleDateString()}</TableCell>
                    <TableCell>{vol.pages || 0}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${vol.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {vol.status || 'open'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEditVolume(vol)} className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteVolume(vol.id)} className="text-red-500 hover:text-red-700 h-8 w-8 p-0">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {volumes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                      No volumes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="publish">
          <div className="rounded-md border bg-white overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Volume</TableHead>
                  <TableHead>Theme / Topic</TableHead>
                  <TableHead>Manuscript</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {volumes.map((vol) => (
                  <TableRow key={vol.id}>
                    <TableCell className="font-medium">{vol.title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{vol.theme}</TableCell>
                    <TableCell>
                      {vol.pdf_url ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Uploaded</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Missing</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${vol.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
                        {vol.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      {vol.status !== 'published' ? (
                        <Button size="sm" onClick={() => { setPublishVolumeId(vol.id.toString()); setPublishPdfFile(null); setIsPublishDialogOpen(true); }} className="bg-[var(--primary)] hover:bg-[var(--primary)]/90 text-white">
                          Upload & Publish
                        </Button>
                      ) : (
                        <Button size="sm" variant="outline" className="text-slate-500 cursor-not-allowed" disabled>
                          Already Published
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {volumes.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                      No volumes found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
      {/* VIEW SUBMISSION DIALOG */}
      {viewingSubmission && (
        <Dialog open={!!viewingSubmission} onOpenChange={() => setViewingSubmission(null)}>
          <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Submission Details: {viewingSubmission.id}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Chapter Title</h4>
                  <p className="font-medium mt-1">{viewingSubmission.chapter_title}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500">Volume</h4>
                  <p className="font-medium mt-1">{viewingSubmission.volume_title}</p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 flex items-center gap-2 border-b pb-2 mb-3">
                  <Users className="w-4 h-4" /> Authors
                </h4>
                <div className="space-y-4">
                  {viewingSubmission.authors && viewingSubmission.authors.map((author: any) => (
                    <div key={author.id} className={`p-3 rounded-md border ${author.is_primary ? 'bg-slate-50 border-slate-200' : 'bg-white'}`}>
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-sm">
                            {author.name} {author.is_primary && <span className="ml-2 text-[10px] bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Primary</span>}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{author.institution} • {author.country}</p>
                        </div>
                        <div className="text-right text-xs text-slate-500 space-y-1">
                          <p>{author.email}</p>
                          <p>{author.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {(!viewingSubmission.authors || viewingSubmission.authors.length === 0) && (
                    <p className="text-sm text-slate-500 italic">No author details found.</p>
                  )}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold text-slate-500 flex items-center gap-2 border-b pb-2 mb-3">
                  <FileText className="w-4 h-4" /> Content
                </h4>
                <div className="space-y-4">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Abstract</span>
                    <p className="text-sm text-slate-700 mt-1 bg-slate-50 p-3 rounded border">{viewingSubmission.abstract || "N/A"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keywords</span>
                    <p className="text-sm text-slate-700 mt-1">{viewingSubmission.keywords || "N/A"}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 flex items-center gap-2 border-b pb-2 mb-3">
                    <File className="w-4 h-4" /> Documents
                  </h4>
                  {viewingSubmission.manuscript_url ? (
                    <a href={assetUrl(viewingSubmission.manuscript_url)} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 border rounded-md hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-100 p-2 rounded">
                          <Download className="w-4 h-4 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium">Manuscript File</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-400" />
                    </a>
                  ) : (
                    <p className="text-sm text-slate-500 italic">No manuscript uploaded.</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-500 flex items-center gap-2 border-b pb-2 mb-3">
                    <CheckCircle className="w-4 h-4" /> Payment Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b border-dashed pb-2">
                      <span className="text-slate-500">Status</span>
                      <Select 
                        defaultValue={viewingSubmission.payment_status || 'Pending'} 
                        onValueChange={(val) => updatePaymentStatus(viewingSubmission.id, val)}
                      >
                        <SelectTrigger className={`w-[140px] h-8 text-xs font-semibold ${viewingSubmission.payment_status === 'Pending' ? 'text-orange-500' : viewingSubmission.payment_status === 'Failed' ? 'text-red-500' : 'text-green-600'}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Success">Success</SelectItem>
                          <SelectItem value="Failed">Failed</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex justify-between border-b border-dashed pb-2">
                      <span className="text-slate-500">Transaction ID</span>
                      <span className="font-medium">{viewingSubmission.transaction_id || 'N/A'}</span>
                    </div>
                    {viewingSubmission.payment_screenshot_url && (
                      <div className="pt-2">
                        <span className="text-slate-500 block mb-2">Screenshot:</span>
                        <a href={assetUrl(viewingSubmission.payment_screenshot_url)} target="_blank" rel="noopener noreferrer">
                          <img src={assetUrl(viewingSubmission.payment_screenshot_url)} alt="Payment" className="w-full h-32 object-cover rounded border hover:opacity-90 transition-opacity" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

    </div>
  );
}
