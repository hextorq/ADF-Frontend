import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "sonner";
import { Plus, Trash2, UploadCloud, Download, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCMSStore } from "@/store/useCMSStore";

interface Volume {
  id: string | number;
  title: string;
  theme?: string;
  status: string;
}

interface Author {
  name: string;
  email: string;
  institution: string;
  is_primary: boolean;
}

export default function ChapterSubmit() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  
  useEffect(() => {
    fetch("/api/publications/chapters/volumes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Only show open volumes
          setVolumes(data.filter(v => v.status === 'open' || v.status === 'open'));
        }
      })
      .catch(console.error);
  }, []);

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
  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

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
    formData.append("transaction_id", transactionId);
    if (paymentScreenshot) {
      formData.append("payment_screenshot", paymentScreenshot);
    }

    try {
      // Step 1: Submit Form
      const res = await fetch("/api/publications/chapters/submit", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
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
                    <SelectTrigger className="h-12 border-slate-300">
                      <SelectValue placeholder="Select an Open Call / Volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {volumes.length === 0 && (
                        <SelectItem value="none" disabled>No open volumes available</SelectItem>
                      )}
                      {volumes.map(v => (
                        <SelectItem key={v.id} value={v.id.toString()}>
                          {v.title} {v.theme ? `(${v.theme})` : ''} - Deadline: {new Date(v.submission_deadline).toLocaleDateString()}
                        </SelectItem>
                      ))}
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
                    I agree to the publisher policies and confirm this is my original work.
                  </label>
                </div>

                <div className="bg-slate-50 text-slate-800 p-6 rounded-xl border border-slate-200 mt-6 shadow-sm">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 15v2"/><path d="M15 9h2"/><path d="M15 15h2"/></svg>
                    </span>
                    Payment Instructions
                  </h3>
                  <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                    A permanent submission and processing fee of <strong>₹500</strong> is required to publish your chapter in this volume. Scan the QR code below using any UPI app (GPay, PhonePe, Paytm, etc.) to complete the payment.
                  </p>

                  <div className="flex flex-col md:flex-row gap-6 items-center bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
                    <div className="bg-white p-3 rounded-2xl border-2 border-slate-100 shadow-sm shrink-0">
                      <img 
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("upi://pay?pa=7502398680@sbi&pn=ATTRAIT DOVIN FEDRICK SELVARAJ&cu=INR&am=500")}`} 
                        alt="Payment QR Code" 
                        className="w-40 h-40 rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-4 w-full">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">UPI ID</label>
                        <div className="font-mono text-slate-700 font-medium bg-slate-50 p-2 rounded-md border flex justify-between items-center">
                          7502398680@sbi
                          <button type="button" onClick={() => {navigator.clipboard.writeText('7502398680@sbi'); toast.success('UPI ID copied!');}} className="text-slate-400 hover:text-[var(--primary)] p-1 transition-colors">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                          </button>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Receiver Name</label>
                        <div className="text-sm font-medium text-slate-700">
                          ATTRAIT DOVIN FEDRICK SELVARAJ
                        </div>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</label>
                        <div className="text-xl font-bold text-[var(--primary)]">
                          ₹500.00
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 space-y-5">
                    <div>
                      <label className="text-sm font-medium mb-1 block">Transaction Reference ID (UTR / UPI Ref Number)</label>
                      <Input required placeholder="e.g. 312345678901" value={transactionId} onChange={e => setTransactionId(e.target.value)} className="bg-white border-slate-200" />
                      <p className="text-xs text-slate-500 mt-1">Please enter the 12-digit reference number after making the payment.</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-2 block">Upload Payment Screenshot</label>
                      <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-white relative transition-colors bg-white/50 border-slate-200">
                        <UploadCloud className="w-6 h-6 mb-2 text-slate-400" />
                        <span className="text-sm font-medium text-slate-600">Choose screenshot</span>
                        <span className="text-xs mt-1 text-slate-400">{paymentScreenshot ? paymentScreenshot.name : 'No file chosen'}</span>
                        <input type="file" required onChange={e => setPaymentScreenshot(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                      </label>
                      <p className="text-xs text-slate-500 mt-2">Please upload a clear screenshot of your successful transaction.</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                  <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[var(--primary)]">
                    {isSubmitting ? "Processing Payment & Submitting..." : "Pay ₹500 & Submit Chapter"}
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
                Your chapter has been submitted successfully. Our editorial team will begin the review process shortly.
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
