import { getClientEnv } from "@/app/(frontend)/env";
import { redirect } from "next/navigation";

export default async function PanelRedirectPage() {
  return redirect(getClientEnv("NEXT_PUBLIC_SITE_URL") + "/painel");
}
