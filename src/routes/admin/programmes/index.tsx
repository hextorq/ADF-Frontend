import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, ExternalLink } from "lucide-react";
import { apiFetch } from "@/lib/api";

type Programme = {
  id: number;
  title: string;
  type: string;
  date: string;
  duration: string;
  speaker: string;
  mode: string;
  seats: number;
  google_form_url: string;
};

export default function AdminProgrammes() {
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    type: "Workshop",
    date: "",
    duration: "",
    speaker: "",
    mode: "Online",
    seats: 100,
    google_form_url: ""
  });

  const fetchProgrammes = async () => {
    try {
      const data = await apiFetch<Programme[]>("/programmes");
      setProgrammes(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error("Failed to fetch academic programmes");
      setProgrammes([]);
    }
  };

  useEffect(() => {
    fetchProgrammes();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      title: "", type: "Workshop", date: "", duration: "", speaker: "", mode: "Online", seats: 100, google_form_url: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Programme) => {
    setEditingId(p.id);
    setFormData({
      title: p.title, type: p.type, date: p.date.split("T")[0], duration: p.duration, speaker: p.speaker, mode: p.mode, seats: p.seats, google_form_url: p.google_form_url || ""
    });
    setIsModalOpen(true);
  };

  const saveProgramme = async () => {
    if (!formData.title || !formData.date || !formData.duration || !formData.speaker) {
      toast.error("Please fill all required fields");
      return;
    }
    
    try {
      const url = editingId ? `/programmes/${editingId}` : "/programmes";
      const method = editingId ? "PATCH" : "POST";
      
      await apiFetch(url, {
        method,
        body: JSON.stringify(formData)
      });
      
      toast.success(`Programme ${editingId ? "updated" : "created"} successfully`);
      setIsModalOpen(false);
      fetchProgrammes();
    } catch (e) {
      toast.error("Failed to save programme");
    }
  };

  const deleteProgramme = async (id: number) => {
    if (!confirm("Are you sure you want to delete this programme?")) return;
    try {
      await apiFetch(`/programmes/${id}`, { method: "DELETE" });
      toast.success("Programme deleted");
      fetchProgrammes();
    } catch (e) {
      toast.error("Failed to delete programme");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Academic Programmes</h2>
          <p className="text-muted-foreground">Manage workshops, FDPs, and their registration forms.</p>
        </div>
        <Button onClick={openAddModal} className="btn-primary">
          <Plus className="w-4 h-4 mr-2" />
          Add Programme
        </Button>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Mode / Seats</TableHead>
              <TableHead>Form URL</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {programmes.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.title}</TableCell>
                <TableCell>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {p.type}
                  </span>
                </TableCell>
                <TableCell>{new Date(p.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  {p.mode} &middot; {p.seats} seats
                </TableCell>
                <TableCell>
                  {p.google_form_url ? (
                    <a href={p.google_form_url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center">
                      Link <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  ) : (
                    <span className="text-slate-400 text-xs">Not set</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => openEditModal(p)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deleteProgramme(p.id)} className="text-red-500 hover:text-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {programmes.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                  No academic programmes found. Create one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Programme" : "Add New Programme"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Title</Label>
                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. FDP on Research Methodology" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={formData.type} onValueChange={v => setFormData({ ...formData, type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FDP">FDP</SelectItem>
                    <SelectItem value="Workshop">Workshop</SelectItem>
                    <SelectItem value="Training">Training</SelectItem>
                    <SelectItem value="Webinar">Webinar</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Date</Label>
                <Input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Duration</Label>
                <Input value={formData.duration} onChange={e => setFormData({ ...formData, duration: e.target.value })} placeholder="e.g. 1 day, 90 min" />
              </div>
              <div className="space-y-2">
                <Label>Speaker(s)</Label>
                <Input value={formData.speaker} onChange={e => setFormData({ ...formData, speaker: e.target.value })} placeholder="Dr. Smith" />
              </div>
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={formData.mode} onValueChange={v => setFormData({ ...formData, mode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Online">Online</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="On-campus">On-campus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Total Seats</Label>
                <Input type="number" value={formData.seats} onChange={e => setFormData({ ...formData, seats: parseInt(e.target.value) || 0 })} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Google Form Registration URL</Label>
                <Input type="url" value={formData.google_form_url} onChange={e => setFormData({ ...formData, google_form_url: e.target.value })} placeholder="https://forms.google.com/..." />
                <p className="text-xs text-slate-500">Users will be directed to this link to register for the programme.</p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className="btn-primary" onClick={saveProgramme}>Save Programme</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
