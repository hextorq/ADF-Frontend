import { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import { UploadCloud, CheckCircle2, Download, BookOpen, Image as ImageIcon, Globe2, AlertCircle, FileCheck } from "lucide-react";
import { ManuscriptFormatter, FormattedManuscriptResult } from "@/components/formatter/ManuscriptFormatter";

const CAMPAIGN_CATEGORIES = [
  { name: "Short Story", desc: "Up to 5 pages / below 2000 words (A4 | TNR 12 | 1.5)" },
  { name: "Poem", desc: "Maximum 2 Pages" },
  { name: "Drawing", desc: "One Page Artwork (High-Res)" },
  { name: "Photograph", desc: "One Page Photograph (High-Res)" },
  { name: "Quotes", desc: "Minimum of 10 Quotes" },
  { name: "Essay", desc: "Up to 5 pages / below 2000 words (A4 | TNR 12 | 1.5)" },
];

export default function LiterarySubmit() {
  const [searchParams] = useSearchParams();
  const campaignParam = searchParams.get("campaign");
  const categoryParam = searchParams.get("category");
  const isCampaign = campaignParam === "art-dreams-fusion-vol-1" || campaignParam === "adf-first-call";

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFormatter, setShowFormatter] = useState(false);
  const [formattedResult, setFormattedResult] = useState<FormattedManuscriptResult | null>(null);

  // Form State
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [authorPhone, setAuthorPhone] = useState("");
  const [authorCountry, setAuthorCountry] = useState("");
  const [authorAddress, setAuthorAddress] = useState("");
  const [authorBio, setAuthorBio] = useState("");
  const [authorInstagram, setAuthorInstagram] = useState("");
  const [authorPhoto, setAuthorPhoto] = useState<File | null>(null);
  
  const [bookTitle, setBookTitle] = useState("");
  const [bookGenre, setBookGenre] = useState(categoryParam || (isCampaign ? "Short Story" : ""));
  const [bookLanguage, setBookLanguage] = useState("English");
  const [wordCount, setWordCount] = useState("");
  const [synopsis, setSynopsis] = useState("");
  const [keywords, setKeywords] = useState("");

  const [manuscript, setManuscript] = useState<File | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [agreed, setAgreed] = useState({
    original: false,
    copyright: false,
    not_published: false,
    policies: false
  });

  useEffect(() => {
    if (categoryParam) {
      setBookGenre(categoryParam);
    }
  }, [categoryParam]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim()) return toast.error("Please enter author name (Step 1)");
    if (!authorEmail.trim()) return toast.error("Please enter author email (Step 1)");
    if (!bookTitle.trim()) return toast.error("Please enter title of work (Step 2)");
    if (!manuscript) return toast.error("Please upload your manuscript or creative work file");

    if (!Object.values(agreed).every(Boolean)) return toast.error("You must agree to all author declarations");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("authorName", authorName.trim());
    formData.append("authorEmail", authorEmail.trim().toLowerCase());
    formData.append("authorPhone", authorPhone.trim() || "+91");
    formData.append("authorCountry", authorCountry.trim() || "India");
    formData.append("authorAddress", authorAddress.trim() || "Address provided upon request");
    formData.append("authorBio", authorBio.trim());
    if (authorInstagram) formData.append("authorInstagram", authorInstagram.trim());
    if (authorPhoto) formData.append("authorPhoto", authorPhoto);
    
    formData.append("bookTitle", bookTitle.trim());
    formData.append("bookGenre", bookGenre.trim() || (isCampaign ? "Short Story" : "General"));
    formData.append("bookLanguage", bookLanguage.trim() || "English");
    formData.append("wordCount", wordCount.trim() || "0");
    formData.append("synopsis", synopsis.trim() || `${bookTitle.trim()} - creative work submission`);
    formData.append("keywords", keywords.trim() || "");
    
    formData.append("manuscript", manuscript);
    if (cover) formData.append("coverImage", cover);

    if (isCampaign) {
      formData.append("campaignId", "art-dreams-fusion-vol-1");
      formData.append("campaignName", "Art, Dreams & Fusion — Volume I");
      formData.append("submissionType", bookGenre.trim() || "Short Story");
      formData.append("transaction_id", "FREE-CAMPAIGN");
    } else {
      formData.append("transaction_id", "FREE-SUBMISSION");
    }

    if (formattedResult) {
      formData.append("formatted_url", formattedResult.formattedFileUrl);
      formData.append("sessionId", formattedResult.sessionId);
    }


    formData.append("agreedOriginal", agreed.original.toString());
    formData.append("agreedCopyright", agreed.copyright.toString());
    formData.append("agreedNotPublished", agreed.not_published.toString());
    formData.append("agreedPolicies", agreed.policies.toString());

    try {
      const res = await fetch("/api/literary-submissions", {
        method: "POST",
        body: formData
      });

      const text = await res.text();
      let data: any = {};
      try {
        if (text && text.trim()) data = JSON.parse(text);
      } catch {
        // ignore parse error
      }
      if (res.ok) {
        toast.success(`Submission Successful! ID: ${data.id || ""}`);
        setStep(4); // Success step
      } else {
        const errorMsg = data.error || (data.details && data.details.length > 0 
          ? data.details.map((d: any) => `${d.path?.join('.') || 'Field'}: ${d.message}`).join(', ')
          : "Submission failed");
        toast.error(errorMsg, { duration: 6000 });
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
        cmsKey="page.literary.submit"
        eyebrow={isCampaign ? "ADF First Call · Anthology" : "Publish With ADF"}
        title={isCampaign ? "Art, Dreams & Fusion — Volume I" : "Submit Your Manuscript"}
        description={
          isCampaign
            ? "Submit your creative work for the inauguration anthology 'Art, Dreams & Fusion: An Anthology Celebrating Everyday Voices'. Submission & publication are completely free."
            : "Begin your journey as a published author with ADF. Fill out the form below to submit your manuscript for review."
        }
        crumbs={[
          { label: "Literary Publications", to: "/literary-publications" }, 
          { label: isCampaign ? "Art, Dreams & Fusion (Vol I)" : "Submit" }
        ]}
      />

      <div className="container-academic max-w-4xl mt-10">
        
        {/* Campaign Announcement Callout Banner */}
        {isCampaign && (
          <div className="mb-8 p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-[#eef2ff] via-[#f7f9ff] to-[#f0fdf4] border-2 border-indigo-200/90 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 rounded-xl bg-[var(--primary)]/10 text-[var(--primary)] border border-indigo-200 shrink-0">
                <BookOpen className="h-6 w-6" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-900 border border-emerald-300 text-xs font-bold">
                    ₹0 FREE SUBMISSION & PUBLICATION
                  </span>
                </div>
                <h2 className="font-serif text-lg sm:text-xl font-bold text-[var(--ink)]">
                  Art, Dreams & Fusion: An Anthology Celebrating Everyday Voices
                </h2>
                <p className="text-[var(--ink-soft)] text-xs mt-1">
                  Volume I · Open for Short Stories, Poems, Drawings, Photographs, Quotes & Essays. Deadline: 20 September 2026.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <Link to="/#adf-first-call" className="text-xs font-semibold text-[var(--primary)] hover:underline">
                View Call Details
              </Link>
            </div>
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-10">
          
          {/* Step Indicator */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 1 ? 'bg-[var(--primary)] text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                1
              </span>
              <span className={`text-xs sm:text-sm font-medium ${step === 1 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                Author Details
              </span>
            </div>
            <div className="h-px w-8 sm:w-16 bg-slate-200" />
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 2 ? 'bg-[var(--primary)] text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                2
              </span>
              <span className={`text-xs sm:text-sm font-medium ${step === 2 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                Manuscript / Work
              </span>
            </div>
            <div className="h-px w-8 sm:w-16 bg-slate-200" />
            <div className="flex items-center gap-2 sm:gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${step === 3 ? 'bg-[var(--primary)] text-white' : step > 3 ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                3
              </span>
              <span className={`text-xs sm:text-sm font-medium ${step === 3 ? 'text-slate-900 font-bold' : 'text-slate-500'}`}>
                Upload & Confirm
              </span>
            </div>
          </div>

          {/* STEP 1: AUTHOR DETAILS */}
          {step === 1 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">Author Details</h2>
                {isCampaign && (
                  <span className="text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full font-medium">
                    Contributor Information
                  </span>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Full Name *</label>
                  <Input required placeholder="Author or Artist Name" value={authorName} onChange={e => setAuthorName(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Email ID *</label>
                  <Input required type="email" placeholder="author@example.com" value={authorEmail} onChange={e => setAuthorEmail(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Phone / WhatsApp Number *</label>
                  <Input required placeholder="+91 XXXXX XXXXX" value={authorPhone} onChange={e => setAuthorPhone(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Country *</label>
                  <Input required placeholder="India" value={authorCountry} onChange={e => setAuthorCountry(e.target.value)} />
                </div>

                {isCampaign && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Instagram ID (Optional)</label>
                    <Input placeholder="@your_instagram_handle" value={authorInstagram} onChange={e => setAuthorInstagram(e.target.value)} />
                    <span className="text-[11px] text-slate-500">For creator tagging on @adf_publisher</span>
                  </div>
                )}

                {isCampaign && (
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">Clear Author Photo (Optional / Recommended)</label>
                    <label className="border rounded-lg px-3 py-2 flex items-center justify-between text-xs text-slate-600 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors">
                      <span className="truncate flex items-center gap-1.5">
                        <ImageIcon className="h-4 w-4 text-slate-400 shrink-0" />
                        {authorPhoto ? authorPhoto.name : "Choose Author Photo"}
                      </span>
                      <input type="file" accept="image/*" onChange={e => setAuthorPhoto(e.target.files?.[0] || null)} className="hidden" />
                      <span className="text-[11px] font-semibold text-[var(--primary)] shrink-0 ml-2">Browse</span>
                    </label>
                    <span className="text-[11px] text-slate-500">To be featured alongside your published work</span>
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">Address *</label>
                  <Textarea required placeholder="Full postal address for courier of copies and certificates" value={authorAddress} onChange={e => setAuthorAddress(e.target.value)} rows={2} />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Author Bio {isCampaign && <span className="text-amber-700 font-normal">(4 to 5 lines recommended)</span>}
                  </label>
                  <Textarea 
                    placeholder="Brief 4 to 5 lines introducing yourself, your creative background, and artistic vision." 
                    value={authorBio} 
                    onChange={e => setAuthorBio(e.target.value)} 
                    rows={4} 
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full bg-[var(--primary)] text-white py-2.5 font-semibold">
                  Continue to Manuscript & Creative Work Details
                </Button>
              </div>
            </form>
          )}

          {/* STEP 2: MANUSCRIPT & CATEGORY DETAILS */}
          {step === 2 && (
            <form onSubmit={(e) => { e.preventDefault(); setStep(3); }} className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
                  {isCampaign ? "Anthology Submission Details" : "Manuscript Details"}
                </h2>
                {isCampaign && (
                  <span className="text-xs text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-full font-medium">
                    Art, Dreams & Fusion — Vol I
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    {isCampaign ? "Title of Your Work / Story / Poem / Artwork *" : "Book Title *"}
                  </label>
                  <Input 
                    required 
                    placeholder={isCampaign ? "e.g. Whispers in the Rain" : "Book Title"} 
                    value={bookTitle} 
                    onChange={e => setBookTitle(e.target.value)} 
                  />
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      {isCampaign ? "Submission Category *" : "Genre *"}
                    </label>
                    {isCampaign ? (
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={bookGenre}
                        onChange={e => setBookGenre(e.target.value)}
                        required
                      >
                        {CAMPAIGN_CATEGORIES.map(c => (
                          <option key={c.name} value={c.name}>
                            {c.name} ({c.desc})
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input required placeholder="Genre" value={bookGenre} onChange={e => setBookGenre(e.target.value)} />
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block flex items-center gap-1">
                      <Globe2 className="h-3.5 w-3.5 text-slate-400" /> Language *
                    </label>
                    {isCampaign ? (
                      <select
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={bookLanguage}
                        onChange={e => setBookLanguage(e.target.value)}
                        required
                      >
                        <option value="English">English</option>
                        <option value="Tamil">Tamil (தமிழ் - Latha Font)</option>
                      </select>
                    ) : (
                      <Input required placeholder="Language" value={bookLanguage} onChange={e => setBookLanguage(e.target.value)} />
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 mb-1 block">
                      Word Count {isCampaign && <span className="text-slate-400 font-normal">(0 for Artwork)</span>}
                    </label>
                    <Input 
                      type="number" 
                      placeholder="e.g. 1500" 
                      value={wordCount} 
                      onChange={e => setWordCount(e.target.value)} 
                    />
                  </div>
                </div>

                {/* Formatting helper for campaign */}
                {isCampaign && (
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-800">Anthology Formatting Guidelines:</div>
                    <p>• <strong>Short Story / Essay:</strong> Up to 5 pages or below 2000 words (A4 | Times New Roman 12 | Line Space 1.5)</p>
                    <p>• <strong>Poem:</strong> Maximum 2 Pages</p>
                    <p>• <strong>Drawing / Photograph:</strong> 1 Page high-res artwork or digital export</p>
                    <p>• <strong>Quotes:</strong> Minimum 10 quotes</p>
                    <p>• <strong>Tamil Submissions:</strong> Kindly prepare text in <strong>Latha Font</strong>.</p>
                  </div>
                )}

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    {isCampaign ? "Brief Synopsis / Description / Artist Statement *" : "Synopsis *"}
                  </label>
                  <Textarea 
                    required 
                    className="min-h-[100px]" 
                    placeholder="Provide a brief summary or reflection of the submitted piece..." 
                    value={synopsis} 
                    onChange={e => setSynopsis(e.target.value)} 
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 mb-1 block">
                    Keywords {isCampaign && <span className="text-slate-400 font-normal">(comma-separated)</span>}
                  </label>
                  <Input 
                    placeholder="e.g. Hope, Everyday Life, Resilience, Identity" 
                    value={keywords} 
                    onChange={e => setKeywords(e.target.value)} 
                  />
                </div>
              </div>

              <div className="pt-4 flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)}>Back</Button>
                <Button type="submit" className="flex-1 bg-[var(--primary)] text-white">
                  Continue to Upload & Confirmation
                </Button>
              </div>
            </form>
          )}

          {/* STEP 3: UPLOAD & PAYMENT / FREE DECLARATION */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">
                {isCampaign ? "Upload & Submission Confirmation" : "Manuscript Upload & Payment"}
              </h2>

              {/* Creative Work / Manuscript File Upload */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-slate-900 font-serif">
                    Upload Your Creative Work (Document / Image / PDF) *
                  </label>
                  <span className="text-xs text-slate-500 font-medium">
                    DOCX, DOC, PDF, JPEG, PNG, TXT (Max 50MB)
                  </span>
                </div>

                <label
                  className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all relative ${
                    manuscript
                      ? "border-emerald-500 bg-emerald-50/40 text-emerald-950"
                      : "border-slate-300 hover:border-[#071a8c] hover:bg-slate-50/80 text-slate-600"
                  }`}
                >
                  <input
                    type="file"
                    required
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      setManuscript(file);
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    accept=".docx,.doc,.pdf,.jpg,.jpeg,.png,.txt"
                  />

                  {manuscript ? (
                    <div className="space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
                        <CheckCircle2 className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">{manuscript.name}</p>
                        <p className="text-xs text-slate-500">
                          {(manuscript.size / (1024 * 1024)).toFixed(2)} MB · Click to choose a different file
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2 pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                        <UploadCloud className="w-6 h-6 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-slate-900">
                          Click to select or drag and drop your creative work
                        </p>
                        <p className="text-xs text-slate-500 mt-1">
                          Short stories, poems, essays (.docx, .pdf) or artwork, drawing & photos (.jpg, .png)
                        </p>
                      </div>
                    </div>
                  )}
                </label>
              </div>

              {/* Optional ADF Manuscript Standardization for Literary DOCX */}
              <div className="pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <div className="flex items-center gap-2.5">
                    <FileCheck className="w-5 h-5 text-blue-700 shrink-0" />
                    <div>
                      <div className="text-xs font-bold text-blue-950">
                        Official ADF Document Standardization (Optional)
                      </div>
                      <div className="text-[11px] text-blue-800/80">
                        Standardize formatting into the official ADF Master Template (Letter, Times New Roman, running header, 0 content rewriting).
                      </div>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowFormatter(!showFormatter)}
                    className="text-xs font-semibold bg-white border-blue-300 text-blue-800 hover:bg-blue-50 shrink-0 self-start sm:self-center"
                  >
                    {showFormatter ? "Hide Formatter" : "Standardize Manuscript"}
                  </Button>
                </div>

                {showFormatter && (
                  <div className="mt-4">
                    <ManuscriptFormatter
                      embedded={true}
                      initialFile={manuscript}
                      publicationType="Literary Publications"
                      onFileChange={(f) => setManuscript(f)}
                      onFormatted={(res) => {
                        setFormattedResult(res);
                        toast.success("Literary manuscript formatted according to ADF guidelines!");
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Optional Cover Upload */}
              <div className="pt-4 border-t">
                <label className="text-sm font-medium mb-2 block">
                  {isCampaign ? "Upload Supplementary Image / Artwork Preview (Optional)" : "Upload Cover Image (Optional)"}
                </label>
                <label className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 relative transition-colors max-w-sm">
                  <UploadCloud className="w-8 h-8 mb-2 text-slate-400" />
                  <span className="text-sm font-medium">Choose File</span>
                  <span className="text-xs mt-1 text-slate-400">{cover ? cover.name : 'No file chosen'}</span>
                  <input type="file" onChange={e => setCover(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                </label>
              </div>

              {/* Free Submission Notice */}
              {isCampaign ? (
                <div className="bg-emerald-50 text-emerald-900 p-6 rounded-2xl border border-emerald-300 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-200 text-emerald-800 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="inline-block px-2.5 py-0.5 rounded bg-emerald-200/80 text-emerald-900 text-[10px] font-bold uppercase tracking-wider">
                        ADF First Call Benefit
                      </div>
                      <h3 className="font-serif text-lg sm:text-xl font-bold text-emerald-950">
                        Zero Submission & Publication Fee (₹0)
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-emerald-900 leading-relaxed">
                    Submission and publication in <strong>Art, Dreams & Fusion — Volume I</strong> are completely <strong>FREE</strong>. No processing fee, registration charge, or payment is required to submit your work today.
                  </p>

                  <div className="bg-white/90 p-4 rounded-xl border border-emerald-200 text-xs text-slate-700 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-emerald-700">✓</span>
                      <span><strong>Author Benefits:</strong> Certificate of Participation + ISBN registration for the book.</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-amber-700">•</span>
                      <span>
                        <strong>Printed Hard Copies:</strong> If you require a printed physical copy of the anthology, a nominal printing cost along with courier charges must be paid after the book is finalized.
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-bold text-amber-700">•</span>
                      <span>
                        Payment for optional hard copies is collected <em>only after finalization of the book and upon submission of the signed Declaration Form</em>.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-emerald-50/70 text-emerald-950 p-5 rounded-2xl border border-emerald-200/90 shadow-xs space-y-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-serif text-base font-bold text-emerald-950">
                        Free Manuscript Submission & Evaluation
                      </h3>
                      <p className="text-xs text-emerald-800">
                        No processing fee or payment is required to submit your manuscript. Our editorial team will evaluate your work and communicate publication arrangements.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Declarations */}
              <div className="pt-6 border-t space-y-3">
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] mb-2">Author Declarations</h3>
                
                <div className="flex items-start gap-2">
                  <Checkbox id="original" checked={agreed.original} onCheckedChange={c => setAgreed({ ...agreed, original: !!c })} />
                  <label htmlFor="original" className="text-xs text-slate-600 leading-normal">
                    I confirm that this manuscript / creative piece is my original work and does not infringe upon any copyright.
                  </label>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox id="copyright" checked={agreed.copyright} onCheckedChange={c => setAgreed({ ...agreed, copyright: !!c })} />
                  <label htmlFor="copyright" className="text-xs text-slate-600 leading-normal">
                    I agree that ADF will hold publication rights for inclusion in the literary anthology as per ADF publishing policies.
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="not_published" checked={agreed.not_published} onCheckedChange={c => setAgreed({ ...agreed, not_published: !!c })} />
                  <label htmlFor="not_published" className="text-xs text-slate-600 leading-normal">
                    I confirm that this work has not been previously published elsewhere in print or commercial digital format.
                  </label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="policies" checked={agreed.policies} onCheckedChange={c => setAgreed({ ...agreed, policies: !!c })} />
                  <label htmlFor="policies" className="text-xs text-slate-600 leading-normal">
                    I agree to all ADF editorial guidelines, publication ethics, and anthology terms.
                  </label>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !manuscript} 
                  className={`flex-1 font-semibold text-white ${
                    isCampaign 
                      ? '!bg-gradient-to-r !from-emerald-600 !to-teal-600 hover:!from-emerald-500 hover:!to-teal-500' 
                      : 'bg-[var(--primary)]'
                  }`}
                >
                  {isSubmitting 
                    ? "Submitting Your Work..." 
                    : isCampaign 
                      ? "Submit Work to Anthology (100% FREE)" 
                      : "Submit Manuscript (Free)"
                  }
                </Button>
              </div>
            </form>
          )}

          {/* STEP 4: SUBMISSION SUCCESS */}
          {step === 4 && (
            <div className="text-center py-12 space-y-5">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <span className="text-xs uppercase font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                  {isCampaign ? "Art, Dreams & Fusion — Volume I" : "Literary Submission"}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[var(--ink)] mt-2">
                  Submission Successfully Received!
                </h2>
              </div>
              
              <p className="text-slate-600 max-w-lg mx-auto text-sm leading-relaxed">
                {isCampaign 
                  ? "Thank you for sharing your voice! Your creative piece has been submitted to the inaugural anthology 'Art, Dreams & Fusion: An Anthology Celebrating Everyday Voices' (Volume I). Our editorial committee will review your submission and contact you via email."
                  : "Thank you for choosing ADF. Your manuscript has been received. Our editorial team will review your manuscript and formatted specifications and get back to you within 3–5 business days."}
              </p>


              <div className="pt-4 flex flex-wrap justify-center gap-3">
                <Link to="/" className="btn-primary">
                  Return to Homepage
                </Link>
                <Link to="/literary-publications" className="btn-outline">
                  Literary Publications Overview
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
