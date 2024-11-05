import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { GalleryForm } from "../shared/GalleryForm";
import { GalleryContainer } from "../shared/GalleryContainer";
import prisma from "prisma/prisma";

export default async function GalleriesPage() {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) return notFound();

  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
  });
  if (!organization) return notFound();
  return (
    <>
      <GalleryContainer>
        <GalleryForm organization={organization} />
      </GalleryContainer>
    </>
  );
}
