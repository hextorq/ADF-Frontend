import * as api from "@/lib/api";

export type BoardApplication = {
  fullName: string;
  email: string;
  affiliation: string;
  profileLink?: string;
  boardType: "Editorial Board" | "Reviewer Network";
  message?: string;
};

export async function submitBoardApplication({ data }: { data: BoardApplication }) {
  await api.submitBoardApplication(data);
  return { success: true, message: "Application submitted successfully." };
}
