import { readOrganizations } from "@/app/api/orgs/service";
import UpdateOrgForm from "./components/UpdateOrgForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrgSettingsPage() {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) redirect("/painel");
  const organization = await readOrganizations({ where: { id: activeOrg } });
  if (!organization[0]) redirect("/painel");
  return <UpdateOrgForm organization={organization[0]} />;
}
