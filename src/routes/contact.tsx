import { PageHeader } from "@/components/site/PageHeader";
import { Mail, MapPin, Youtube, Linkedin, Instagram } from "lucide-react";
import { useState } from "react";
import { EditableText } from "@/components/cms/EditableText";
import { submitContact } from "@/lib/api";

export default function Page() {
  const [done, setDone] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      await submitContact({
        fullName: String(form.get("fullName") ?? ""),
        email: String(form.get("email") ?? ""),
        affiliation: String(form.get("affiliation") ?? ""),
        subject: String(form.get("subject") ?? ""),
        message: String(form.get("message") ?? ""),
      });
      setDone(true);
      e.currentTarget.reset();
    } catch {
      setError("Could not send your message. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <>
      <PageHeader
        cmsKey="page.contact"
        eyebrow="Contact"
        title="We'd love to hear from you"
        description="Editorial enquiries, submissions support, partnership proposals, or programme registration — write to us."
        crumbs={[{ label: "Contact" }]}
      />
      <section className="py-16 bg-white">
        <div className="container-academic grid lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, k: "Email", v: <a href="mailto:contact@adf.org" className="hover:text-[var(--primary)] hover:underline"><EditableText contentKey="page.contact.email.label" fallback="contact@adf.org" as="span" label="Email text" /></a> },
              { icon: Youtube, k: "YouTube", v: <a href="https://www.youtube.com/@adf_publisher" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] hover:underline"><EditableText contentKey="page.contact.youtube.label" fallback="@adf_publisher" as="span" label="YouTube text" /></a> },
              { icon: Linkedin, k: "LinkedIn", v: <a href="https://www.linkedin.com/in/academic-development-forum-adf-8a4651418" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] hover:underline"><EditableText contentKey="page.contact.linkedin.label" fallback="Academic Development Forum" as="span" label="LinkedIn text" /></a> },
              { icon: Instagram, k: "Instagram", v: <a href="https://www.instagram.com/adf_publisher" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--primary)] hover:underline"><EditableText contentKey="page.contact.instagram.label" fallback="@adf_publisher" as="span" label="Instagram text" /></a> },
              { icon: MapPin, k: "Office", v: <EditableText contentKey="page.contact.office.label" fallback="Academic Development Forum, Registered Office" as="span" label="Office text" /> },
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
            onSubmit={handleSubmit}
            className="lg:col-span-3 surface-card p-6 md:p-8 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Full name" name="fullName" required />
              <Field label="Email" name="email" type="email" required />
            </div>
            <Field label="Affiliation" name="affiliation" />
            <Field label="Subject" name="subject" required />
            <label className="block">
              <EditableText contentKey="page.contact.form.message" fallback="Message" as="span" className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]" label="Form label" />
              <textarea name="message" required rows={5} className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
            </label>
            {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
            {done ? (
              <EditableText contentKey="page.contact.form.success" fallback="Thank you - we'll get back to you within 3 working days." as="div" className="rounded-lg bg-[var(--accent)]/10 text-[var(--accent)] p-3 text-sm" label="Success message" />
            ) : (
              <button type="submit" disabled={submitting} className="btn-primary"><EditableText contentKey="page.contact.form.submit" fallback={submitting ? "Sending..." : "Send message"} as="span" label="Submit label" /></button>
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
      <EditableText contentKey={`page.contact.form.${label}`} fallback={label} as="span" className="block text-xs font-semibold uppercase tracking-wider text-[var(--ink-soft)]" label="Form label" />
      <input {...rest} className="mt-1 w-full rounded-md border border-border bg-white px-3 py-2 text-sm outline-none focus:border-[var(--primary)]" />
    </label>
  );
}



