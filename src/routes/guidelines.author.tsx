import { GuidelinesPage } from "@/components/site/GuidelinesPage";
import { EditableText } from "@/components/cms/EditableText";

export default function Page() {
  return (
    <GuidelinesPage
      cmsKey="page.guidelines.author"
      eyebrow="Author Guidelines"
      title="Preparing and submitting your manuscript"
      lead="A clear, structured submission helps reviewers focus on your contribution."
      sections={[
        { h: "Scope & fit", t: "Confirm your work falls within the journal's or volume's stated scope. Read recent issues to gauge style." },
        { h: "Manuscript structure", t: "Title page, abstract (150–250 words), 4–6 keywords, main text, references (APA 7), tables, and figures." },
        { h: "Ethics & originality", t: "All work must be original. Disclose conflicts of interest, funding, and prior dissemination." },
        { h: "Plagiarism", t: "Submissions are screened. Similarity index should generally be under 15%, excluding references." },
        { h: "AI tools", t: "Disclose any use of generative AI in research, writing, or analysis." },
        { h: "Copyright & license", t: "Authors retain copyright. Articles are published under CC BY 4.0 unless otherwise agreed." },
        { h: "Submission", t: "Upload your manuscript via the editorial portal with cover letter and signed author declaration." },
      ]}
      crumbs={[{ label: "Guidelines" }, { label: "Author" }]}
      actionCard={{
        eyebrow: "FOR AUTHORS",
        title: "Ready to submit your manuscript?",
        description: "Review the author guidelines and submission checklist before you upload.",
        primaryAction: <a href="/guidelines/author" className="btn-primary font-semibold py-2.5 px-5"><EditableText contentKey="page.guidelines.author.button.primary" fallback="Author Guidelines" as="span" label="Button label" /></a>,
        secondaryAction: <a href="/contact" className="btn-outline font-semibold py-2.5 px-5"><EditableText contentKey="page.guidelines.author.button.secondary" fallback="Contact Editor" as="span" label="Button label" /></a>,
      }}
    />
  );
}




