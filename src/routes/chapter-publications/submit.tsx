import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "sonner";
import { Plus, Trash2, UploadCloud, Download, FileText, CheckCircle2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCMSStore } from "@/store/useCMSStore";
import { ManuscriptFormatter, FormattedManuscriptResult } from "@/components/formatter/ManuscriptFormatter";

interface Volume {
  id: string | number;
  title: string;
  theme?: string;
  status: string;
  submission_deadline: string;
}

interface Author {
  name: string;
  email: string;
  phone: string;
  country: string;
  institution: string;
  address: string;
  bio: string;
  is_primary: boolean;
}

export default function ChapterSubmit() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  
  useEffect(() => {
    fetch("/api/publications/chapters/volumes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
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
  const [authors, setAuthors] = useState<Author[]>([{ name: "", email: "", phone: "", country: "", institution: "", address: "", bio: "", is_primary: true }]);
  const [manuscript, setManuscript] = useState<File | null>(null);
  const [formattedResult, setFormattedResult] = useState<FormattedManuscriptResult | null>(null);
  const [agreed, setAgreed] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);

  const addCoAuthor = () => {
    setAuthors([...authors, { name: "", email: "", phone: "", country: "", institution: "", address: "", bio: "", is_primary: false }]);
  };

  const removeAuthor = (index: number) => {
    setAuthors(authors.filter((_, i) => i !== index));
  };

  const updateAuthor = (index: number, field: keyof Author, value: string) => {
    const newAuthors = [...authors];
    newAuthors[index] = { ...newAuthors[index], [field]: value };
    setAuthors(newAuthors);
  };

  const handleFormatted = (result: FormattedManuscriptResult) => {
    setFormattedResult(result);
    // Optionally autofill title/abstract/keywords if empty
    if (!chapterTitle && result.detectedStructure.title) {
      setChapterTitle(result.detectedStructure.title);
    }
    if (!abstract && result.detectedStructure.abstract) {
      setAbstract(result.detectedStructure.abstract);
    }
    if (!keywords && result.detectedStructure.keywords.length > 0) {
      setKeywords(result.detectedStructure.keywords.join(", "));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuscript) return toast.error("Please upload and format your manuscript");
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
    
    if (formattedResult) {
      formData.append("formatted_manuscript_url", formattedResult.formattedFileUrl);
      formData.append("formatting_version", formattedResult.formattingVersion);
      formData.append("formatting_issues", JSON.stringify(formattedResult.issues));
      formData.append("author_confirmed_formatting", "true");
    }

    if (paymentScreenshot) {
      formData.append("payment_screenshot", paymentScreenshot);
    }

    try {
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
      toast.error("An error occurred during submission");
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

      <div className="container-academic max-w-4xl mt-12">
        <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-10">
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
                        <SelectItem key={v.id} value={v.id.toString()}>{v.title}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Chapter Title</label>
                  <Input 
                    required 
                    placeholder="e.g., Artificial Intelligence in Higher Education" 
                    value={chapterTitle}
                    onChange={e => setChapterTitle(e.target.value)}
                    className="h-12 border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Abstract</label>
                  <Textarea 
                    required 
                    placeholder="Provide an overview of your chapter (150-250 words)..."
                    value={abstract}
                    onChange={e => setAbstract(e.target.value)}
                    rows={5}
                    className="border-slate-300"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Keywords</label>
                  <Input 
                    required 
                    placeholder="Comma separated keywords (e.g., AI, Education, Pedagogy)" 
                    value={keywords}
                    onChange={e => setKeywords(e.target.value)}
                    className="h-12 border-slate-300"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" className="btn-primary px-8">
                  Next: Authors & Manuscript Formatter
                </Button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Authors & Manuscript Submission</h2>

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
                      <div>
                        <label className="text-xs font-medium mb-1 block">Phone</label>
                        <Input required value={author.phone} onChange={e => updateAuthor(index, "phone", e.target.value)} />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block">Country</label>
                        <Input required value={author.country} onChange={e => updateAuthor(index, "country", e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium mb-1 block">Institution</label>
                        <Input required value={author.institution} onChange={e => updateAuthor(index, "institution", e.target.value)} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium mb-1 block">Address</label>
                        <Textarea required value={author.address} onChange={e => updateAuthor(index, "address", e.target.value)} rows={2} />
                      </div>
                      <div className="md:col-span-2">
                        <label className="text-xs font-medium mb-1 block">Author Bio</label>
                        <Textarea required value={author.bio} onChange={e => updateAuthor(index, "bio", e.target.value)} rows={3} />
                      </div>
                    </div>
                  </div>
                ))}
                
                <Button type="button" variant="outline" onClick={addCoAuthor} className="w-full border-dashed">
                  <Plus className="w-4 h-4 mr-2" /> Add Co-Author
                </Button>
              </div>

              {/* INTEGRATED ADF MANUSCRIPT FORMATTER */}
              <div className="pt-6 border-t space-y-4">
                <label className="text-base font-bold text-slate-900 font-serif block">
                  Manuscript Upload & Standardization
                </label>
                
                <ManuscriptFormatter
                  embedded={true}
                  initialFile={manuscript}
                  onFileChange={(f) => setManuscript(f)}
                  onFormatted={handleFormatted}
                />
              </div>

              {/* Declarations & Payment */}
              <div className="pt-6 border-t space-y-4">
                <div className="flex items-start gap-2 pt-2">
                  <Checkbox id="policies" checked={agreed} onCheckedChange={(c) => setAgreed(c as boolean)} />
                  <label htmlFor="policies" className="text-sm text-slate-600 leading-tight">
                    I agree to the publisher policies, author guidelines, and confirm this is my original work.
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
                    A permanent submission and processing fee of <strong>₹1500</strong> is required to publish your chapter in this volume. Scan the QR code below using any UPI app (GPay, PhonePe, Paytm, etc.) to complete the payment.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-xl border border-slate-200">
                    <div className="bg-white p-2 border rounded-lg shadow-sm">
                      <img src="/qr.png" alt="Payment QR" className="w-36 h-36 object-contain" />
                    </div>
                    <div className="space-y-2 text-sm text-slate-600 text-center sm:text-left">
                      <div className="font-semibold text-slate-800 text-base">UPI Payment Details</div>
                      <div>UPI ID: <span className="font-mono font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">9361665487@okbizaxis</span></div>
                      <div>Beneficiary: <span className="font-medium text-slate-900">Academic Development Forum</span></div>
                      <div className="text-xs text-amber-600 font-medium">Please save your Transaction ID and Payment Screenshot for verification.</div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Transaction ID / UTR Number *</label>
                      <Input 
                        required 
                        placeholder="e.g., 4212XXXXXXXX" 
                        value={transactionId}
                        onChange={e => setTransactionId(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700 block mb-1">Upload Payment Screenshot (Optional)</label>
                      <Input 
                        type="file" 
                        accept="image/*"
                        onChange={e => setPaymentScreenshot(e.target.files?.[0] || null)}
                        className="bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between pt-6">
                  <Button type="button" variant="outline" onClick={() => setStep(1)}>
                    Back to Details
                  </Button>
                  <Button type="submit" disabled={isSubmitting || !manuscript} className="btn-primary px-8">
                    {isSubmitting ? "Submitting..." : "Confirm & Submit Chapter"}
                  </Button>
                </div>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">Chapter Successfully Submitted!</h2>
              <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for your submission. Your manuscript has been standardized to ADF requirements and queued for double-blind editorial peer review.
              </p>
              {formattedResult && (
                <div className="pt-2 pb-4">
                  <a
                    href={formattedResult.formattedFileUrl}
                    download={formattedResult.formattedFilename}
                    className="btn-outline !py-2.5 !px-5 text-xs font-semibold inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" /> Download ADF Formatted Copy (.docx)
                  </a>
                </div>
              )}
              <div className="pt-4">
                <Button onClick={() => window.location.href = "/chapter-publications"} variant="outline">
                  Return to Chapter Publications
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
