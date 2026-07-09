import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { JourneyTimeline } from "@/components/site/JourneyTimeline";
import { CoreValues } from "@/components/site/CoreValues";
import { BookOpen, Compass, Eye, Quote, Rocket, Target } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";

export default function About() {
  return (
    <>
      <PageHeader
        cmsKey="page.about"
        eyebrow="About ADF"
        title="A new academic publishing house — built on integrity and access"
        description="Academic Development Forum brings together peer-reviewed research, literary works, and academic development under one open, author-first home."
        crumbs={[{ label: "About Us" }]}
      />

      <Section>
        <SectionHead icon={BookOpen} eyebrow="Our Story" title="Founded to serve scholars and storytellers" />
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="surface-card p-6 lg:col-span-2">
            <EditableText contentKey="page.about.nature.title" fallback="Nature of Organization" as="h3" className="text-xl font-bold text-[var(--ink)] mb-4 font-serif" label="About section title" />
            <EditableText
              contentKey="page.about.nature.paragraph1"
              fallback="Academic Development Forum (ADF) is an independent academic publishing organization dedicated to disseminating peer-reviewed research, edited volumes, literary publications, and academic development programmes through transparent, ethical, and open-access publishing practices."
              as="p"
              multiline
              className="text-[var(--ink-soft)] leading-relaxed"
              label="About paragraph"
            />
            <EditableText
              contentKey="page.about.nature.paragraph2"
              fallback="Our editorial workflow is transparent, our licensing defaults to open access, and our long-term commitment is to a globally distributed scholarly community."
              as="p"
              multiline
              className="mt-4 text-[var(--ink-soft)] leading-relaxed"
              label="About paragraph"
            />
          </div>
          <div className="surface-card p-6 bg-[var(--primary)] text-white border-transparent">
            <Quote className="h-7 w-7 text-[var(--mint)]" />
            <EditableText
              contentKey="page.about.founder.quote"
              fallback='"ADF was conceived as a forum - where research, literature, and learning sit together as equals. Our promise to authors is simple: rigor, respect, and reach."'
              as="p"
              multiline
              className="mt-3 font-serif text-lg leading-snug"
              label="Founder quote"
            />
            <div className="mt-5 text-sm">
              <EditableText contentKey="page.about.founder.role" fallback="Founder & Publishing Director" as="div" className="font-semibold" label="Founder role" />
              <EditableText contentKey="page.about.founder.name" fallback="Dr. Attrait Dovin Fedrick" as="div" className="text-white/70" label="Founder name" />
            </div>
          </div>
        </div>

        <div className="mt-8 surface-card p-6">
          <EditableText contentKey="page.about.legal.title" fallback="Legal Identity" as="h3" className="text-xl font-bold text-[var(--ink)] mb-6 font-serif" label="Legal identity title" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            {[
              ["Organizational Name", "Academic Development Forum (ADF)"],
              ["Legal Status", "Registered Academic Publishing and Research Development Organization"],
              ["Registration Number", "To be updated after official registration"],
              ["Country of Registration", "India"],
              ["Registered Office", "2/2 A West Street, South Amuthunnakudi, Sathankulam (post), Thoothukudi, Tamil Nadu - 628 704, India."],
              ["Year Established", "2025"],
            ].map(([label, value]) => (
              <div key={label}>
                <EditableText contentKey={`page.about.legal.${label}.label`} fallback={label} as="div" className="text-sm font-semibold text-[var(--ink)]" label="Legal label" />
                <EditableText contentKey={`page.about.legal.${label}.value`} fallback={value} as="div" multiline className="text-[var(--ink-soft)] mt-1" label="Legal value" />
              </div>
            ))}
          </div>
        </div>
      </Section>

      <JourneyTimeline />

      <Section bg>
        <div className="grid lg:grid-cols-3 gap-6">
          <Pillar icon={Eye} title="Vision">
            To be a globally trusted publication house bridging research, literature,
            and academic development through open knowledge.
          </Pillar>
          <Pillar icon={Target} title="Mission">
            Publish rigorously, support authors fully, and make knowledge accessible
            to every reader without paywalls or barriers.
          </Pillar>
          <Pillar icon={Compass} title="Open Access Policy">
            ADF defaults to CC BY 4.0 licensing. Authors retain copyright; readers
            gain unrestricted access to all peer-reviewed content.
          </Pillar>
        </div>
      </Section>

      <CoreValues />

      <Section>
        <SectionHead icon={Rocket} eyebrow="Future Roadmap" title="Where we are heading" />
        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[
            { y: "2026", t: "Two new journals", d: "Education and Management." },
            { y: "2027", t: "International conferences", d: "Annual ADF symposium." },
            { y: "2028", t: "Reviewer academy", d: "Structured reviewer training." },
            { y: "2029", t: "Global partnerships", d: "Institutional MoUs and indexing." },
          ].map((it) => (
            <div key={it.t} className="surface-card p-5">
              <EditableText contentKey={`page.about.roadmap.${it.y}.year`} fallback={it.y} as="div" className="text-xs font-semibold tracking-widest text-[var(--primary)]" label="Roadmap year" />
              <EditableText contentKey={`page.about.roadmap.${it.y}.title`} fallback={it.t} as="div" className="mt-1 font-serif text-lg font-semibold text-[var(--ink)]" label="Roadmap title" />
              <EditableText contentKey={`page.about.roadmap.${it.y}.desc`} fallback={it.d} as="div" multiline className="mt-1 text-sm text-[var(--ink-soft)]" label="Roadmap description" />
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/journals" className="btn-primary"><EditableText contentKey="page.about.cta.journals" fallback="Explore our journals" as="span" label="CTA label" /></Link>
          <Link to="/contact" className="btn-outline"><EditableText contentKey="page.about.cta.contact" fallback="Partner with ADF" as="span" label="CTA label" /></Link>
        </div>
      </Section>
    </>
  );
}

function Section({ children, bg }: { children: React.ReactNode; bg?: boolean }) {
  return (
    <section className={`py-16 ${bg ? "bg-[var(--secondary)]" : "bg-white"}`}>
      <div className="container-academic">{children}</div>
    </section>
  );
}

function SectionHead({ icon: Icon, eyebrow, title }: { icon: any; eyebrow: string; title: string }) {
  return (
    <div>
      <div className="eyebrow"><Icon className="h-3.5 w-3.5" /> <EditableText contentKey={`page.about.section.${title}.eyebrow`} fallback={eyebrow} as="span" label="Section eyebrow" /></div>
      <EditableText contentKey={`page.about.section.${title}.title`} fallback={title} as="h2" className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]" label="Section title" />
    </div>
  );
}

function Pillar({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--primary)]/8 text-[var(--primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <EditableText contentKey={`page.about.pillar.${title}.title`} fallback={title} as="h3" className="mt-4 font-serif text-xl font-semibold text-[var(--ink)]" label="Pillar title" />
      <EditableText contentKey={`page.about.pillar.${title}.text`} fallback={String(children)} as="p" multiline className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed" label="Pillar text" />
    </div>
  );
}



