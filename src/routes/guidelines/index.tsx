import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { SEO } from "@/components/SEO";
import { EditableText } from "@/components/cms/EditableText";
import { ArrowRight, BookOpen, CheckCircle, FileText, HelpCircle, ShieldCheck, Users } from "lucide-react";
import { buildBreadcrumbSchema } from "@/lib/seo";

const GUIDELINE_TRACKS = [
  {
    key: "author",
    title: "Author Submission Guidelines",
    eyebrow: "FOR AUTHORS & RESEARCHERS",
    description: "Detailed manuscript preparation standards, word counts, referencing formats (APA 7th Edition), anonymisation guidelines, and submission templates for journals and edited volumes.",
    link: "/guidelines/author",
    cta: "View Author Guidelines",
    icon: FileText,
    highlights: [
      "Formatting standards (Times New Roman 12pt, double-spaced)",
      "Anonymisation protocol for double-blind peer review",
      "Direct Microsoft Word manuscript template download",
      "Reference formatting rules and conflict of interest guidelines"
    ]
  },
  {
    key: "editor",
    title: "Editor Guidelines & Workflow",
    eyebrow: "FOR EDITORIAL BOARD MEMBERS",
    description: "Roles, responsibilities, and procedural standards for section editors and volume curators managing peer review, reviewer selection, and manuscript determinations.",
    link: "/guidelines/editor",
    cta: "View Editor Guidelines",
    icon: ShieldCheck,
    highlights: [
      "Editorial independence from commercial or political considerations",
      "Conflict of interest recusal protocols",
      "Selection of qualified, independent peer reviewers",
      "Misconduct investigation aligned with COPE principles"
    ]
  },
  {
    key: "reviewer",
    title: "Peer Reviewer Guidelines",
    eyebrow: "FOR PEER REVIEWERS",
    description: "Evaluation criteria, ethical requirements, and constructive feedback guidelines for referees conducting double-blind peer reviews of submitted academic papers.",
    link: "/guidelines/reviewer",
    cta: "View Reviewer Guidelines",
    icon: Users,
    highlights: [
      "Strict manuscript confidentiality and intellectual property safeguards",
      "Evaluation rubrics: originality, methodology, and academic clarity",
      "Constructive, respectful feedback and clear recommendations",
      "Standard 21-day turnaround timeframe for comprehensive review"
    ]
  }
];

export default function GuidelinesIndex() {
  const guidelinesSchema = [
    {
      "@type": "WebPage",
      "name": "Publishing Guidelines & Editorial Resources | Academic Development Forum",
      "description": "Comprehensive guidelines for authors, peer reviewers, and editors contributing to Academic Development Forum (ADF) academic journals and edited book collections.",
      "url": "https://www.adf.ijeae.com/guidelines"
    },
    buildBreadcrumbSchema([
      { name: "Guidelines", path: "/guidelines" }
    ])
  ];

  return (
    <>
      <SEO
        title="Publishing Guidelines | ADF"
        description="Access official Academic Development Forum (ADF) guidelines for authors, editors, and peer reviewers. Formatting standards and ethical criteria."
        canonical="https://www.adf.ijeae.com/guidelines"
        structuredData={guidelinesSchema}
      />

      <PageHeader
        cmsKey="page.guidelines.hub"
        eyebrow="ADF Publishing Resources"
        title="Publishing Guidelines & Editorial Resources"
        description="Clear standards and ethical workflows designed to support authors, editors, and peer reviewers across all Academic Development Forum imprints."
        crumbs={[{ label: "Guidelines" }]}
      />

      <main className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="container-academic">
          {/* Section Introduction */}
          <div className="max-w-3xl mb-12">
            <div className="eyebrow text-[var(--primary)] font-semibold tracking-wider uppercase text-xs">
              Editorial Standards
            </div>
            <h2 className="mt-2 text-3xl font-bold font-serif text-[var(--ink)]">
              Choose Your Guideline Track
            </h2>
            <p className="mt-3 text-[var(--ink-soft)] text-base leading-relaxed">
              Academic Development Forum upholds high standards of scholarly publishing and open-access dissemination.
              Select the appropriate role below to review the specific guidelines and requirements.
            </p>
          </div>

          {/* Guidelines Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {GUIDELINE_TRACKS.map((track) => {
              const Icon = track.icon;
              return (
                <div
                  key={track.key}
                  className="surface-card flex flex-col justify-between p-7 hover:border-[var(--primary)] transition shadow-sm rounded-2xl bg-white"
                >
                  <div>
                    <div className="inline-flex p-3 rounded-xl bg-blue-50 text-[var(--primary)] mb-5">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-xs uppercase tracking-wider font-bold text-[var(--primary)] mb-2">
                      {track.eyebrow}
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[var(--ink)] mb-3 leading-snug">
                      {track.title}
                    </h3>
                    <p className="text-sm text-[var(--ink-soft)] leading-relaxed mb-6">
                      {track.description}
                    </p>

                    <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                      {track.highlights.map((h, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-600">
                          <CheckCircle className="h-3.5 w-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link
                    to={track.link}
                    className="btn-primary w-full text-center flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                  >
                    <span>{track.cta}</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              );
            })}
          </div>

          {/* Bottom Supporting Resource Card */}
          <div className="mt-12 surface-card p-8 md:p-10 rounded-2xl bg-white border border-slate-200">
            <div className="grid md:grid-cols-12 gap-8 items-center">
              <div className="md:col-span-8 space-y-3">
                <div className="flex items-center gap-2 text-[var(--primary)] font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="h-4 w-4" />
                  <span>Cross-Reference Policies</span>
                </div>
                <h3 className="font-serif text-2xl font-bold text-[var(--ink)]">
                  Need More Information on Policies &amp; Ethics?
                </h3>
                <p className="text-sm text-[var(--ink-soft)] leading-relaxed">
                  Our guidelines operate in harmony with international publication ethics guidelines (COPE),
                  open access CC BY 4.0 licensing, plagiarism thresholds, and editorial board governance.
                </p>
              </div>
              <div className="md:col-span-4 flex flex-col sm:flex-row md:flex-col gap-3 justify-end">
                <Link to="/policies" className="btn-outline text-center py-2.5 px-4 rounded-xl text-sm font-semibold">
                  Publication Policies
                </Link>
                <Link to="/editorial-board" className="btn-outline text-center py-2.5 px-4 rounded-xl text-sm font-semibold">
                  Editorial Board Directory
                </Link>
                <Link to="/contact" className="btn-primary text-center py-2.5 px-4 rounded-xl text-sm font-semibold">
                  Contact Editorial Office
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
