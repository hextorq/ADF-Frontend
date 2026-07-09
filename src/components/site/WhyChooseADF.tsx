import { Award, BookOpen, GraduationCap, Globe2, HandCoins, Layers, Pencil, Users } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";

const ITEMS = [
  { icon: Award, title: "DOI & ISBN Support", desc: "Every publication receives standard identifiers for discoverability and citation." },
  { icon: BookOpen, title: "Open Access Research", desc: "Default CC BY licensing — readers worldwide, authors retain copyright." },
  { icon: Layers, title: "Multidisciplinary Scope", desc: "Sciences, humanities, education, management, and literature under one roof." },
  { icon: Pencil, title: "Literary & Academic", desc: "Peer-reviewed scholarship alongside professionally edited literary imprints." },
  { icon: Users, title: "Editorial Assistance", desc: "Hands-on support from acquisition through copyediting and production." },
  { icon: HandCoins, title: "Affordable Publishing", desc: "Transparent, accessible APCs and chapter fees — no hidden barriers." },
  { icon: GraduationCap, title: "Development Programmes", desc: "FDPs, workshops, and short courses for early-career researchers." },
  { icon: Globe2, title: "Global Community", desc: "A growing network of authors, reviewers, and editors across regions." },
];

export function WhyChooseADF() {
  return (
    <section className="py-20 bg-[var(--secondary)]">
      <div className="container-academic">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <EditableText contentKey="home.why.eyebrow" fallback="Why Choose ADF" as="div" className="eyebrow" label="Section eyebrow" />
            <EditableText contentKey="home.why.title" fallback="Built around authors, readers, and rigor" as="h2" className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]" label="Section title" />
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ITEMS.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group surface-card p-6 transition hover:-translate-y-0.5 hover:border-[var(--primary)]"
            >
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--primary)]/8 text-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-white transition">
                <Icon className="h-5 w-5" />
              </div>
              <EditableText contentKey={`home.why.${title}.title`} fallback={title} as="h3" className="mt-4 font-serif text-lg font-semibold text-[var(--ink)]" label="Card title" />
              <EditableText contentKey={`home.why.${title}.desc`} fallback={desc} as="p" multiline className="mt-1.5 text-sm text-[var(--ink-soft)] leading-relaxed" label="Card description" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
