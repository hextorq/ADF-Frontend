import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, Check } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface Package {
  id: number;
  name: string;
  price: string;
  features: string[];
}

export default function LiterarySubmit() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorPhone, setAuthorPhone] = useState("");
  const [authorCountry, setAuthorCountry] = useState("");
  const [authorAddress, setAuthorAddress] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  
  const [bookTitle, setBookTitle] = useState("");
  const [bookGenre, setBookGenre] = useState("");
  const [bookLanguage, setBookLanguage] = useState("");
  const [wordCount, setWordCount] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [keywords, setKeywords] = useState("");

  const [packageId, setPackageId] = useState("");
  const [manuscript, setManuscript] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  
  const [agreed, setAgreed] = useState({
    original: false,
    copyright: false,
    not_published: false,
    policies: false
  });

  useEffect(() => {
    fetch("/api/literary-submissions/packages")
      .then(res => res.json())
      .then(data => setPackages(data))
      .catch(console.error);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuscript) return toast.error("Please upload your manuscript");
    if (!Object.values(agreed).every(Boolean)) return toast.error("You must agree to all declarations");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("author_name", authorName);
    formData.append("author_email", authorEmail);
    formData.append("author_phone", authorPhone);
    formData.append("author_country", authorCountry);
    formData.append("author_address", authorAddress);
    formData.append("author_bio", authorBio);
    
    formData.append("book_title", bookTitle);
    formData.append("book_genre", bookGenre);
    formData.append("book_language", bookLanguage);
    formData.append("word_count", wordCount);
    formData.append("synopsis", synopsis);
    formData.append("keywords", keywords);
    
    formData.append("package_id", packageId);
    
    formData.append("agreed_original", String(agreed.original));
    formData.append("agreed_copyright", String(agreed.copyright));
    formData.append("agreed_not_published", String(agreed.not_published));
    formData.append("agreed_policies", String(agreed.policies));

    formData.append("manuscript", manuscript);
    if (cover) formData.append("coverImage", cover);

    try {
      const res = await fetch("/api/literary-submissions", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Submission Successful! ID: ${data.id}`);
        setStep(4);
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
        cmsKey="page.literary.submit"
        eyebrow="Literary Publications"
        title="Submit Your Manuscript"
        description="Begin your publishing journey with ADF."
        crumbs={[{ label: "Literary Publications", to: "/literary-publications" }, { label: "Submit" }]}
      />

      <div className="container-academic max-w-3xl mt-12">
        <div className="bg-white rounded-xl shadow-sm border p-8">
          {step === 1 && (
            <form onSubmit={() => setStep(2)} className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Author Details</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div><label className="text-sm font-medium mb-1 block">Full Name</label><Input required value={authorName} onChange={e => setAuthorName(e.target.value)} /></div>
                <div><label className="text-sm font-medium mb-1 block">Email</label><Input required type="email" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)} /></div>
                <div><label className="text-sm font-medium mb-1 block">Phone</label><Input required value={authorPhone} onChange={e => setAuthorPhone(e.target.value)} /></div>
                <div><label className="text-sm font-medium mb-1 block">Country</label><Input required value={authorCountry} onChange={e => setAuthorCountry(e.target.value)} /></div>
                <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Address</label><Textarea required value={authorAddress} onChange={e => setAuthorAddress(e.target.value)} /></div>
                <div className="md:col-span-2"><label className="text-sm font-medium mb-1 block">Author Bio</label><Textarea value={authorBio} onChange={e => setAuthorBio(e.target.value)} /></div>
              </div>
              <div className="pt-6"><Button type="submit" className="w-full bg-[var(--primary)]">Continue to Manuscript Details</Button></div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={() => setStep(3)} className="space-y-6">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Manuscript Details</h2>
              <div className="space-y-4">
                <div><label className="text-sm font-medium mb-1 block">Book Title</label><Input required value={bookTitle} onChange={e => setBookTitle(e.target.value)} /></div>
                <div className="grid md:grid-cols-3 gap-4">
                  <div><label className="text-sm font-medium mb-1 block">Genre</label><Input required value={bookGenre} onChange={e => setBookGenre(e.target.value)} /></div>
                  <div><label className="text-sm font-medium mb-1 block">Language</label><Input required value={bookLanguage} onChange={e => setBookLanguage(e.target.value)} /></div>
                  <div><label className="text-sm font-medium mb-1 block">Word Count</label><Input required type="number" value={wordCount} onChange={e => setWordCount(e.target.value)} /></div>
                </div>
                <div><label className="text-sm font-medium mb-1 block">Synopsis</label><Textarea required className="min-h-[120px]" value={synopsis} onChange={e => setSynopsis(e.target.value)} /></div>
                <div><label className="text-sm font-medium mb-1 block">Keywords</label><Input required value={keywords} onChange={e => setKeywords(e.target.value)} /></div>
              </div>
              <div className="pt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" className="flex-1 bg-[var(--primary)]">Continue to Upload & Package</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Upload & Package</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Manuscript (Required)</label>
                  <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 relative transition-colors">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Choose file</span>
                    <span className="text-xs mt-1">{manuscript ? manuscript.name : 'No file chosen'}</span>
                    <input type="file" required onChange={e => setManuscript(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".doc,.docx,.pdf" />
                  </label>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Upload Cover (Optional)</label>
                  <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 relative transition-colors">
                    <UploadCloud className="w-8 h-8 mb-2" />
                    <span className="text-sm font-medium">Choose file</span>
                    <span className="text-xs mt-1">{cover ? cover.name : 'No file chosen'}</span>
                    <input type="file" onChange={e => setCover(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                  </label>
                </div>
              </div>

              <div>
                <label className="text-xl font-serif font-bold mb-4 block">Select Publishing Package</label>
                {packages.length === 0 ? (
                  <div className="p-6 border-2 border-dashed rounded-xl text-center text-slate-500">
                    Loading packages...
                  </div>
                ) : (
                  <div className="grid md:grid-cols-3 gap-6">
                    {packages.map(p => {
                      const isSelected = packageId === p.id.toString();
                      return (
                        <div 
                          key={p.id} 
                          onClick={() => setPackageId(p.id.toString())}
                          className={`relative rounded-xl border-2 p-6 cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-[var(--primary)] bg-[var(--primary)]/5 shadow-md transform -translate-y-1' 
                              : 'border-border hover:border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {isSelected && (
                            <div className="absolute top-4 right-4 text-[var(--primary)]">
                              <CheckCircle2 className="w-6 h-6" />
                            </div>
                          )}
                          <h3 className="text-xl font-bold text-[var(--ink)] mb-2">{p.name}</h3>
                          <div className="text-2xl font-bold text-[var(--primary)] mb-6">
                            ₹{p.price}
                          </div>
                          <ul className="space-y-3">
                            {p.features.map((f, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                                <Check className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
                {/* Hidden input to retain required validation */}
                <input type="text" className="sr-only" required value={packageId} onChange={() => {}} tabIndex={-1} />
              </div>

              <div className="space-y-3 pt-4 border-t">
                {Object.keys(agreed).map((key) => (
                  <div key={key} className="flex items-start gap-2">
                    <Checkbox id={key} checked={agreed[key as keyof typeof agreed]} onCheckedChange={(c) => setAgreed(prev => ({ ...prev, [key]: !!c }))} />
                    <label htmlFor={key} className="text-sm text-slate-600 leading-tight">
                      I agree to the {key.replace('_', ' ')} declaration.
                    </label>
                  </div>
                ))}
              </div>

              <div className="pt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 bg-[var(--primary)]">
                  {isSubmitting ? "Submitting..." : "Submit & Proceed to Payment"}
                </Button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <UploadCloud className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[var(--ink)] mb-4">Submission Received!</h2>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Your manuscript has been submitted. Our editorial team will review it and get back to you shortly.
              </p>
              <Button onClick={() => window.location.href = '/'} className="bg-[var(--primary)]">Return Home</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
