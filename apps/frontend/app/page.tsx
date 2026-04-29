import { redirect } from "next/navigation";
import { getCurrentProfile } from "@/lib/db";

// Root: team members go to the Brain (admin firm zone). Client users go to
// their own client's Numbers (default landing).
export default async function Home() {
  const profile = await getCurrentProfile();
  if (profile?.role === "client" && profile.client_id) {
    redirect(`/clients/${profile.client_id}/numbers`);
  }
  redirect("/brain");
}
