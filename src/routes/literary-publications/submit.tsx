import { useState } from "react";
import { PageHeader } from "@/components/site/PageHeader";
import { EditableText } from "@/components/cms/EditableText";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Upload, CreditCard, CheckCircle2, AlertCircle, FileText, Package, User } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock Packages for initial UI (will fetch from backend later)
const PACKAGES = [
  { id: 1, name: "Basic", price: 9999, features: ["ISBN Registration", "Basic Editing", "E-Certificate", "Digital Publication"] },
  { id: 2, name: "Standard", price: 19999, features: ["ISBN Registration", "Professional Editing", "Custom Cover", "Formatting", "Paperback"] },
  { id: 3, name: "Premium", price: 39999, features: ["Everything in Standard", "Marketing Support", "Social Media Promo", "Print + Digital"] }
];

export default function LiterarySubmissionPortal() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    authorName: "", authorEmail: "", authorPhone: "", authorCountry: "", authorAddress: "",
    bookTitle: "", bookGenre: "Novel", bookLanguage: "English", wordCount: "", synopsis: "",
    packageId: 0,
    agreedOriginal: false, agreedCopyright: false, agreedNotPublished: false, agreedPolicies: false
  });

  const updateForm = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmissionId(`SUB-${Date.now().toString(36).toUpperCase()}`);
      setStep(6); // Success Step
      toast.success("Manuscript submitted successfully!");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <PageHeader
        title="Literary Publication Portal"
        description="Transform your manuscript into a professionally published book."
      />

      <div className="container-academic py-12">
        
        {/* Navigation Tabs (Simulated Progress) */}
        {step < 6 && (
          <div className="mb-12">
            <div className="flex items-center justify-between relative max-w-4xl mx-auto">
              <div className="absolute left-0 right-0 top-1/2 h-1 bg-gray-200 -z-10 -translate-y-1/2"></div>
              <div className="absolute left-0 top-1/2 h-1 bg-[var(--primary)] -z-10 -translate-y-1/2 transition-all duration-500" style={{ width: `${((step - 1) / 4) * 100}%` }}></div>
              
              {[
                { num: 1, label: "Author", icon: <User className="w-5 h-5" /> },
                { num: 2, label: "Manuscript", icon: <FileText className="w-5 h-5" /> },
                { num: 3, label: "Package", icon: <Package className="w-5 h-5" /> },
                { num: 4, label: "Declarations", icon: <AlertCircle className="w-5 h-5" /> },
                { num: 5, label: "Payment", icon: <CreditCard className="w-5 h-5" /> },
              ].map((s) => (
                <div key={s.num} className="flex flex-col items-center gap-2 bg-slate-50 px-2">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg transition-colors border-4",
                    step >= s.num ? "bg-[var(--primary)] text-white border-[var(--primary)]" : "bg-white text-gray-400 border-gray-200"
                  )}>
                    {step > s.num ? <CheckCircle2 className="w-6 h-6" /> : s.icon}
                  </div>
                  <span className={cn("text-xs font-bold uppercase", step >= s.num ? "text-[var(--primary)]" : "text-gray-400")}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form Container */}
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-border p-8 md:p-12 min-h-[500px]">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Author Information</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input value={formData.authorName} onChange={e => updateForm("authorName", e.target.value)} placeholder="Dr. John Doe" />
                </div>
                <div className="space-y-2">
                  <Label>Email Address</Label>
                  <Input type="email" value={formData.authorEmail} onChange={e => updateForm("authorEmail", e.target.value)} placeholder="john@example.com" />
                </div>
                <div className="space-y-2">
                  <Label>Phone Number</Label>
                  <Input value={formData.authorPhone} onChange={e => updateForm("authorPhone", e.target.value)} placeholder="+91 98765 43210" />
                </div>
                <div className="space-y-2">
                  <Label>Country</Label>
                  <Input value={formData.authorCountry} onChange={e => updateForm("authorCountry", e.target.value)} placeholder="India" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Full Address</Label>
                  <Textarea value={formData.authorAddress} onChange={e => updateForm("authorAddress", e.target.value)} placeholder="Your residential or shipping address" />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Manuscript Details</h2>
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                <div className="col-span-2 space-y-2">
                  <Label>Book Title</Label>
                  <Input value={formData.bookTitle} onChange={e => updateForm("bookTitle", e.target.value)} placeholder="The Silent Echoes" />
                </div>
                <div className="space-y-2">
                  <Label>Genre</Label>
                  <select 
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.bookGenre} 
                    onChange={e => updateForm("bookGenre", e.target.value)}
                  >
                    <option>Novel</option>
                    <option>Poetry Collection</option>
                    <option>Anthology</option>
                    <option>Children's Book</option>
                    <option>Biography</option>
                    <option>Academic Literary Work</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Word Count</Label>
                  <Input type="number" value={formData.wordCount} onChange={e => updateForm("wordCount", e.target.value)} placeholder="e.g. 50000" />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Short Synopsis</Label>
                  <Textarea value={formData.synopsis} onChange={e => updateForm("synopsis", e.target.value)} placeholder="Brief summary of your book..." className="h-32" />
                </div>
              </div>

              <div className="p-6 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center">
                <Upload className="w-10 h-10 text-[var(--primary)] mb-4" />
                <h3 className="font-semibold mb-1">Upload Manuscript</h3>
                <p className="text-sm text-gray-500 mb-4">PDF or DOCX format (Max 50MB)</p>
                <Button variant="outline">Browse Files</Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-2">Select Publishing Package</h2>
              <p className="text-gray-500 mb-8">Choose the package that best fits your publishing goals.</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                {PACKAGES.map(pkg => (
                  <div 
                    key={pkg.id} 
                    onClick={() => updateForm("packageId", pkg.id)}
                    className={cn(
                      "border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300",
                      formData.packageId === pkg.id ? "border-[var(--primary)] bg-[var(--primary)]/5 shadow-md scale-105 relative z-10" : "border-gray-200 hover:border-gray-300 bg-white"
                    )}
                  >
                    {formData.packageId === pkg.id && (
                      <div className="absolute top-0 right-0 transform translate-x-1/3 -translate-y-1/3 text-[var(--primary)] bg-white rounded-full">
                        <CheckCircle2 className="w-8 h-8" />
                      </div>
                    )}
                    <h3 className="text-xl font-bold mb-2">{pkg.name}</h3>
                    <div className="text-3xl font-bold text-[var(--ink)] mb-6">₹{pkg.price.toLocaleString()}</div>
                    <ul className="space-y-3">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Author Declarations</h2>
              
              <div className="space-y-6 bg-slate-50 p-6 rounded-xl border border-gray-200">
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="agreedOriginal" 
                    checked={formData.agreedOriginal} 
                    onCheckedChange={(c) => updateForm("agreedOriginal", c === true)} 
                    className="mt-1"
                  />
                  <label htmlFor="agreedOriginal" className="text-sm leading-relaxed text-gray-700">
                    I confirm that this work is entirely original and my own creation. I have not plagiarized any content.
                  </label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="agreedCopyright" 
                    checked={formData.agreedCopyright} 
                    onCheckedChange={(c) => updateForm("agreedCopyright", c === true)} 
                    className="mt-1"
                  />
                  <label htmlFor="agreedCopyright" className="text-sm leading-relaxed text-gray-700">
                    I hold the copyright to this manuscript and have the legal right to publish it.
                  </label>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="agreedNotPublished" 
                    checked={formData.agreedNotPublished} 
                    onCheckedChange={(c) => updateForm("agreedNotPublished", c === true)} 
                    className="mt-1"
                  />
                  <label htmlFor="agreedNotPublished" className="text-sm leading-relaxed text-gray-700">
                    This manuscript has not been published elsewhere by another publishing house.
                  </label>
                </div>

                <div className="flex items-start space-x-3">
                  <Checkbox 
                    id="agreedPolicies" 
                    checked={formData.agreedPolicies} 
                    onCheckedChange={(c) => updateForm("agreedPolicies", c === true)} 
                    className="mt-1"
                  />
                  <label htmlFor="agreedPolicies" className="text-sm leading-relaxed text-gray-700">
                    I agree to the ADF Publication Policy, Copyright Policy, and Refund Policy.
                  </label>
                </div>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-serif font-bold text-[var(--ink)] mb-6">Payment Overview</h2>
              
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-bold text-lg mb-4">Invoice Summary</h3>
                  <div className="bg-slate-50 p-6 rounded-xl space-y-4">
                    <div className="flex justify-between text-gray-600">
                      <span>{PACKAGES.find(p => p.id === formData.packageId)?.name || 'Selected'} Package</span>
                      <span>₹{PACKAGES.find(p => p.id === formData.packageId)?.price.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>GST (18%)</span>
                      <span>₹{Math.round((PACKAGES.find(p => p.id === formData.packageId)?.price || 0) * 0.18).toLocaleString()}</span>
                    </div>
                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                      <span>Total Amount</span>
                      <span className="text-[var(--primary)]">₹{Math.round((PACKAGES.find(p => p.id === formData.packageId)?.price || 0) * 1.18).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-4">Mock Payment</h3>
                  <p className="text-sm text-gray-500 mb-6">For demonstration purposes, click below to simulate a successful payment gateway transaction.</p>
                  
                  <div className="space-y-4">
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full h-12 text-lg">
                      {isSubmitting ? "Processing..." : "Pay via UPI / Razorpay"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="animate-in zoom-in-95 duration-500 text-center py-10">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <h2 className="text-3xl font-serif font-bold text-[var(--ink)] mb-4">Submission Successful!</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto">
                Thank you for choosing ADF. Your manuscript has been submitted for editorial review.
              </p>
              
              <div className="bg-slate-50 p-6 rounded-xl inline-block mb-8">
                <p className="text-sm text-gray-500 mb-1">Your Tracking ID</p>
                <p className="text-2xl font-mono font-bold text-[var(--primary)]">{submissionId}</p>
              </div>
              
              <div>
                <Button className="mr-4">Track Submission Status</Button>
                <Button variant="outline">Return to Home</Button>
              </div>
            </div>
          )}

        </div>

        {/* Action Buttons */}
        {step < 6 && (
          <div className="max-w-4xl mx-auto mt-8 flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={prevStep} 
              disabled={step === 1}
              className="px-8"
            >
              Back
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={
                (step === 3 && formData.packageId === 0) || 
                (step === 4 && (!formData.agreedOriginal || !formData.agreedCopyright || !formData.agreedNotPublished || !formData.agreedPolicies))
              }
              className="px-12"
            >
              {step === 5 ? "Proceed to Pay" : "Continue"}
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
