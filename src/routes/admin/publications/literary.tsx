import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, Edit3, CheckCircle, FileText, UploadCloud } from "lucide-react";

export default function AdminLiteraryPublications() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState<string | null>(null);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/publications/literary/admin");
      const data = await res.json();
      setSubmissions(data);
    } catch (e) {
      toast.error("Failed to fetch literary submissions");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStage = async (id: string, stage: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/publications/literary/admin/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stage })
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
      const res = await fetch(`http://localhost:5000/api/publications/literary/admin/${id}/publish`, {
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
    } finally {
      setIsPublishing(null);
    }
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
              <TableHead>Actions</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-2">
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
    </div>
  );
}
