import { notFound } from "next/navigation";
import { OrgPageContainer } from "../../_shared/components/OrgPageContainer";
import { GalleryContainer } from "../components/GalleryContainer";

export default async function GalleryPage({
  params,
}: {
  params: { orgSlug: string; id: string };
}) {
  const organization = await prisma.organization.findUnique({
    where: { slug: params.orgSlug },
    include: { OrgCustomDomain: true },
  });

  if (!organization) return notFound();

  const gallery = await prisma.gallery.findUnique({
    where: { id: params.id },
    include: { GalleryPhoto: true },
  });

  if (!gallery) return notFound();

  return (
    <>
      <OrgPageContainer
        className="grow bg-slate-200 lg:px-16 lg:pb-8 "
        organization={organization}
      >
        <GalleryContainer organization={organization} gallery={gallery} />
      </OrgPageContainer>
    </>
  );
}
