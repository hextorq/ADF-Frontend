import { useEffect, useState, useRef } from "react";
import { BookOpen, FileText, Bookmark, GraduationCap, Users, Globe2, PenTool, CheckCircle, Eye } from "lucide-react";

const stats = [
  { label: "Research Journals", value: 3, plus: true, icon: BookOpen },
  { label: "Published Articles", value: 100, plus: true, icon: FileText, dynamic: true },
  { label: "Book Chapters", value: 50, plus: true, icon: Bookmark },
  { label: "Academic Programmes", value: 25, plus: true, icon: GraduationCap },
  { label: "Editorial Experts", value: 30, plus: true, icon: Users },
];

function Counter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let start = 0;
    let observer: IntersectionObserver;
    
    if (ref.current) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
              start += increment;
              if (start > target) {
                setCount(target);
                clearInterval(timer);
              } else {
                setCount(Math.ceil(start));
              }
            }, 16);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      observer.observe(ref.current);
    }
    return () => observer?.disconnect();
  }, [target, duration]);

  return <span ref={ref}>{count.toLocaleString()}</span>;
}

export function Statistics() {
  return (
    <section className="py-20 bg-gradient-to-br from-[var(--secondary)] to-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none mix-blend-multiply"></div>
      <div className="container-academic relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] text-xs font-semibold tracking-wide uppercase mb-4">
            <Globe2 className="h-4 w-4" /> Global Impact
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--ink)] mb-4 tracking-tight font-serif">
            Our Growing Community
          </h2>
          <p className="text-[var(--ink-soft)] max-w-2xl mx-auto text-lg leading-relaxed">
            Academic Development Forum is rapidly expanding its reach, bringing together scholars, researchers, and readers worldwide.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="group relative surface-card p-6 flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[var(--primary)]/10 border border-black/5"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[var(--primary)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                <div className="h-12 w-12 rounded-full bg-[var(--primary)]/10 text-[var(--primary)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="text-3xl font-bold text-[var(--ink)] tracking-tight">
                  {stat.dynamic ? (
                    <Counter target={stat.value} duration={2500} />
                  ) : (
                    stat.value.toLocaleString()
                  )}
                  {stat.plus && <span className="text-[var(--primary)] ml-0.5">+</span>}
                </div>
                <div className="text-sm text-[var(--ink-soft)] mt-2 font-medium">
                  {stat.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

