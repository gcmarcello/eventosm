import { redirect } from "next/navigation";

export default async function PanelPage() {
  return redirect("/painel/eventos");
}
