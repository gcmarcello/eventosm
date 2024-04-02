import { readOrganizations } from "@/app/api/orgs/service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UpdateOrgForm from "../components/UpdateOrgForm";
import GeneralInfoSection from "../components/GeneralInfoSection";

export default async function GeneralSettingsPage() {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) redirect("/painel");
  const organization = await readOrganizations({ where: { id: activeOrg } });
  if (!organization[0]) redirect("/painel");

  return <GeneralInfoSection organization={organization[0]} />;
}
