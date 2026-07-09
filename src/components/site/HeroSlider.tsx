import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { EditableText } from "@/components/cms/EditableText";

type Slide = {
  key: string;
  eyebrow: string;
  title: string;
  description: string;
  highlight?: string;
  features: string[];
  cta: string;
  to: string;
};

const SLIDES: Slide[] = [
  {
    key: "1",
    eyebrow: "📖  Call for Chapters",
    title: "Shape the Future of Research",
    description:
      "Contribute your research to our bi-monthly edited volume series — Convergence: Multidisciplinary Perspectives in Contemporary Research.",
    highlight: "Convergence — Multidisciplinary Perspectives in Contemporary Research",
    features: ["ISBN Assigned", "Double-Blind Peer Review", "Open Access"],
    cta: "Submit Your Chapter",
    to: "/chapter-publications",
  },
  {
    key: "2",
    eyebrow: "🔬  Peer-Reviewed Journal",
    title: "Share Your Research with the World",
    description:
      "Publish your original research in our peer-reviewed journal — discoverable, citable, and open to a global audience.",
    features: ["Online ISSN", "Open Access", "CC BY License"],
    cta: "Submit Your Paper",
    to: "/journals",
  },
  {
    key: "3",
    eyebrow: "✍️  Literary Publishing",
    title: "Your Story Deserves to Be Published",
    description:
      "ADF publishes novels, novellas, poetry collections, short stories, and anthologies with full professional support.",
    features: ["Professional Editing", "Cover Design", "ISBN Assignment", "Print & Digital"],
    cta: "Publish Your Book",
    to: "/literary-publications",
  },
  {
    key: "4",
    eyebrow: "🎓  Academic Programmes",
    title: "Nurture Your Academic Mind",
    description:
      "Join FDPs, workshops, and short-term courses on research methodology, academic writing, and publication ethics.",
    features: ["Research Methodology", "Academic Writing", "Publication Ethics"],
    cta: "Explore Programmes",
    to: "/academic-programmes",
  },
  {
    key: "5",
    eyebrow: "🌟  About ADF",
    title: "Attitude Defines Future",
    description:
      "Academic Development Forum is a growing publication house committed to research, literature, and academic excellence.",
    features: ["International Reach", "Open Access First", "Author-Centric"],
    cta: "Know More About ADF",
    to: "/about",
  },
];

export function HeroSlider() {
  const [emblaRef, embla] = useEmblaCarousel({ loop: true });
  const [index, setIndex] = useState(0);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    const onSelect = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", onSelect);
    onSelect();
    const id = setInterval(() => embla.scrollNext(), 7000);
    return () => {
      embla.off("select", onSelect);
      clearInterval(id);
    };
  }, [embla]);

  return (
    <section className="hero-gradient relative overflow-hidden text-white">
      {/* decorative network */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-32 -right-24 h-[520px] w-[520px] rounded-full border border-white/10 spin-slow" />
        <div className="absolute -top-10 right-40 h-[320px] w-[320px] rounded-full border border-white/10 spin-slow" />
        <div className="absolute -bottom-40 -left-20 h-[460px] w-[460px] rounded-full border border-white/10 spin-slow" />
      </div>

      <div className="container-academic relative grid lg:grid-cols-12 gap-8 py-12 lg:py-16">
        <div className="lg:col-span-9 overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {SLIDES.map((s, i) => (
              <div key={i} className="min-w-0 flex-[0_0_100%] pr-6">
                <div className="max-w-3xl">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
                    <EditableText
                      contentKey={`home.hero.slide.${s.key}.eyebrow`}
                      fallback={s.eyebrow}
                      as="span"
                      label="Slide eyebrow"
                    />
                  </div>
                  <EditableText
                    contentKey={`home.hero.slide.${s.key}.title`}
                    fallback={s.title}
                    as="h1"
                    className="mt-6 font-serif text-4xl md:text-6xl font-bold leading-[1.05]"
                    label="Slide Title"
                  />
                  {s.highlight && (
                    <div className="mt-4 text-lg text-[var(--mint)] font-medium">
                      <EditableText
                        contentKey={`home.hero.slide.${s.key}.highlight`}
                        fallback={s.highlight}
                        as="span"
                        label="Slide highlight"
                      />
                    </div>
                  )}
                  <EditableText
                    contentKey={`home.hero.slide.${s.key}.description`}
                    fallback={s.description}
                    as="p"
                    multiline
                    className="mt-5 max-w-2xl text-lg text-white/80 leading-relaxed"
                    label="Slide Subtitle"
                  />
                  <div className="mt-7 flex flex-wrap gap-2">
                    {s.features.map((f) => (
                      <span
                        key={f}
                        className="rounded-full bg-white/10 border border-white/15 px-3 py-1.5 text-xs font-medium"
                      >
                        <EditableText
                          contentKey={`home.hero.slide.${s.key}.feature.${f}`}
                          fallback={f}
                          as="span"
                          label="Slide feature"
                        />
                      </span>
                    ))}
                  </div>
                  <div className="mt-8 flex flex-wrap items-center gap-3">
                    <Link
                      to={s.to}
                      className="inline-flex items-center gap-2 rounded-md bg-[var(--mint)] px-5 py-3 text-sm font-semibold text-[var(--deep)] hover:bg-white transition"
                    >
                      <EditableText
                        contentKey={`home.hero.slide.${s.key}.cta`}
                        fallback={s.cta}
                        as="span"
                        label="Slide CTA"
                      />
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      to="/about"
                      className="inline-flex items-center gap-2 rounded-md border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Learn more
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar quick facts */}
        <aside className="lg:col-span-3 self-end space-y-3">
          {[
            { k: "ISSN", v: "Online" },
            { k: "ISBN", v: "Assigned" },
            { k: "Peer Review", v: "Double-Blind" },
            { k: "Access", v: "Open · CC BY" },
          ].map((it) => (
            <div
              key={it.k}
              className="rounded-lg border border-white/15 bg-white/[0.06] backdrop-blur px-4 py-3 flex items-center justify-between"
            >
              <EditableText contentKey={`home.hero.fact.${it.k}.label`} fallback={it.k} as="span" className="text-xs uppercase tracking-wider text-white/60" label="Hero fact label" />
              <EditableText contentKey={`home.hero.fact.${it.k}.value`} fallback={it.v} as="span" className="text-sm font-semibold" label="Hero fact value" />
            </div>
          ))}
        </aside>
      </div>

      {/* Controls */}
      <div className="container-academic relative pb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-10 bg-[var(--mint)]" : "w-5 bg-white/30 hover:bg-white/60"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            className="h-10 w-10 grid place-items-center rounded-full border border-white/20 hover:bg-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={next}
            className="h-10 w-10 grid place-items-center rounded-full border border-white/20 hover:bg-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
