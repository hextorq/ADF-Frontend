import { Link } from "react-router-dom";
import { PageHeader } from "@/components/site/PageHeader";
import { JourneyTimeline } from "@/components/site/JourneyTimeline";
import { CoreValues } from "@/components/site/CoreValues";
import { BookOpen, Compass, Eye, Quote, Rocket, Target } from "lucide-react";

export default function About() {
  return (
    <>
      <PageHeader
        eyebrow="About ADF"
        title="A new academic publishing house — built on integrity and access"
        description="Academic Development Forum brings together peer-reviewed research, literary works, and academic development under one open, author-first home."
        crumbs={[{ label: "About Us" }]}
      />

      <Section>
        <SectionHead icon={BookOpen} eyebrow="Our Story" title="Founded to serve scholars and storytellers" />
        <div className="grid lg:grid-cols-3 gap-6 mt-8">
          <div className="surface-card p-6 lg:col-span-2">
            <h3 className="text-xl font-bold text-[var(--ink)] mb-4 font-serif">Nature of Organization</h3>
            <p className="text-[var(--ink-soft)] leading-relaxed">
              Academic Development Forum (ADF) is an independent academic publishing organization dedicated to disseminating peer-reviewed research, edited volumes, literary publications, and academic development programmes through transparent, ethical, and open-access publishing practices.
            </p>
            <p className="mt-4 text-[var(--ink-soft)] leading-relaxed">
              Our editorial workflow is transparent, our licensing defaults to open access,
              and our long-term commitment is to a globally distributed scholarly community.
            </p>
          </div>
          <div className="surface-card p-6 bg-[var(--primary)] text-white border-transparent">
            <Quote className="h-7 w-7 text-[var(--mint)]" />
            <p className="mt-3 font-serif text-lg leading-snug">
              "ADF was conceived as a forum — where research, literature, and learning sit
              together as equals. Our promise to authors is simple: rigor, respect, and reach."
            </p>
            <div className="mt-5 text-sm">
              <div className="font-semibold">Founder & Publishing Director</div>
              <div className="text-white/70">Dr. Attrait Dovin Fedrick</div>
            </div>
          </div>
        </div>

        <div className="mt-8 surface-card p-6">
          <h3 className="text-xl font-bold text-[var(--ink)] mb-6 font-serif">Legal Identity</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-y-6 gap-x-8">
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Organizational Name</div>
              <div className="text-[var(--ink-soft)] mt-1">Academic Development Forum (ADF)</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Legal Status</div>
              <div className="text-[var(--ink-soft)] mt-1">Registered Academic Publishing and Research Development Organization</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Registration Number</div>
              <div className="text-[var(--ink-soft)] mt-1">To be updated after official registration</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Country of Registration</div>
              <div className="text-[var(--ink-soft)] mt-1">India</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Registered Office</div>
              <div className="text-[var(--ink-soft)] mt-1">2/2 A West Street, South Amuthunnakudi, Sathankulam (post), Thoothukudi, Tamil Nadu – 628 704, India.</div>
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--ink)]">Year Established</div>
              <div className="text-[var(--ink-soft)] mt-1">2025</div>
            </div>
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
              <div className="text-xs font-semibold tracking-widest text-[var(--primary)]">{it.y}</div>
              <div className="mt-1 font-serif text-lg font-semibold text-[var(--ink)]">{it.t}</div>
              <div className="mt-1 text-sm text-[var(--ink-soft)]">{it.d}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link to="/journals" className="btn-primary">Explore our journals</Link>
          <Link to="/contact" className="btn-outline">Partner with ADF</Link>
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
      <div className="eyebrow"><Icon className="h-3.5 w-3.5" /> {eyebrow}</div>
      <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]">{title}</h2>
    </div>
  );
}

function Pillar({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="surface-card p-6">
      <div className="grid h-11 w-11 place-items-center rounded-lg bg-[var(--primary)]/8 text-[var(--primary)]">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-serif text-xl font-semibold text-[var(--ink)]">{title}</h3>
      <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">{children}</p>
    </div>
  );
}



