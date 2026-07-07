import { PageHeader } from "@/components/site/PageHeader";
import { AnnouncementHub } from "@/components/site/AnnouncementHub";

export default function Page() {
  return (
    <>
      <PageHeader
        eyebrow="Announcements"
        title="Latest from the Academic Development Forum"
        description="Calls for papers, calls for chapters, programme schedules, and editorial openings."
        crumbs={[{ label: "Announcements" }]}
      />
      <AnnouncementHub />
    </>
  );
}




