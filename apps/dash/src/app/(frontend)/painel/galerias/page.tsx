import { cookies } from "next/headers";
import { GalleryForm } from "./shared/GalleryForm";
import { notFound } from "next/navigation";
import { GalleryTable } from "./components/GalleryTable";

export default async function GalleriesPage() {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) return notFound();

  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
  });
  if (!organization) return notFound();

  const galleries = await prisma.gallery.findMany({
    where: { organizationId: activeOrg },
    include: { GalleryPhoto: true, Event: true, EventGroup: true },
  });

  return (
    <>
      <GalleryTable galleries={galleries} />
    </>
  );
}
