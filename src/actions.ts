export type BoardApplication = {
  fullName: string;
  email: string;
  affiliation: string;
  profileLink?: string;
  boardType: "Editorial Board" | "Reviewer Network";
  message?: string;
};

// This preserves the original site's visible behavior. Connect this function
// to an API, PHP endpoint, or form service before collecting real submissions.
export async function submitBoardApplication({ data }: { data: BoardApplication }) {
  console.info("Board application submitted", data);
  return { success: true, message: "Application submitted successfully." };
}
