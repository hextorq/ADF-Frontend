import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Edit, Plus, Image as ImageIcon } from "lucide-react";
import { apiFetch, uploadImage } from "@/lib/api";

type Author = {
  id: number;
  name: string;
  bio: string | null;
  photo_url: string | null;
  created_at: string;
};

export default function AuthorManagement() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    photo_url: ""
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const fetchAuthors = async () => {
    try {
      const data = await apiFetch<Author[]>("/bookstore/authors");
      setAuthors(Array.isArray(data) ? data : []);
    } catch (e) {
      toast.error("Failed to fetch authors");
      setAuthors([]);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ name: "", bio: "", photo_url: "" });
    setPhotoFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (a: Author) => {
    setEditingId(a.id);
    setFormData({ name: a.name, bio: a.bio || "", photo_url: a.photo_url || "" });
    setPhotoFile(null);
    setIsModalOpen(true);
  };

  const saveAuthor = async () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    
    try {
      let finalPhotoUrl = formData.photo_url;
      if (photoFile) {
        toast.info("Uploading photo...");
        const res = await uploadImage(photoFile);
        finalPhotoUrl = res.url;
      }

      const url = editingId ? `/bookstore/authors/${editingId}` : "/bookstore/authors";
      const method = editingId ? "PATCH" : "POST";
      
      await apiFetch(url, {
        method,
        body: JSON.stringify({ ...formData, photo_url: finalPhotoUrl })
      });
      
      toast.success(`Author ${editingId ? "updated" : "created"} successfully`);
      setIsModalOpen(false);
      fetchAuthors();
    } catch (e) {
      toast.error("Failed to save author");
    }
  };

  const deleteAuthor = async (id: number) => {
    if (!confirm("Are you sure you want to delete this author?")) return;
    try {
      await apiFetch(`/bookstore/authors/${id}`, { method: "DELETE" });
      toast.success("Author deleted");
      fetchAuthors();
    } catch (e) {
      toast.error("Failed to delete author");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Author Management</h2>
          <p className="text-sm text-slate-500">Add, edit, or delete authors from the store.</p>
        </div>
        <Button onClick={openAddModal} className="bg-slate-950 text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" /> Add New Author
        </Button>
      </div>
      
      <div className="border border-slate-200 rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Bio</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {authors.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-slate-500">
                  No authors found.
                </TableCell>
              </TableRow>
            ) : (
              authors.map(a => (
                <TableRow key={a.id}>
                  <TableCell>
                    {a.photo_url ? (
                      <img src={a.photo_url} alt={a.name} className="w-10 h-10 rounded-full object-cover" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                        <ImageIcon className="w-4 h-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{a.name}</TableCell>
                  <TableCell className="max-w-xs truncate text-slate-500">{a.bio || "—"}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(a)}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteAuthor(a.id)}>
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Author" : "Add New Author"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Name *</Label>
              <Input 
                value={formData.name} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Dr. Jane Doe"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Bio</Label>
              <Textarea 
                value={formData.bio} 
                onChange={e => setFormData({ ...formData, bio: e.target.value })} 
                placeholder="Short biography..."
                rows={4}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Photo Upload</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={e => setPhotoFile(e.target.files?.[0] || null)} 
              />
              {formData.photo_url && !photoFile && (
                <div className="text-xs text-blue-600 mt-1">Current photo URL: {formData.photo_url}</div>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={saveAuthor}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
