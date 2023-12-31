import { createField } from "../_shared/components/Form/Form";

export default async function CompanyHome({
  params,
}: {
  params: { company_slug: string };
}) {
  return params.company_slug;
}
