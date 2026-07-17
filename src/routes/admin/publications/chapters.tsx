import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen, CheckCircle, Clock, XCircle, FileText } from "lucide-react";

export default function AdminChapterPublications() {
  const [submissions, setSubmissions] = useState<any[]>([]);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/publications/chapters/admin");
      const data = await res.json();
      setSubmissions(data);
    } catch (e) {
      toast.error("Failed to fetch chapter submissions");
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const updateStage = async (id: string, stage: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/publications/chapters/admin/${id}/stage`, {
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

  // Mock stats
  const stats = [
    { label: "Open Calls", value: 3, icon: BookOpen },
    { label: "Pending Reviews", value: submissions.filter(s => s.stage === 'Peer Review').length, icon: Clock },
    { label: "Accepted", value: submissions.filter(s => s.stage === 'Accepted').length, icon: CheckCircle },
    { label: "Published", value: submissions.filter(s => s.stage === 'Published').length, icon: FileText }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Chapter Publications</h2>
        <p className="text-muted-foreground">Manage volumes, submissions, and peer reviews.</p>
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
              <TableHead>Volume Name</TableHead>
              <TableHead>Chapter Title</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Current Stage</TableHead>
              <TableHead>Actions</TableHead>
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
                <TableCell>
                  <div className="flex items-center gap-2">
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
    </div>
  );
}
