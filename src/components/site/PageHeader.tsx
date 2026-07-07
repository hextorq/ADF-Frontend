import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs = [],
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: { label: string; to?: string }[];
}) {
  return (
    <section className="hero-gradient text-white relative overflow-hidden">
      <div className="pointer-events-none absolute -top-32 -right-20 h-[420px] w-[420px] rounded-full border border-white/10 spin-slow opacity-30" />
      <div className="container-academic relative py-14 md:py-20">
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-1 text-xs text-white/70">
            <Link to="/" className="hover:text-white">Home</Link>
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {c.to ? <Link to={c.to} className="hover:text-white">{c.label}</Link> : <span>{c.label}</span>}
              </span>
            ))}
          </nav>
        )}
        {eyebrow && (
          <div className="mt-3 inline-flex items-center rounded-full bg-white/10 border border-white/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-wider">
            {eyebrow}
          </div>
        )}
        <h1 className="mt-4 font-serif text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 text-lg text-white/80 max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
    </section>
  );
}
