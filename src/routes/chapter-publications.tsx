import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { CheckCircle2, Download, FileText, BookOpen } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const STEPS = [
  { n: "01", t: "Call announced", d: "Theme published with submission window and editor contacts." },
  { n: "02", t: "Chapter submission", d: "Authors upload full chapter following the ADF template." },
  { n: "03", t: "Double-blind review", d: "Two independent reviewers assess each chapter." },
  { n: "04", t: "Revisions & acceptance", d: "Authors revise; editors confirm acceptance." },
  { n: "05", t: "Production & ISBN", d: "Copyediting, typesetting, and ISBN assignment." },
  { n: "06", t: "Open access release", d: "Volume published online and in print." },
];

export default function Page() {
  const [releasedChapters, setReleasedChapters] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/publications/chapters/volumes")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          // Only show published volumes
          setReleasedChapters(data.filter(v => v.status === 'published'));
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <PageHeader
        cmsKey="page.chapter-publications"
        eyebrow="Convergence Series"
        title="Chapter Publications — Multidisciplinary Perspectives in Contemporary Research"
        description="A bi-monthly edited volume series. ISBN assigned, double-blind peer review, open access."
        crumbs={[{ label: "Chapter Publications" }]}
      />

      {/* 1. Latest Released Chapters */}
      <section className="pt-16 pb-8 bg-[var(--surface)]">
        <div className="container-academic">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <EditableText contentKey="page.chapter-publications.latest.title" fallback="Latest Released Chapters" as="h2" className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]" label="Latest Chapters title" />
              <p className="mt-2 text-sm text-[var(--ink-soft)] max-w-xl">
                Browse our recently published edited volumes and download the full chapters for free in PDF format.
              </p>
            </div>
          </div>

          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-4">
              {releasedChapters.map((chapter) => (
                <CarouselItem key={chapter.id} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                  <div className="bg-white rounded-xl shadow-sm border border-black/5 overflow-hidden group hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
                    {/* Actual Book Cover Image */}
                    <div className="h-56 relative overflow-hidden bg-slate-100 flex items-center justify-center">
                      {chapter.cover_url ? (
                        <img 
                          src={chapter.cover_url} 
                          alt={chapter.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                         <BookOpen className="w-12 h-12 text-slate-300" />
                      )}
                      {/* Dark overlay for text readability */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40 pointer-events-none" />
                      
                      <div className="absolute top-4 inset-x-4 flex justify-between items-start z-10">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold border border-white/20 shadow-sm">
                          <BookOpen className="w-3.5 h-3.5" />
                          Volume
                        </span>
                        <span className="text-white/90 text-xs font-semibold bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10 shadow-sm">
                          {new Date(chapter.submission_deadline).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                        </span>
                      </div>
                      
                      <h4 className="absolute bottom-4 inset-x-4 z-10 font-serif font-bold text-xl text-white leading-tight drop-shadow-lg">
                        {chapter.title}
                      </h4>
                    </div>

                    {/* Card Content */}
                    <div className="p-6 flex flex-col flex-grow">
                      <div className="flex items-center gap-3 text-xs text-[var(--ink-soft)] font-semibold mb-4">
                        <span className="flex items-center gap-1.5">
                          <FileText className="w-3.5 h-3.5 text-slate-400" /> {chapter.pages || 0} Pages
                        </span>
                        <span className="w-1 h-1 rounded-full bg-slate-300" />
                        <span className="flex items-center gap-1.5 text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Open Access
                        </span>
                      </div>
                      
                      <p className="text-[var(--ink)] text-sm font-medium leading-relaxed mb-6 flex-grow line-clamp-3">
                        {chapter.theme}
                      </p>

                      <a 
                        href="#" 
                        onClick={(e) => { e.preventDefault(); alert('PDF download would start here.'); }}
                        className="group/btn w-full inline-flex items-center justify-center gap-2 bg-slate-50 hover:bg-[var(--primary)] text-[var(--primary)] hover:text-white border border-slate-200 hover:border-transparent px-4 py-3 rounded-lg font-semibold transition-all duration-300 shadow-sm"
                      >
                        <Download className="w-4 h-4 group-hover/btn:-translate-y-0.5 transition-transform" />
                        Download PDF
                      </a>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-8">
              <CarouselPrevious className="static transform-none h-10 w-10 bg-white border border-border hover:bg-slate-50" />
              <CarouselNext className="static transform-none h-10 w-10 bg-white border border-border hover:bg-slate-50" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* 2. Submit a Chapter CTA */}
      <section className="pt-4 pb-16 bg-[var(--surface)]">
        <div className="container-academic surface-card p-8 md:p-12 hero-gradient text-white border-transparent">
          <EditableText contentKey="page.chapter-publications.cta.title" fallback="Submit a Chapter to Convergence Vol. IV" as="h3" className="font-serif text-2xl font-bold" label="CTA title" />
          <EditableText contentKey="page.chapter-publications.cta.description" fallback="Open call - Closes 15 Sep 2026. Themes across sciences, humanities, social sciences, education, and management." as="p" multiline className="mt-2 text-white/80 max-w-2xl" label="CTA description" />
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/chapter-publications/submit" className="inline-flex items-center gap-2 rounded-md bg-[var(--mint)] px-5 py-3 text-sm font-semibold text-[var(--deep)] hover:bg-white">
              Submit your chapter
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10">
              Contact editor
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Features */}
      <section className="py-16 bg-[var(--secondary)]">
        <div className="container-academic grid lg:grid-cols-3 gap-6">
          {[
            { t: "ISBN Assigned", d: "Every volume receives a standard ISBN." },
            { t: "Double-Blind Peer Review", d: "Two reviewers per chapter, identities concealed." },
            { t: "Open Access", d: "CC BY 4.0 licensing by default." },
          ].map((it) => (
            <div key={it.t} className="surface-card p-6 bg-white">
              <CheckCircle2 className="h-6 w-6 text-[var(--accent)]" />
              <EditableText contentKey={`page.chapter-publications.feature.${it.t}.title`} fallback={it.t} as="h3" className="mt-3 font-serif text-lg font-semibold text-[var(--ink)]" label="Feature title" />
              <EditableText contentKey={`page.chapter-publications.feature.${it.t}.desc`} fallback={it.d} as="p" multiline className="mt-1 text-sm text-[var(--ink-soft)]" label="Feature description" />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Workflow */}
      <section className="py-16 bg-white border-t border-border">
        <div className="container-academic">
          <EditableText contentKey="page.chapter-publications.workflow.title" fallback="Submission Workflow" as="h2" className="font-serif text-2xl md:text-3xl font-bold text-[var(--ink)]" label="Workflow title" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.n} className="surface-card p-5 bg-[var(--surface)]">
                <div className="font-serif text-3xl font-bold text-[var(--primary)]">{s.n}</div>
                <EditableText contentKey={`page.chapter-publications.workflow.${s.n}.title`} fallback={s.t} as="div" className="mt-2 font-semibold text-[var(--ink)]" label="Workflow step title" />
                <EditableText contentKey={`page.chapter-publications.workflow.${s.n}.desc`} fallback={s.d} as="div" multiline className="mt-1 text-sm text-[var(--ink-soft)]" label="Workflow step description" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
