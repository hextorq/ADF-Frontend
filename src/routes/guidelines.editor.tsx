import { GuidelinesPage } from "@/components/site/GuidelinesPage";
import { BoardApplicationForm } from "@/components/site/BoardApplicationForm";
import { EditableText } from "@/components/cms/EditableText";

export default function Page() {
  return (
    <GuidelinesPage
      cmsKey="page.guidelines.editor"
      eyebrow="Editor Guidelines"
      title="Editor responsibilities and decision workflow"
      lead="Editors uphold scientific integrity, fairness, and the editorial scope of each title."
      sections={[
        { h: "Editorial independence", t: "Editorial decisions are based on academic merit, not commercial or political considerations." },
        { h: "Conflicts of interest", t: "Recuse from handling submissions where you have a real or perceived conflict." },
        { h: "Reviewer selection", t: "Choose two qualified, independent reviewers per manuscript." },
        { h: "Decisions", t: "Communicate decisions promptly with reasoning aligned to reviewer feedback." },
        { h: "Ethics", t: "Investigate suspected misconduct following COPE guidelines." },
        { h: "Confidentiality", t: "Protect author and reviewer identities and unpublished material." },
      ]}
      crumbs={[{ label: "Guidelines" }, { label: "Editor" }]}
      actionCard={{
        eyebrow: "FOR EDITORS",
        title: "Ready to join the Editorial Board?",
        description: "Review the guidelines above and submit your application to become an editor.",
        primaryAction: <BoardApplicationForm boardType="Editorial Board" buttonText="Join the Editorial Board" />,
        secondaryAction: <a href="/contact" className="btn-outline"><EditableText contentKey="page.guidelines.editor.button.secondary" fallback="Contact Us" as="span" label="Button label" /></a>,
      }}
    />
  );
}




