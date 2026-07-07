import { PageHeader } from "@/components/site/PageHeader";
import { Shield, BookOpen, FileText, CheckCircle, Scale, Users, Unlock, Edit, AlertTriangle, ChevronRight } from "lucide-react";
import { useState } from "react";

const POLICIES = [
  {
    id: "ethics",
    icon: Shield,
    title: "Publication Ethics",
    content: (
      <>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)]">
          Academic Development Forum is committed to maintaining the highest standards of integrity, transparency, and ethical publishing. Every manuscript submitted to our journals and edited volumes undergoes a rigorous editorial and peer-review process designed to ensure originality, academic merit, and scholarly contribution.
        </p>
        <div className="mt-8 p-6 bg-gradient-to-br from-[var(--secondary)] to-white rounded-2xl border border-[var(--primary)]/10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary)]/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <p className="font-medium text-[var(--ink)]">
            Authors, reviewers, editors, and editorial board members are expected to uphold professional conduct throughout the publication process.
          </p>
          <div className="mt-6 flex items-start gap-3">
            <div className="mt-1 h-2 w-2 rounded-full bg-red-500 shrink-0"></div>
            <p className="font-semibold text-red-900/80">
              ADF does not tolerate plagiarism, data fabrication, image manipulation, duplicate publication, unethical authorship practices, or conflicts of interest that compromise research integrity.
            </p>
          </div>
        </div>
      </>
    )
  },
  {
    id: "cope",
    icon: BookOpen,
    title: "COPE Compliance",
    content: (
      <>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)]">
          Academic Development Forum follows the internationally accepted principles established by the Committee on Publication Ethics (COPE). Editorial decisions are based solely on academic merit, originality, ethical compliance, and relevance to the journal scope.
        </p>
        <div className="mt-8">
          <h4 className="text-[var(--ink)] font-bold font-serif text-xl mb-4">Editors follow recognized ethical procedures when handling:</h4>
          <div className="grid sm:grid-cols-2 gap-3">
            {["Plagiarism", "Duplicate publication", "Authorship disputes", "Conflicts of interest", "Ethical misconduct", "Corrections", "Retractions"].map(item => (
              <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/5 shadow-sm hover:border-[var(--primary)]/30 transition-colors">
                <CheckCircle className="h-4 w-4 text-[var(--primary)]" />
                <span className="font-medium text-[var(--ink-soft)]">{item}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-8 p-4 bg-[var(--primary)]/5 rounded-xl text-[var(--primary)] font-medium border border-[var(--primary)]/10">
          ADF continually updates its editorial practices to reflect internationally accepted publishing standards.
        </p>
      </>
    )
  },
  {
    id: "retraction",
    icon: AlertTriangle,
    title: "Retraction Policy",
    content: (
      <>
        <h4 className="text-[var(--ink)] font-bold font-serif text-xl mb-4">Articles may be retracted when reliable evidence demonstrates:</h4>
        <div className="flex flex-wrap gap-2 mb-8">
          {["Plagiarism", "Fabricated or falsified data", "Unethical research practices", "Duplicate publication", "Serious methodological errors", "Copyright infringement", "Compromised peer review"].map(item => (
            <span key={item} className="px-4 py-2 rounded-full bg-red-50 text-red-700 text-sm font-medium border border-red-100">
              {item}
            </span>
          ))}
        </div>
        <div className="space-y-4">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-[var(--secondary)] flex items-center justify-center shrink-0">
              <Shield className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h5 className="font-bold text-[var(--ink)]">Permanent Archive</h5>
              <p className="text-[var(--ink-soft)] mt-1">Retractions remain permanently available within the journal archive to preserve the integrity of the scholarly record.</p>
            </div>
          </div>
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-black/5 shadow-sm">
            <div className="h-10 w-10 rounded-full bg-[var(--secondary)] flex items-center justify-center shrink-0">
              <FileText className="h-5 w-5 text-[var(--primary)]" />
            </div>
            <div>
              <h5 className="font-bold text-[var(--ink)]">Transparent Notices</h5>
              <p className="text-[var(--ink-soft)] mt-1">Retraction notices clearly explain the reason for retraction while maintaining transparency for readers.</p>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: "correction",
    icon: Edit,
    title: "Correction Policy",
    content: (
      <>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)]">
          When errors are identified after publication, ADF will publish appropriate corrections to maintain the accuracy of the scholarly record.
        </p>
        <div className="mt-8 grid gap-4">
          <h4 className="text-[var(--ink)] font-bold font-serif text-xl">Corrections may include:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {["Typographical corrections", "Author affiliation updates", "Metadata corrections", "Figure replacement", "Supplementary file updates", "Publisher corrections"].map(item => (
              <div key={item} className="p-4 rounded-xl bg-[var(--secondary)]/50 text-sm font-medium text-[var(--ink-soft)] text-center border border-black/5">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div className="mt-8 p-5 rounded-xl bg-orange-50 border border-orange-100 flex items-start gap-4">
          <AlertTriangle className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
          <p className="text-orange-900 font-medium">
            Major scientific errors that invalidate research findings may require article retraction rather than correction.
          </p>
        </div>
      </>
    )
  },
  {
    id: "ai-usage",
    icon: FileText,
    title: "AI Usage Policy",
    content: (
      <>
        <p className="text-lg leading-relaxed text-[var(--ink-soft)]">
          ADF recognizes that artificial intelligence tools may assist authors during manuscript preparation.
        </p>
        <div className="mt-8 flex flex-col md:flex-row gap-6">
          <div className="flex-1 p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
            <h4 className="text-[var(--ink)] font-bold font-serif text-lg mb-4 flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-500" /> Allowed Uses
            </h4>
            <ul className="space-y-3">
              {["Grammar improvement", "Language editing", "Formatting assistance", "Coding support", "Literature organization"].map(item => (
                <li key={item} className="flex items-center gap-2 text-[var(--ink-soft)]">
                  <div className="h-1.5 w-1.5 rounded-full bg-green-500"></div> {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex-1 p-6 rounded-2xl bg-gradient-to-br from-red-50 to-white border border-red-100 shadow-sm">
            <h4 className="text-[var(--ink)] font-bold font-serif text-lg mb-4 flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" /> Strict Limitations
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-red-900/80 font-medium text-sm">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                AI tools must never be listed as authors.
              </li>
              <li className="flex items-start gap-3 text-red-900/80 font-medium text-sm">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                Authors remain fully responsible for the accuracy, originality, and integrity of their work.
              </li>
              <li className="flex items-start gap-3 text-red-900/80 font-medium text-sm">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                Any substantial use of AI-generated content should be transparently disclosed in the manuscript.
              </li>
              <li className="flex items-start gap-3 text-red-900/80 font-medium text-sm">
                <div className="mt-1 h-1.5 w-1.5 rounded-full bg-red-500 shrink-0"></div>
                Editors may request clarification regarding AI-assisted content whenever necessary.
              </li>
            </ul>
          </div>
        </div>
      </>
    )
  },
  {
    id: "anti-plagiarism",
    icon: CheckCircle,
    title: "Anti-Plagiarism Policy",
    content: (
      <>
        <div className="flex flex-col md:flex-row gap-8 items-center bg-white p-8 rounded-3xl border border-black/5 shadow-xl shadow-black/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--primary)]/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
          <div className="flex-1">
            <p className="text-lg leading-relaxed text-[var(--ink)] font-medium">
              Every manuscript submitted to Academic Development Forum is screened using plagiarism detection software before peer review.
            </p>
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm shrink-0">&lt;15%</div>
                <span className="text-[var(--ink-soft)]">Similarity Index should remain below 15%</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0"><CheckCircle className="h-4 w-4" /></div>
                <span className="text-[var(--ink-soft)]">Excluding references, quotations, and standard methodological descriptions</span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 space-y-4">
            <div className="p-4 rounded-2xl bg-red-50 border border-red-100 text-red-800 text-sm font-medium leading-relaxed">
              Manuscripts exhibiting excessive similarity, duplicate publication, or unattributed content may be rejected without peer review.
            </div>
            <div className="p-4 rounded-2xl bg-orange-50 border border-orange-100 text-orange-800 text-sm font-medium leading-relaxed">
              Repeated ethical violations may result in future submission restrictions.
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: "copyright",
    icon: Scale,
    title: "Copyright Policy",
    content: (
      <>
        <div className="flex flex-col gap-6">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[var(--deep)] to-[var(--primary)] text-white relative overflow-hidden shadow-xl shadow-[var(--primary)]/20">
            <div className="relative z-10">
              <Scale className="h-10 w-10 text-white/20 absolute right-0 top-0 -mr-2 -mt-2 scale-[3]" />
              <h3 className="text-2xl font-bold font-serif mb-3">Authors retain copyright</h3>
              <p className="text-white/80 text-lg">
                Upon publication, articles are distributed under the Creative Commons Attribution (CC BY 4.0) License unless otherwise stated.
              </p>
            </div>
          </div>
          
          <div className="p-8 rounded-3xl bg-white border border-black/5 shadow-sm">
            <h4 className="text-[var(--ink)] font-bold text-lg mb-6">This license permits readers to:</h4>
            <div className="flex flex-wrap gap-4">
              {["Share", "Copy", "Redistribute", "Adapt", "Reuse"].map(item => (
                <div key={item} className="px-5 py-3 rounded-xl bg-[var(--secondary)] flex items-center gap-2 text-[var(--ink)] font-semibold shadow-sm">
                  <CheckCircle className="h-4 w-4 text-[var(--primary)]" /> {item}
                </div>
              ))}
            </div>
            <p className="mt-6 text-[var(--ink-soft)] font-medium">
              *Provided appropriate credit is given to the original authors.
            </p>
            <div className="mt-6 pt-6 border-t border-black/5">
              <p className="text-[var(--primary)] font-bold">
                ADF does not claim ownership of authors' intellectual property.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: "editorial-independence",
    icon: Users,
    title: "Editorial Independence",
    content: (
      <>
        <p className="text-xl font-medium leading-relaxed text-[var(--ink)] font-serif mb-8 text-center max-w-2xl mx-auto">
          "Editorial decisions are made independently of commercial, financial, institutional, or political influence. Publishers do not interfere with editorial decisions."
        </p>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div className="col-span-full mb-2">
            <h4 className="text-[var(--ink-soft)] font-semibold text-sm uppercase tracking-wider text-center">Editors evaluate submissions solely on:</h4>
          </div>
          {[
            { t: "Originality", d: "Novelty of the research" },
            { t: "Scientific Quality", d: "Accuracy and validity" },
            { t: "Methodological Rigor", d: "Soundness of methods" },
            { t: "Relevance", d: "Fit for the journal scope" },
            { t: "Contribution", d: "Advancement of knowledge" }
          ].map(item => (
            <div key={item.t} className="p-5 rounded-2xl bg-white border border-black/5 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-center">
              <div className="h-2 w-12 bg-[var(--primary)] rounded-full mb-4 opacity-20"></div>
              <h5 className="font-bold text-[var(--ink)]">{item.t}</h5>
              <p className="text-xs text-[var(--ink-soft)] mt-1">{item.d}</p>
            </div>
          ))}
        </div>
      </>
    )
  },
  {
    id: "conflict",
    icon: Users,
    title: "Conflict of Interest Policy",
    content: (
      <>
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-[var(--secondary)] border border-[var(--primary)]/10 flex gap-4">
            <AlertTriangle className="h-6 w-6 text-[var(--primary)] shrink-0" />
            <div>
              <h4 className="font-bold text-[var(--ink)] text-lg">Mandatory Disclosure</h4>
              <p className="text-[var(--ink-soft)] mt-2">
                Authors, reviewers, and editors must disclose any financial, institutional, or personal relationships that could influence the publication process.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm flex gap-4">
            <Users className="h-6 w-6 text-[var(--ink-soft)] shrink-0" />
            <div>
              <h4 className="font-bold text-[var(--ink)] text-lg">Independent Reassignment</h4>
              <p className="text-[var(--ink-soft)] mt-2">
                Editors may reassign manuscripts whenever a conflict exists to ensure complete fairness.
              </p>
            </div>
          </div>
          <div className="p-6 rounded-2xl bg-gradient-to-r from-green-50 to-transparent border border-green-100 flex gap-4">
            <Shield className="h-6 w-6 text-green-600 shrink-0" />
            <div>
              <h4 className="font-bold text-green-900 text-lg">Guaranteed Transparency</h4>
              <p className="text-green-800/80 mt-2">
                Transparency ensures fairness throughout the entire peer review process.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: "peer-review",
    icon: BookOpen,
    title: "Peer Review Policy",
    content: (
      <>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="p-8 rounded-3xl bg-[var(--deep)] text-white flex flex-col justify-center relative overflow-hidden">
            <div className="absolute -bottom-10 -right-10 opacity-10">
              <Users className="h-48 w-48" />
            </div>
            <h3 className="text-3xl font-bold font-serif mb-4 relative z-10">Double-Blind Review</h3>
            <p className="text-white/80 text-lg relative z-10">
              All research articles undergo a rigorous double-blind peer review process to eliminate bias and ensure objective evaluation.
            </p>
          </div>
          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center font-bold">2+</div>
                <h4 className="font-bold text-[var(--ink)]">Independent Reviewers</h4>
              </div>
              <p className="text-[var(--ink-soft)] text-sm">
                Each manuscript is evaluated by at least two independent reviewers with specific expertise in the relevant discipline.
              </p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-black/5 shadow-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-8 w-8 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center"><CheckCircle className="h-4 w-4" /></div>
                <h4 className="font-bold text-[var(--ink)]">Decision Criteria</h4>
              </div>
              <p className="text-[var(--ink-soft)] text-sm">
                Decisions are based upon reviewer recommendations, originality, methodological quality, ethical compliance, and scholarly contribution.
              </p>
            </div>
          </div>
        </div>
      </>
    )
  },
  {
    id: "open-access",
    icon: Unlock,
    title: "Open Access Policy",
    content: (
      <>
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex h-20 w-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--deep)] text-white items-center justify-center mb-8 shadow-xl shadow-[var(--primary)]/20 ring-8 ring-[var(--primary)]/5">
            <Unlock className="h-8 w-8" />
          </div>
          <h3 className="text-3xl md:text-4xl font-bold font-serif text-[var(--ink)] mb-6">
            Unrestricted access to scholarly knowledge.
          </h3>
          <p className="text-xl text-[var(--ink-soft)] leading-relaxed mb-10">
            All accepted publications are made freely accessible online without subscription barriers, promoting global dissemination of research.
          </p>
          
          <div className="inline-flex items-center gap-4 px-6 py-4 rounded-2xl bg-[var(--secondary)] border border-black/5">
            <Scale className="h-6 w-6 text-[var(--primary)]" />
            <span className="font-semibold text-[var(--ink)] text-lg">Distributed under the CC BY 4.0 license</span>
          </div>
        </div>
      </>
    )
  }
];

export default function Policies() {
  const [activeId, setActiveId] = useState(POLICIES[0].id);
  const activePolicy = POLICIES.find(p => p.id === activeId) || POLICIES[0];

  return (
    <div className="bg-[var(--secondary)] min-h-screen pb-20">
      <PageHeader
        eyebrow="Policies"
        title="Publication Ethics & Policies"
        description="Our commitment to maintaining the highest standards of integrity, transparency, and ethical publishing."
        crumbs={[{ label: "Policies" }]}
      />

      <div className="container-academic -mt-8 relative z-10">
        <div className="bg-white rounded-3xl shadow-2xl shadow-[var(--primary)]/5 border border-black/5 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          
          {/* Sidebar Navigation */}
          <div className="w-full md:w-80 bg-[#f8f9fc] border-r border-black/5 p-4 flex flex-col gap-1 overflow-y-auto shrink-0 max-h-[400px] md:max-h-[800px]">
            {POLICIES.map((policy) => {
              const Icon = policy.icon;
              const isActive = activeId === policy.id;
              
              return (
                <button
                  key={policy.id}
                  onClick={() => setActiveId(policy.id)}
                  className={`
                    w-full flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 text-left group
                    ${isActive 
                      ? "bg-white shadow-sm border border-black/5" 
                      : "hover:bg-black/[0.02] border border-transparent"
                    }
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`
                      h-8 w-8 rounded-lg flex items-center justify-center transition-colors
                      ${isActive 
                        ? "bg-[var(--primary)] text-white shadow-md shadow-[var(--primary)]/20" 
                        : "bg-black/5 text-[var(--ink-soft)] group-hover:bg-white group-hover:text-[var(--primary)]"
                      }
                    `}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className={`
                      font-semibold text-sm transition-colors
                      ${isActive ? "text-[var(--primary)]" : "text-[var(--ink-soft)] group-hover:text-[var(--ink)]"}
                    `}>
                      {policy.title}
                    </span>
                  </div>
                  {isActive && (
                    <ChevronRight className="h-4 w-4 text-[var(--primary)] opacity-50" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Content Area */}
          <div className="flex-1 p-6 md:p-12 lg:p-16 bg-white overflow-y-auto relative">
            <div 
              key={activePolicy.id} 
              className="animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out fill-mode-both"
            >
              <div className="flex items-center gap-4 mb-8 pb-6 border-b border-black/5">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--deep)] text-white flex items-center justify-center shadow-lg shadow-[var(--primary)]/20">
                  <activePolicy.icon className="h-6 w-6" />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold font-serif text-[var(--ink)] tracking-tight">
                  {activePolicy.title}
                </h2>
              </div>
              
              <div className="prose prose-lg max-w-none text-[var(--ink)]">
                {activePolicy.content}
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}




