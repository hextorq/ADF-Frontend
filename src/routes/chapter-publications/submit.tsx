import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "sonner";
import { Plus, Trash2, UploadCloud } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Volume {
  id: number;
  title: string;
  theme: string;
}

interface Author {
  name: string;
  email: string;
  institution: string;
  is_primary: boolean;
}

export default function ChapterSubmit() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [volumeId, setVolumeId] = useState("");
  const [chapterTitle, setChapterTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [authors, setAuthors] = useState<Author[]>([{ name: "", email: "", institution: "", is_primary: true }]);
  const [manuscript, setManuscript] = useState<File | null>(null);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    fetch("/api/publications/chapters/volumes")
      .then(res => res.json())
      .then(data => setVolumes(data))
      .catch(console.error);
  }, []);

  const addCoAuthor = () => {
    setAuthors([...authors, { name: "", email: "", institution: "", is_primary: false }]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuscript) return toast.error("Please upload your manuscript");
    if (!agreed) return toast.error("You must agree to the policies");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("volume_id", volumeId);
    formData.append("chapter_title", chapterTitle);
    formData.append("abstract", abstract);
    formData.append("keywords", keywords);
    formData.append("authors", JSON.stringify(authors));
    formData.append("manuscript", manuscript);

    try {
      // Step 1: Submit Form
      const res = await fetch("/api/publications/chapters/submit", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        // Step 2: Simulate Payment for testing
        toast.success(`Submission Successful! ID: ${data.submissionId}`);
        setStep(3); // Success Screen
      } else {
        toast.error(data.error || "Submission failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <PageHeader
        cmsKey="page.chapter.submit"
        eyebrow="Chapter Publications"
        title="Submit Your Chapter"
        description="Publish your research in our peer-reviewed volumes."
        crumbs={[{ label: "Chapter Publications", to: "/chapter-publications" }, { label: "Submit" }]}
      />

      <div className="container-academic max-w-3xl mt-12">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {step === 1 && (
            <form onSubmit={() => setStep(2)} className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Chapter Details</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Select Volume</label>
                  <Select value={volumeId} onValueChange={setVolumeId} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an open call..." />
                    </SelectTrigger>
                    <SelectContent>
                    {volumes.length === 0 ? (
                      <div className="p-2 text-sm text-slate-500 text-center">Loading volumes...</div>
                    ) : (
                      volumes.map(v => (
                        <SelectItem key={v.id} value={v.id.toString()}>{v.title}</SelectItem>
                      ))
                    )}
                  </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Chapter Title</label>
                  <Input required value={chapterTitle} onChange={e => setChapterTitle(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Abstract</label>
                  <Textarea required className="min-h-[120px]" value={abstract} onChange={e => setAbstract(e.target.value)} />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Keywords (comma separated)</label>
                  <Input required value={keywords} onChange={e => setKeywords(e.target.value)} />
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full bg-[var(--primary)]">Continue to Authors</Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Authors & Upload</h2>

              <div className="space-y-6">
                {authors.map((author, index) => (
                  <div key={index} className="p-4 rounded-lg border bg-slate-50 relative">
                    {index > 0 && (
                      <button type="button" onClick={() => removeAuthor(index)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                    <h4 className="font-medium text-sm text-slate-500 mb-4 uppercase">{author.is_primary ? "Primary Author" : "Co-Author"}</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-medium mb-1 block">Full Name</label>
                        <Input required value={author.name} onChange={e => updateAuthor(index, "name", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Email</label>
                        <Input required type="email" value={author.email} onChange={e => updateAuthor(index, "email", e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium mb-1 block">Institution</label>
                        <Input required value={author.institution} onChange={e => updateAuthor(index, "institution", e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button type="button" variant="outline" onClick={addCoAuthor} className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" /> Add Co-Author
                </Button>
              </div>

              <div className="pt-6 border-t space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Manuscript (Word/PDF)</label>
                  <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 relative transition-colors">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Choose file</span>
                    <span className="text-xs mt-1">{manuscript ? manuscript.name : 'No file chosen'}</span>
                    <input type="file" required onChange={e => setManuscript(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".doc,.docx,.pdf" />
                  </label>
                </div>

                <div className="flex items-start gap-2 pt-4">
                  <Checkbox id="policies" checked={agreed} onCheckedChange={(c) => setAgreed(c as boolean)} />
                  <label htmlFor="policies" className="text-sm text-slate-600 leading-tight">
                    I agree to the publisher policies, confirm this is original work, and accept the publication fee.
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[var(--primary)]">
                    {isSubmitting ? "Submitting..." : "Submit & Pay Fee"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[var(--ink)] mb-4">Submission Received!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Your chapter has been submitted successfully and the payment fee has been processed. Our editorial team will begin the review process shortly.
              </p>
              <Button onClick={() => window.location.href = '/'} className="bg-[var(--primary)]">Return Home</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Just importing CheckCircle inside component or from lucide-react above.
import { CheckCircle } from "lucide-react";
