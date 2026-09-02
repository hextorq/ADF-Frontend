import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageHeader } from "@/components/site/PageHeader";
import { toast } from "sonner";
import { UploadCloud, CheckCircle2, Check, Download } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { ManuscriptFormatter, FormattedManuscriptResult } from "@/components/formatter/ManuscriptFormatter";

export default function LiterarySubmit() {
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

  const [manuscript, setManuscript] = useState<File | null>(null);
  const [formattedResult, setFormattedResult] = useState<FormattedManuscriptResult | null>(null);
  const [cover, setCover] = useState<File | null>(null);
  const [transactionId, setTransactionId] = useState("");
  const [paymentScreenshot, setPaymentScreenshot] = useState<File | null>(null);
  
  const [agreed, setAgreed] = useState({
    original: false,
    copyright: false,
    not_published: false,
    policies: false
  });

  const handleFormatted = (res: FormattedManuscriptResult) => {
    setFormattedResult(res);
    if (!bookTitle && res.detectedStructure.title) {
      setBookTitle(res.detectedStructure.title);
    }
    if (!wordCount && res.stats.wordCount) {
      setWordCount(res.stats.wordCount.toString());
    }
    if (!keywords && res.detectedStructure.keywords.length > 0) {
      setKeywords(res.detectedStructure.keywords.join(", "));
    }
    if (!synopsis && res.detectedStructure.abstract) {
      setSynopsis(res.detectedStructure.abstract);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manuscript) return toast.error("Please upload your manuscript");
    if (!transactionId) return toast.error("Please enter your Transaction ID / UTR");
    if (!paymentScreenshot) return toast.error("Please upload your payment screenshot");
    if (!Object.values(agreed).every(Boolean)) return toast.error("You must agree to all declarations");

    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("authorName", authorName);
    formData.append("authorEmail", authorEmail);
    formData.append("authorPhone", authorPhone);
    formData.append("authorCountry", authorCountry);
    formData.append("authorAddress", authorAddress);
    formData.append("authorBio", authorBio);
    
    formData.append("bookTitle", bookTitle);
    formData.append("bookGenre", bookGenre);
    formData.append("bookLanguage", bookLanguage);
    formData.append("wordCount", wordCount);
    formData.append("synopsis", synopsis);
    formData.append("keywords", keywords);
    
    formData.append("manuscript", manuscript);
    if (cover) formData.append("coverImage", cover);
    formData.append("transaction_id", transactionId);
    if (paymentScreenshot) formData.append("payment_screenshot", paymentScreenshot);

    if (formattedResult) {
      formData.append("formatted_manuscript_url", formattedResult.formattedFileUrl);
      formData.append("formatting_version", formattedResult.formattingVersion);
      formData.append("formatting_issues", JSON.stringify(formattedResult.issues));
      formData.append("author_confirmed_formatting", "true");
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

      const data = await res.json();
      if (res.ok) {
        toast.success(`Submission Successful! ID: ${data.id}`);
        setStep(4); // Success step
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
        cmsKey="page.literary.submit"
        eyebrow="Publish With ADF"
        title="Submit Your Manuscript"
        description="Begin your journey as a published author with ADF. Fill out the form below to submit your manuscript for review."
        crumbs={[{ label: "Literary Publications", to: "/literary-publications" }, { label: "Submit" }]}
      />

      <div className="container-academic max-w-4xl mt-12">
        <div className="bg-white rounded-xl shadow-sm border p-6 sm:p-10">
          
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
                <Button type="submit" className="flex-1 bg-[var(--primary)]">Continue to Upload & Formatter</Button>
              </div>
            </form>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Manuscript Upload & Payment</h2>

              {/* INTEGRATED ADF MANUSCRIPT FORMATTER */}
              <div className="space-y-4">
                <ManuscriptFormatter
                  embedded={true}
                  initialFile={manuscript}
                  onFileChange={(f) => setManuscript(f)}
                  onFormatted={handleFormatted}
                />
              </div>

              {/* Cover Upload */}
              <div className="pt-4 border-t">
                <label className="text-sm font-medium mb-2 block">Upload Cover Image (Optional)</label>
                <label className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 cursor-pointer hover:bg-slate-50 relative transition-colors max-w-sm">
                  <UploadCloud className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Choose Cover Image</span>
                  <span className="text-xs mt-1">{cover ? cover.name : 'No file chosen'}</span>
                  <input type="file" onChange={e => setCover(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                </label>
              </div>

              {/* REVERTED TO OLD 500 RUPEE GPAY QR CODE PAYMENT SECTION */}
              <div className="bg-slate-50 text-slate-800 p-6 rounded-xl border border-slate-200 mt-6 shadow-sm">
                <h3 className="font-bold text-lg mb-2 flex items-center gap-2 text-slate-900">
                  <span className="bg-emerald-100 text-emerald-700 p-1.5 rounded-lg">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M9 15v2"/><path d="M15 9h2"/><path d="M15 15h2"/></svg>
                  </span>
                  Publication Processing Fee
                </h3>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  A submission and processing fee of <strong>₹500</strong> is required to publish your manuscript. Scan the QR code below using Google Pay (GPay), PhonePe, Paytm, or any UPI app to complete the payment.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 bg-white p-6 rounded-xl border border-slate-200">
                  <div className="bg-white p-2 border rounded-lg shadow-sm shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent("upi://pay?pa=7502398680@sbi&pn=ATTRAIT DOVIN FEDRICK SELVARAJ&cu=INR&am=500")}`} 
                      alt="Payment QR Code" 
                      className="w-36 h-36 rounded-lg object-contain"
                    />
                  </div>
                  <div className="space-y-2 text-sm text-slate-600 text-center sm:text-left flex-1">
                    <div className="font-semibold text-slate-800 text-base">UPI / GPay Payment Details</div>
                    <div>UPI ID: <span className="font-mono font-medium text-slate-900 bg-slate-100 px-2 py-0.5 rounded">7502398680@sbi</span></div>
                    <div>Beneficiary: <span className="font-medium text-slate-900">ATTRAIT DOVIN FEDRICK SELVARAJ</span></div>
                    <div>Amount: <span className="font-bold text-lg text-[var(--primary)]">₹500.00</span></div>
                    <div className="text-xs text-amber-600 font-medium">Please enter your 12-digit transaction ID / UTR and upload the payment screenshot for verification.</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-6">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Transaction ID / UTR Number *</label>
                    <Input 
                      required 
                      placeholder="e.g. 312345678901" 
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Upload Payment Screenshot *</label>
                    <Input 
                      type="file" 
                      accept="image/*"
                      required
                      onChange={e => setPaymentScreenshot(e.target.files?.[0] || null)}
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>

              {/* Declarations */}
              <div className="pt-6 border-t space-y-3">
                <h3 className="text-lg font-serif font-bold text-[var(--ink)] mb-2">Author Declarations</h3>
                
                <div className="flex items-start gap-2">
                  <Checkbox id="original" checked={agreed.original} onCheckedChange={c => setAgreed({ ...agreed, original: !!c })} />
                  <label htmlFor="original" className="text-xs text-slate-600">I confirm that this manuscript is my original work and does not infringe upon any copyright.</label>
                </div>
                
                <div className="flex items-start gap-2">
                  <Checkbox id="copyright" checked={agreed.copyright} onCheckedChange={c => setAgreed({ ...agreed, copyright: !!c })} />
                  <label htmlFor="copyright" className="text-xs text-slate-600">I agree that ADF will hold publication rights as per the publication policy.</label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="not_published" checked={agreed.not_published} onCheckedChange={c => setAgreed({ ...agreed, not_published: !!c })} />
                  <label htmlFor="not_published" className="text-xs text-slate-600">I confirm that this book has not been previously published elsewhere in print or digital format.</label>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox id="policies" checked={agreed.policies} onCheckedChange={c => setAgreed({ ...agreed, policies: !!c })} />
                  <label htmlFor="policies" className="text-xs text-slate-600">I agree to all ADF editorial, formatting, and payment policies.</label>
                </div>
              </div>

              <div className="pt-6 flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(2)}>Back</Button>
                <Button type="submit" disabled={isSubmitting || !manuscript} className="flex-1 bg-[var(--primary)]">
                  {isSubmitting ? "Processing Payment & Submitting..." : "Pay ₹500 & Submit Manuscript"}
                </Button>
              </div>
            </form>
          )}

          {step === 4 && (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)]">Manuscript Successfully Submitted!</h2>
              <p className="text-slate-600 max-w-md mx-auto text-sm leading-relaxed">
                Thank you for choosing ADF. Your payment and manuscript have been received. Our editorial team will review your manuscript and formatted specifications and get back to you within 3–5 business days.
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
                <Button onClick={() => window.location.href = "/literary-publications"} variant="outline">
                  Return to Literary Publications
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
