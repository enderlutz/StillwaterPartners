import { redirect } from "next/navigation";

// The Numbers surface is the default landing for any client.
export default function ClientRoot({
  params,
}: {
  params: { clientId: string };
}) {
  redirect(`/clients/${params.clientId}/numbers`);
}
