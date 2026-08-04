import { GuidelinesPage } from "@/components/site/GuidelinesPage";
import { EditableText } from "@/components/cms/EditableText";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

const requirements = [
  { label: "File format", value: "Microsoft Word (.doc / .docx)" },
  { label: "Word limit", value: "3,000 – 8,000 words (including references)" },
  { label: "Font", value: "Times New Roman, 12pt" },
  { label: "Line spacing", value: "Double-spaced throughout" },
  { label: "Margins", value: "1 inch (2.54 cm) on all sides" },
  { label: "Abstract", value: "150 – 250 words, structured" },
  { label: "Keywords", value: "5 – 8 keywords" },
  { label: "Referencing", value: "APA 7th Edition" },
  { label: "Figures & tables", value: "Embedded in text, numbered sequentially, with captions" },
  { label: "Language", value: "English (British or American, consistent throughout)" },
  { label: "Anonymisation", value: "Author names and affiliations must not appear in the manuscript body (double-blind review)" },
];

export default function Page() {
  return (
    <GuidelinesPage
      cmsKey="page.guidelines.author"
      eyebrow="Author Guidelines"
      title="Preparing and submitting your manuscript"
      lead="Please read carefully before preparing your manuscript to ensure a smooth review process."
      sections={[
        {
          h: "Manuscript Requirements",
          content: (
            <div className="rounded-md border mt-2 overflow-hidden bg-white">
              <Table>
                <TableBody>
                  {requirements.map((req, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-semibold align-top w-1/3 bg-slate-50 text-[var(--ink)]">
                        {req.label}
                      </TableCell>
                      <TableCell className="text-[var(--ink-soft)]">
                        {req.value}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )
        },
        {
          h: "Manuscript Structure",
          content: (
            <div className="grid md:grid-cols-2 gap-6 mt-2">
              <div className="surface-card p-6 bg-slate-50 border-transparent">
                <h3 className="font-serif font-bold text-[var(--ink)] text-lg mb-3">
                  Title Page (separate file)
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--ink-soft)] marker:text-[var(--primary)]">
                  <li>Full title of the manuscript</li>
                  <li>All authors' full names</li>
                  <li>Institutional affiliations</li>
                  <li>Corresponding author email</li>
                  <li>ORCID iDs (if available)</li>
                  <li>Funding acknowledgement</li>
                  <li>Conflict of interest declaration</li>
                </ul>
              </div>
              <div className="surface-card p-6 bg-slate-50 border-transparent">
                <h3 className="font-serif font-bold text-[var(--ink)] text-lg mb-3">
                  Main Manuscript (anonymised)
                </h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-[var(--ink-soft)] marker:text-[var(--primary)]">
                  <li>Title (no author details)</li>
                  <li>Abstract (150–250 words)</li>
                  <li>Keywords (5–8)</li>
                  <li>Introduction</li>
                  <li>Literature Review</li>
                  <li>Methodology</li>
                  <li>Results & Discussion</li>
                  <li>Conclusion</li>
                  <li>References (APA 7th)</li>
                </ul>
              </div>
            </div>
          )
        },
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
