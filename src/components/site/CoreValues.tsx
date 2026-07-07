import { BookCheck, HeartHandshake, Lightbulb, ShieldCheck, Sparkles, Users } from "lucide-react";

const VALUES = [
  { icon: ShieldCheck, title: "Academic Integrity", desc: "Rigorous peer review, ethical publishing, transparent processes." },
  { icon: BookCheck, title: "Quality", desc: "Editorial care from acquisition through production and distribution." },
  { icon: HeartHandshake, title: "Accessibility", desc: "Open access by default — knowledge available to every reader." },
  { icon: Lightbulb, title: "Innovation", desc: "Modern publishing tools, formats, and discovery." },
  { icon: Users, title: "Inclusivity", desc: "A welcoming home for scholars from every region and tradition." },
  { icon: Sparkles, title: "Author First", desc: "Authors retain copyright; we exist to amplify their work." },
];

export function CoreValues() {
  return (
    <section className="py-20 bg-white">
      <div className="container-academic">
        <div className="text-center max-w-2xl mx-auto">
          <div className="eyebrow justify-center">Core Values</div>
          <h2 className="mt-2 text-3xl md:text-4xl font-bold text-[var(--ink)]">
            Principles that shape every publication
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {VALUES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="surface-card p-6 relative overflow-hidden"
            >
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--mint)]/15 blur-2xl" />
              <div className="relative">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--deep)] text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-serif text-xl font-semibold text-[var(--ink)]">{title}</h3>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
