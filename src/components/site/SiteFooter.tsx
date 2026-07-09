import { Link } from "react-router-dom";
import { Globe2, Mail, Send, Youtube, Linkedin, Instagram } from "lucide-react";
import { EditableImage, EditableText } from "@/components/cms/EditableText";

const COLUMNS = [
  {
    title: "Information for",
    links: [
      { label: "Authors", to: "/guidelines/author" },
      { label: "Reviewers", to: "/guidelines/reviewer" },
      { label: "Editors", to: "/guidelines/editor" },
      { label: "Readers", to: "/journals" },
      { label: "Institutions", to: "/about" },
    ],
  },
  {
    title: "Open Access",
    links: [
      { label: "Open Access Policy", to: "/about" },
      { label: "CC BY Licensing", to: "/guidelines/author" },
      { label: "Article Processing", to: "/journals" },
      { label: "Self-Archiving", to: "/guidelines/author" },
    ],
  },
  {
    title: "Opportunities",
    links: [
      { label: "Call for Papers", to: "/announcements" },
      { label: "Call for Chapters", to: "/chapter-publications" },
      { label: "Editorial Roles", to: "/editorial-board" },
      { label: "Reviewer Panel", to: "/guidelines/reviewer" },
      { label: "Programmes", to: "/academic-programmes" },
    ],
  },
  {
    title: "Help & Information",
    links: [
      { label: "About ADF", to: "/about" },
      { label: "Editorial Board", to: "/editorial-board" },
      { label: "Announcements", to: "/announcements" },
      { label: "Contact Us", to: "/contact" },
      { label: "Submission Guidelines", to: "/guidelines/author" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="footer-gradient relative overflow-hidden text-white/85">
      {/* Animated global network */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute -top-20 -right-20 h-[420px] w-[420px] rounded-full border border-white/10 spin-slow" />
        <div className="absolute top-10 right-10 h-[280px] w-[280px] rounded-full border border-white/10 spin-slow" />
        <div className="absolute -bottom-32 -left-20 h-[400px] w-[400px] rounded-full border border-white/10 spin-slow" />
        <svg className="absolute inset-0 h-full w-full opacity-40" aria-hidden>
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M40 0H0V40" fill="none" stroke="rgba(255,255,255,0.04)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="container-academic relative py-14">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-xl shadow-sm">
                <EditableImage
                  contentKey="site.logo.src"
                  fallbackSrc="/logo.png"
                  alt="ADF Logo" 
                  className="h-10 w-auto shrink-0 object-contain"
                  label="Footer logo"
                />
              </div>
              <div>
                <EditableText contentKey="footer.brand.name" fallback="Academic Development Forum" as="div" className="font-serif text-lg font-semibold text-white" label="Footer brand" />
                <EditableText contentKey="footer.brand.tagline" fallback="Attitude Defines Future" as="div" className="text-xs uppercase tracking-[0.18em] text-white/60" label="Footer tagline" />
              </div>
            </div>
            <EditableText
              contentKey="footer.brand.description"
              fallback="An international publication house for peer-reviewed journals, edited volumes, literary works, and academic development programmes - committed to open access and global research dissemination."
              as="p"
              multiline
              className="mt-5 text-sm leading-relaxed text-white/70"
              label="Footer description"
            />

            <div className="mt-6 surface-card !bg-white/[0.06] !border-white/15 !text-white p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <Send className="h-4 w-4" />
                <EditableText contentKey="footer.newsletter.title" fallback="Keep Up To Date" as="span" label="Newsletter title" />
              </div>
              <EditableText
                contentKey="footer.newsletter.description"
                fallback="Get journal CFPs, programme alerts, and open-access updates."
                as="p"
                multiline
                className="mt-2 text-xs text-white/70"
                label="Newsletter description"
              />
              <form className="mt-4 flex items-center gap-2">
                <input
                  type="email"
                  placeholder="you@institution.edu"
                  className="flex-1 rounded-md bg-white/10 border border-white/20 px-3 py-2 text-sm placeholder:text-white/50 outline-none focus:border-[var(--mint)]"
                />
                <button
                  type="button"
                  className="rounded-md bg-[var(--mint)] px-4 py-2 text-sm font-semibold text-[var(--deep)] hover:bg-white"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8 grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            {COLUMNS.map((col) => (
              <div key={col.title}>
                <EditableText
                  contentKey={`footer.column.${col.title}.title`}
                  fallback={col.title}
                  as="h4"
                  className="text-sm font-semibold uppercase tracking-wider text-white"
                  label="Footer column title"
                />
                <ul className="mt-4 space-y-2.5 text-sm text-white/70">
                  {col.links.map((l) => (
                    <li key={l.label}>
                      <Link to={l.to} className="hover:text-[var(--mint)] transition">
                        <EditableText
                          contentKey={`footer.link.${col.title}.${l.label}`}
                          fallback={l.label}
                          as="span"
                          label="Footer link"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between text-xs text-white/60">
          <div className="flex items-center gap-4">
            <Globe2 className="h-4 w-4" />
            <span>© {new Date().getFullYear()} Academic Development Forum. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-5">
            <a href="mailto:contact@adf.org" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Mail className="h-3.5 w-3.5" /> contact@adf.org
            </a>
            <div className="h-3 w-px bg-white/20 hidden sm:block" />
            <div className="flex items-center gap-4">
              <a href="https://www.youtube.com/@adf_publisher" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#ff0000] transition-colors" aria-label="ADF Publisher YouTube Channel">
                <Youtube className="h-4 w-4" /> 
              </a>
              <a href="https://www.linkedin.com/in/academic-development-forum-adf-8a4651418" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#0077b5] transition-colors" aria-label="ADF LinkedIn Profile">
                <Linkedin className="h-4 w-4" /> 
              </a>
              <a href="https://www.instagram.com/adf_publisher" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 hover:text-[#E1306C] transition-colors" aria-label="ADF Instagram Profile">
                <Instagram className="h-4 w-4" /> 
              </a>
            </div>
            <Link to="/policies" className="hover:text-white"><EditableText contentKey="footer.bottom.policies" fallback="Policies & Ethics" as="span" label="Footer bottom link" /></Link>
            <Link to="/policies" className="hover:text-white"><EditableText contentKey="footer.bottom.openAccess" fallback="Open Access" as="span" label="Footer bottom link" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
