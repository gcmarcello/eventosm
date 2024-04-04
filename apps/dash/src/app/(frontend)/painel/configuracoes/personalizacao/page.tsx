import { readOrganizations } from "@/app/api/orgs/service";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import UpdateOrgForm from "../components/UpdateOrgForm";
import GeneralInfoSection from "../components/GeneralInfoSection";
import PersonalizationSection from "../components/PersonalizationSection";

export default async function PersonalizationPage() {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) redirect("/painel");
  const organization = await readOrganizations({ where: { id: activeOrg } });
  if (!organization[0]) redirect("/painel");

  return <PersonalizationSection organization={organization[0]} />;
}
