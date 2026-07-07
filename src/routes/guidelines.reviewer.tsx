import { GuidelinesPage } from "@/components/site/GuidelinesPage";
import { BoardApplicationForm } from "@/components/site/BoardApplicationForm";

export default function Page() {
  return (
    <GuidelinesPage
      eyebrow="Reviewer Guidelines"
      title="Writing a fair, useful, double-blind review"
      lead="Reviewers protect the integrity of the record and help authors improve their work."
      sections={[
        { h: "Confidentiality", t: "Treat all manuscripts as confidential. Do not share, cite, or use unpublished material." },
        { h: "Conflicts of interest", t: "Decline if you have a personal, professional, or financial conflict." },
        { h: "Timeliness", t: "Submit reviews within 21 days. Communicate early if you need an extension." },
        { h: "Evaluation criteria", t: "Originality, methods, evidence, clarity, and contribution to the field." },
        { h: "Tone", t: "Be specific, constructive, and respectful. Critique work, not the author." },
        { h: "Recommendation", t: "Accept, Minor Revisions, Major Revisions, or Reject — with clear justification." },
      ]}
      crumbs={[{ label: "Guidelines" }, { label: "Reviewer" }]}
      actionCard={{
        eyebrow: "FOR REVIEWERS",
        title: "Ready to join the Reviewer Network?",
        description: "Review the guidelines above and submit your application to become a reviewer.",
        primaryAction: <BoardApplicationForm boardType="Reviewer Network" buttonText="Join the Reviewer Network" />,
        secondaryAction: <a href="/contact" className="btn-outline">Contact Us</a>,
      }}
    />
  );
}




