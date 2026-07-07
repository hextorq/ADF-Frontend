import { PageHeader } from "@/components/site/PageHeader";
import { Mail, MapPin, Youtube, Linkedin, Instagram } from "lucide-react";
import { useState } from "react";

export default function Page() {
  const [done, setDone] = useState(false);
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Editorial enquiries, submissions support, partnership proposals, or programme registration — write to us."
        crumbs={[{ label: "Contact" }]}
      />
      <section className="py-16 bg-white">
        <div className="container-academic grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, k: "Email", v: <a href="mailto:contact@adf.org" className="hover:text-[var(--primary)] hover:underline">contact@adf.org</a> },
              { icon: Youtube, k: "YouTube", v: <a href="https://www.youtube.com/@adf_publisher" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] hover:underline">@adf_publisher</a> },
              { icon: Linkedin, k: "LinkedIn", v: <a href="https://www.linkedin.com/in/academic-development-forum-adf-8a4651418" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] hover:underline">Academic Development Forum</a> },
              { icon: Instagram, k: "Instagram", v: <a href="https://www.instagram.com/adf_publisher" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] hover:underline">@adf_publisher</a> },
              { icon: MapPin, k: "Office", v: "Academic Development Forum, Registered Office" },
            ].map(({ icon: Icon, k, v }) => (
              <div key={k} className="surface-card p-5 flex items-start gap-4">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-[var(--primary)]/8 text-[var(--primary)] shrink-0">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-semibold tracking-wider text-[var(--ink-soft)]">{k}</div>
                  <div className="font-medium text-[var(--ink)]">{v}</div>
                </div>
              </div>
            ))}
          </div>
          <form
            onSubmit={(e) => { e.preventDefault(); setDone(true); }}
            className="lg:col-span-3 surface-card p-6 md:p-8 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" required />
              <Field label="Email" type="email" required />
            </div>
            <Field label="Affiliation" />
            <Field label="Subject" required />
            <label className="block">
              <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">Message</span>
              <textarea required rows={5} className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
            </label>
            {done ? (
              <div className="rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] p-3 text-sm">Thank you — we'll get back to you within 3 working days.</div>
            ) : (
              <button type="submit" className="btn-primary">Send message</button>
            )}
          </form>
        </div>
      </section>
    </>
  );
}

function Field({ label, ...rest }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]">{label}</span>
      <input {...rest} className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
    </label>
  );
}



