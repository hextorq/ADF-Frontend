import { BookOpen, Compass, Feather, GraduationCap, Globe2, Sparkles } from "lucide-react";

const ITEMS = [
  { year: "2025", title: "ADF Founded", desc: "Academic Development Forum established as an international publication initiative.", icon: Sparkles },
  { year: "2025", title: "International Journal of English for Academic Excellence", desc: "Flagship peer-reviewed journal launched with open-access mandate.", icon: BookOpen },
  { year: "2026", title: "Convergence Book Chapter Series", desc: "Bi-monthly edited volumes covering multidisciplinary research.", icon: Compass },
  { year: "2026", title: "Literary Publishing Division", desc: "Novels, novellas, poetry, short stories, and anthologies imprint launched.", icon: Feather },
  { year: "2026", title: "Academic Development Programmes", desc: "FDPs, workshops, and short-term courses for researchers and educators.", icon: GraduationCap },
  { year: "2027+", title: "International Expansion", desc: "Conferences, partnerships, and a global editorial network.", icon: Globe2 },
];

export function JourneyTimeline() {
  return (
    <section className="py-20 bg-white">
      <div className="container-academic">
        <div className="max-w-2xl">
          <div className="eyebrow">Our Journey</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]">
            A new publishing house, built with intent
          </h2>
          <p className="mt-3 text-[var(--ink-soft)]">
            From foundation to a connected global network — milestones across research, literature, and academic development.
          </p>
        </div>

        <div className="relative mt-12">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-[var(--primary)]/30 to-transparent" />
          <div className="space-y-10">
            {ITEMS.map((it, i) => {
              const Icon = it.icon;
              const right = i % 2 === 1;
              return (
                <div
                  key={i}
                  className={`relative grid md:grid-cols-2 gap-6 items-center`}
                >
                  <div className={`pl-12 md:pl-0 ${right ? "md:order-2 md:pl-12" : "md:text-right md:pr-12"}`}>
                    <div className="text-xs font-semibold tracking-widest text-[var(--primary)]">{it.year}</div>
                    <h3 className="mt-1 font-serif text-xl font-semibold text-[var(--ink)]">{it.title}</h3>
                    <p className="mt-2 text-sm text-[var(--ink-soft)] leading-relaxed">{it.desc}</p>
                  </div>
                  <div className={`absolute left-4 md:left-1/2 -translate-x-1/2 grid h-9 w-9 place-items-center rounded-full bg-white border-2 border-[var(--primary)] text-[var(--primary)] shadow-sm`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className={right ? "md:order-1" : ""} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
