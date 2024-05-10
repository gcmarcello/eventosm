import { notFound } from "next/navigation";
import { OrgPageContainer } from "../../_shared/components/OrgPageContainer";
import EventContainer from "../../eventos/[id]/components/EventContainer";

export default async function PagamentosPage({
  params,
}: {
  params: { orgSlug: string; id: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    include: { OrgCustomDomain: true },
  });

  if (!organization) return notFound();

  return (
    <>
      <OrgPageContainer className="bg-slate-200" organization={organization}>
        xd
      </OrgPageContainer>
    </>
  );
}
