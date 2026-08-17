import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit, Plus, BookOpen } from "lucide-react";
import { apiFetch, uploadImage } from "@/lib/api";

type Book = {
  id: number;
  title: string;
  author_id: number | null;
  author_name_resolved: string | null;
  category: string;
  price: number;
  stock_status: string;
  cover_url: string | null;
};

type Author = {
  id: number;
  name: string;
};

export default function BookManagement() {
  const [books, setBooks] = useState<Book[]>([]);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    author_id: "none",
    category: "Academic",
    price: 0,
    stock_status: "In Stock",
    cover_url: "",
    description: "",
    isbn: ""
  });
  const [coverFile, setCoverFile] = useState<File | null>(null);

  const fetchData = async () => {
    try {
      const [booksData, authorsData] = await Promise.all([
        apiFetch<Book[]>("/bookstore/books"),
        apiFetch<Author[]>("/bookstore/authors")
      ]);
      setBooks(Array.isArray(booksData) ? booksData : []);
      setAuthors(Array.isArray(authorsData) ? authorsData : []);
    } catch (e) {
      toast.error("Failed to fetch bookstore data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ title: "", author_id: "none", category: "Academic", price: 0, stock_status: "In Stock", cover_url: "", description: "", isbn: "" });
    setCoverFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = async (b: Book) => {
    setEditingId(b.id);
    // Since listBooks doesn't return full details, we'll just populate what we have
    // Ideally we should fetch the specific book details. For now we use basic fields.
    setFormData({ 
      title: b.title, 
      author_id: b.author_id ? b.author_id.toString() : "none", 
      category: b.category || "Academic", 
      price: Number(b.price) || 0, 
      stock_status: b.stock_status || "In Stock", 
      cover_url: b.cover_url || "",
      description: "", // Might be empty if not in list payload
      isbn: "" 
    });
    setCoverFile(null);
    setIsModalOpen(true);
  };

  const saveBook = async () => {
    if (!formData.title || !formData.category) {
      toast.error("Title and category are required");
      return;
    }
    
    try {
      let finalCoverUrl = formData.cover_url;
      if (coverFile) {
        toast.info("Uploading cover...");
        const res = await uploadImage(coverFile);
        finalCoverUrl = res.url;
      }

      const payload = {
        ...formData,
        author_id: formData.author_id === "none" ? null : Number(formData.author_id),
        price: Number(formData.price),
        cover_url: finalCoverUrl
      };

      const url = editingId ? `/bookstore/books/${editingId}` : "/bookstore/books";
      const method = editingId ? "PATCH" : "POST";
      
      await apiFetch(url, {
        method,
        body: JSON.stringify(payload)
      });
      
      toast.success(`Book ${editingId ? "updated" : "created"} successfully`);
      setIsModalOpen(false);
      fetchData();
    } catch (e) {
      toast.error("Failed to save book");
    }
  };

  const deleteBook = async (id: number) => {
    if (!confirm("Are you sure you want to delete this book?")) return;
    try {
      await apiFetch(`/bookstore/books/${id}`, { method: "DELETE" });
      toast.success("Book deleted");
      fetchData();
    } catch (e) {
      toast.error("Failed to delete book");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Book Management</h2>
          <p className="text-sm text-slate-500">Add, edit, or delete books from the store.</p>
        </div>
        <Button onClick={openAddModal} className="bg-slate-950 text-white hover:bg-slate-800">
          <Plus className="w-4 h-4 mr-2" /> Add New Book
        </Button>
      </div>
      
      <div className="border border-slate-200 rounded-md overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Cover</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                  No books found.
                </TableCell>
              </TableRow>
            ) : (
              books.map(b => (
                <TableRow key={b.id}>
                  <TableCell>
                    {b.cover_url ? (
                      <img src={b.cover_url} alt={b.title} className="w-8 h-10 object-cover border border-slate-200 rounded-sm" />
                    ) : (
                      <div className="w-8 h-10 bg-slate-100 flex items-center justify-center text-slate-400 rounded-sm">
                        <BookOpen className="w-4 h-4" />
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">{b.title}</TableCell>
                  <TableCell className="text-slate-500">{b.author_name_resolved || "—"}</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700">
                      {b.category}
                    </span>
                  </TableCell>
                  <TableCell>₹{b.price}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => openEditModal(b)}>
                      <Edit className="w-4 h-4 text-blue-600" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => deleteBook(b.id)}>
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit Book" : "Add New Book"}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2 col-span-2">
              <Label>Title *</Label>
              <Input 
                value={formData.title} 
                onChange={e => setFormData({ ...formData, title: e.target.value })} 
                placeholder="Book title"
              />
            </div>
            
            <div className="space-y-2">
              <Label>Author</Label>
              <Select value={formData.author_id} onValueChange={v => setFormData({ ...formData, author_id: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Author" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No Author (Anonymous)</SelectItem>
                  {authors.map(a => (
                    <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.category} onValueChange={v => setFormData({ ...formData, category: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Academic">Academic</SelectItem>
                  <SelectItem value="Literature">Literature</SelectItem>
                  <SelectItem value="Technology">Technology</SelectItem>
                  <SelectItem value="Business">Business</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Price (₹)</Label>
              <Input 
                type="number" 
                value={formData.price} 
                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} 
              />
            </div>

            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select value={formData.stock_status} onValueChange={v => setFormData({ ...formData, stock_status: v })}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="In Stock">In Stock</SelectItem>
                  <SelectItem value="Out of Stock">Out of Stock</SelectItem>
                  <SelectItem value="Pre-order">Pre-order</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label>Cover Upload</Label>
              <Input 
                type="file" 
                accept="image/*" 
                onChange={e => setCoverFile(e.target.files?.[0] || null)} 
              />
              {formData.cover_url && !coverFile && (
                <div className="text-xs text-blue-600 mt-1">Current cover URL: {formData.cover_url}</div>
              )}
            </div>

            <div className="space-y-2 col-span-2">
              <Label>Description</Label>
              <Textarea 
                value={formData.description} 
                onChange={e => setFormData({ ...formData, description: e.target.value })} 
                placeholder="Book description..."
                rows={4}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={saveBook}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
