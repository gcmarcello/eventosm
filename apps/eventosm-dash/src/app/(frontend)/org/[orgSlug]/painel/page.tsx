import { getEnv } from "@/utils/settings";
import { redirect } from "next/navigation";

export default async function PanelRedirectPage() {
  return redirect(getEnv("NEXT_PUBLIC_SITE_URL") + "/painel");
}
