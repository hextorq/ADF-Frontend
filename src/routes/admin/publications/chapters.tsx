import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, CheckCircle, Clock, FileText, Plus, Trash2, Edit } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AdminChapterPublications() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [volumes, setVolumes] = useState<any[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [newVolume, setNewVolume] = useState({
    title: "",
    theme: "",
    description: "",
    submission_deadline: "",
    pages: 0
  });
  const [editingVolumeId, setEditingVolumeId] = useState<string | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const [subsRes, volsRes] = await Promise.all([
        fetch("/api/publications/chapters/admin"),
        fetch("/api/publications/chapters/volumes")
      ]);
      
      if (subsRes.ok) {
        const subs = await subsRes.json();
        setSubmissions(Array.isArray(subs) ? subs : []);
      }
      
      if (volsRes.ok) {
        const vols = await volsRes.json();
        setVolumes(Array.isArray(vols) ? vols : []);
      }
    } catch (e) {
      toast.error("Failed to fetch chapter data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateStage = async (id: string, stage: string) => {
    try {
      const res = await fetch(`/api/publications/chapters/admin/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
      });
      if (res.ok) {
        toast.success(`Stage updated to ${stage}`);
        fetchData();
      } else {
        toast.error("Failed to update stage");
      }
    } catch (e) {
      toast.error("Error updating stage");
    }
  };

  const createVolume = async () => {
    try {
      const formData = new FormData();
      formData.append("title", newVolume.title);
      formData.append("theme", newVolume.theme);
      formData.append("description", newVolume.description);
      formData.append("submission_deadline", newVolume.submission_deadline);
      formData.append("pages", newVolume.pages.toString());
      if (coverImage) {
        formData.append("cover_image", coverImage);
      }

      const url = editingVolumeId 
        ? `/api/publications/chapters/volumes/${editingVolumeId}`
        : "/api/publications/chapters/volumes";
      const method = editingVolumeId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        body: formData
      });
      if (res.ok) {
        toast.success(`Volume ${editingVolumeId ? 'updated' : 'created'} successfully`);
        setIsDialogOpen(false);
        setNewVolume({ title: "", theme: "", description: "", submission_deadline: "", pages: 0 });
        setCoverImage(null);
        setEditingVolumeId(null);
        fetchData();
      } else {
        toast.error(`Failed to ${editingVolumeId ? 'update' : 'create'} volume`);
      }
    } catch (e) {
      toast.error("Error saving volume");
    }
  };

  const openEditVolume = (vol: any) => {
    setNewVolume({
      title: vol.title,
      theme: vol.theme,
      description: vol.description,
      submission_deadline: vol.submission_deadline.split('T')[0],
      pages: vol.pages || 0
    });
    setEditingVolumeId(vol.id);
    setIsDialogOpen(true);
  };

  const deleteVolume = async (id: string) => {
    if (!confirm("Are you sure you want to delete this volume?")) return;
    try {
      const res = await fetch(`/api/publications/chapters/volumes/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Volume deleted");
        fetchData();
      } else {
        toast.error("Failed to delete volume");
      }
    } catch (e) {
      toast.error("Error deleting volume");
    }
  };

  const deleteSubmission = async (id: string) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;
    try {
      const res = await fetch(`/api/publications/chapters/admin/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Submission deleted");
        fetchData();
      } else {
        toast.error("Failed to delete submission");
      }
    } catch (e) {
      toast.error("Error deleting submission");
    }
  };

  const publishVolume = async (id: string) => {
    try {
      const res = await fetch(`/api/publications/chapters/volumes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "published" })
      });
      if (res.ok) {
        toast.success("Volume published successfully");
        fetchData();
      } else {
        toast.error("Failed to publish volume");
      }
    } catch (e) {
      toast.error("Error publishing volume");
    }
  };

  const stats = [
    { label: "Total Volumes", value: volumes.length, icon: BookOpen },
    { label: "Pending Reviews", value: submissions.filter(s => s.stage === 'Peer Review').length, icon: Clock },
    { label: "Accepted", value: submissions.filter(s => s.stage === 'Accepted').length, icon: CheckCircle },
    { label: "Published Chapters", value: submissions.filter(s => s.stage === 'Published').length, icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Chapter Publications</h2>
          <p className="text-muted-foreground">Manage volumes, submissions, and peer reviews.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingVolumeId(null); setNewVolume({ title: "", theme: "", description: "", submission_deadline: "", pages: 0 }); }}><Plus className="h-4 w-4 mr-2" /> New Volume</Button>
          </DialogTrigger>
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

      <Tabs defaultValue="submissions">
        <TabsList className="mb-4">
          <TabsTrigger value="submissions">Submissions</TabsTrigger>
          <TabsTrigger value="volumes">Volumes</TabsTrigger>
        </TabsList>
        
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
                {submissions.map((sub) => (
                  <TableRow key={sub.id}>
                    <TableCell className="font-medium">{sub.id}</TableCell>
                    <TableCell>{sub.volume_title}</TableCell>
                    <TableCell className="max-w-[200px] truncate">{sub.chapter_title}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {sub.payment_status}
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
                        <Button variant="ghost" size="sm" onClick={() => deleteSubmission(sub.id)} className="text-red-500 hover:text-red-700 h-8 w-8 p-0">
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
                        {vol.status !== 'published' && (
                          <Button size="sm" variant="outline" onClick={() => publishVolume(vol.id)} className="text-xs">
                            Publish
                          </Button>
                        )}
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
      </Tabs>
    </div>
  );
}
