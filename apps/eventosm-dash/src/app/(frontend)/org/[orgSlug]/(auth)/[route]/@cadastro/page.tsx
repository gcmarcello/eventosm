import { readStates } from "@/app/api/geo/service";
import FormContainer from "./components/FormContainer";
import { readOrganizations } from "@/app/api/orgs/service";
import { notFound } from "next/navigation";

export default async function SignupPage({
  params,
}: {
  params: { orgSlug: string };
}) {
  const organization = (
    await readOrganizations({ where: { slug: params.orgSlug } })
  )[0];
  if (!organization) return notFound();
  const states = await readStates();
  return <FormContainer states={states} organization={organization} />;
}
