import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Edit3, CheckCircle, FileText, UploadCloud, Mail, Trash2, Edit } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminLiteraryPublications() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSub, setEditingSub] = useState<any>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("/api/publications/literary/admin");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
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
      const res = await fetch(`/api/publications/literary/admin/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_stage: stage })
      });
      if (res.ok) {
        toast.success(`Stage updated to ${stage}`);
        fetchSubmissions();
      } else {
        toast.error("Failed to update stage");
      }
    } catch (e) {
      toast.error("Error updating stage");
    }
  };

  const publishToStore = async (id: string) => {
    setIsPublishing(id);
    try {
      const res = await fetch(`/api/publications/literary/admin/${id}/publish`, {
        method: 'POST'
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(`Published to Store! Book ID: ${data.bookId}`);
        fetchSubmissions();
      } else {
        toast.error(data.error || "Failed to publish");
      }
    } catch (e) {
      toast.error("Error publishing to store");
      setIsPublishing(null);
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      const res = await fetch(`/api/publications/literary/admin/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Submission deleted");
        fetchSubmissions();
      } else {
        toast.error("Failed to delete submission");
      }
    } catch (e) {
      toast.error("Error deleting submission");
    }
  };

  const saveSubmission = async () => {
    if (!editingSub) return;
    try {
      const res = await fetch(`/api/publications/literary/admin/${editingSub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingSub)
      });
      if (res.ok) {
        toast.success("Submission updated successfully");
        setIsEditModalOpen(false);
        fetchSubmissions();
      } else {
        toast.error("Failed to update submission");
      }
    } catch (e) {
      toast.error("Error updating submission");
    }
  };

  const openEditModal = (sub: any) => {
    setEditingSub({ ...sub });
    setIsEditModalOpen(true);
  };

  // Mock stats
  const stats = [
    { label: "New Manuscripts", value: submissions.filter(s => s.current_stage === 'Submitted').length, icon: BookOpen },
    { label: "Under Editing", value: submissions.filter(s => s.current_stage === 'Editing').length, icon: Edit3 },
    { label: "Ready to Publish", value: submissions.filter(s => s.current_stage === 'Publication').length, icon: CheckCircle },
    { label: "Published Books", value: submissions.filter(s => s.current_stage === 'Book Store').length, icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Literary Publications</h2>
        <p className="text-muted-foreground">Manage book manuscripts, editing workflow, and bookstore publishing.</p>
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

      <div className="rounded-md border bg-white overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Submission ID</TableHead>
              <TableHead>Book Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genre</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Current Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((sub) => (
              <TableRow key={sub.id}>
                <TableCell className="font-medium">{sub.id}</TableCell>
                <TableCell className="max-w-[200px] truncate">{sub.book_title}</TableCell>
                <TableCell>{sub.author_name}</TableCell>
                <TableCell>{sub.book_genre}</TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {sub.payment_status}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {sub.current_stage}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Select defaultValue={sub.current_stage} onValueChange={(val) => updateStage(sub.id, val)}>
                      <SelectTrigger className="w-[140px] h-8 text-xs">
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
                        variant="default"
                        className="h-8 text-xs bg-[var(--mint)] text-[var(--deep)] hover:bg-emerald-500 hover:text-white"
                        disabled={isPublishing === sub.id}
                        onClick={() => publishToStore(sub.id)}
                      >
                        {isPublishing === sub.id ? "Publishing..." : <><UploadCloud className="w-3 h-3 mr-1" /> Publish to Store</>}
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => window.open(`mailto:${sub.author_email}?subject=Regarding Your Manuscript Submission (${sub.id})`)}
                      title="Email Author"
                    >
                      <Mail className="w-4 h-4" />
                    </Button>

                    <Button variant="ghost" size="sm" onClick={() => openEditModal(sub)} className="h-8 w-8 p-0" title="View / Edit Details">
                      <Edit className="h-4 w-4" />
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
                <TableCell colSpan={7} className="h-24 text-center text-slate-500">
                  No submissions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>View / Edit Literary Submission</DialogTitle>
          </DialogHeader>
          
          {editingSub && (
            <Tabs defaultValue="author" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="author">Author Info</TabsTrigger>
                <TabsTrigger value="book">Book Details</TabsTrigger>
                <TabsTrigger value="status">Status & Misc</TabsTrigger>
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
                    <Label>Phone</Label>
                    <Input value={editingSub.author_phone || ""} onChange={e => setEditingSub({...editingSub, author_phone: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Country</Label>
                    <Input value={editingSub.author_country || ""} onChange={e => setEditingSub({...editingSub, author_country: e.target.value})} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Author Bio</Label>
                  <Textarea value={editingSub.author_bio || ""} onChange={e => setEditingSub({...editingSub, author_bio: e.target.value})} rows={4} />
                </div>
              </TabsContent>
              
              <TabsContent value="book" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Book Title</Label>
                    <Input value={editingSub.book_title || ""} onChange={e => setEditingSub({...editingSub, book_title: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Book Subtitle</Label>
                    <Input value={editingSub.book_subtitle || ""} onChange={e => setEditingSub({...editingSub, book_subtitle: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Genre</Label>
                    <Input value={editingSub.book_genre || ""} onChange={e => setEditingSub({...editingSub, book_genre: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Input value={editingSub.book_language || ""} onChange={e => setEditingSub({...editingSub, book_language: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Word Count</Label>
                    <Input type="number" value={editingSub.word_count || ""} onChange={e => setEditingSub({...editingSub, word_count: parseInt(e.target.value)})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Manuscript / Cover</Label>
                    <div className="flex gap-2 text-sm mt-2">
                      {editingSub.manuscript_url && <a href={editingSub.manuscript_url} target="_blank" rel="noreferrer" className="text-blue-600 underline">View Manuscript</a>}
                      {editingSub.cover_url && <a href={editingSub.cover_url} target="_blank" rel="noreferrer" className="text-blue-600 underline ml-4">View Cover</a>}
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Synopsis</Label>
                  <Textarea value={editingSub.synopsis || ""} onChange={e => setEditingSub({...editingSub, synopsis: e.target.value})} rows={5} />
                </div>
              </TabsContent>

              <TabsContent value="status" className="space-y-4 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Current Stage</Label>
                    <Select value={editingSub.current_stage || ""} onValueChange={(val) => setEditingSub({...editingSub, current_stage: val})}>
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
                    <Input value={editingSub.isbn || ""} onChange={e => setEditingSub({...editingSub, isbn: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <Label>Payment Status</Label>
                    <Input value={editingSub.payment_status || ""} readOnly className="bg-slate-50 text-slate-500" />
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
