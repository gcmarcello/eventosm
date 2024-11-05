import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { GalleryTable } from "../components/GalleryTable";
import { BottomNavigation, For, SubmitButton } from "odinkit";
import PhotoAlbum from "react-photo-album";
import { GalleryPhotos } from "./components/GalleryPhotos";
import { GalleryForm } from "../shared/GalleryForm";
import { GalleryContainer } from "../shared/GalleryContainer";
import prisma from "prisma/prisma";

export default async function GalleriesPage({
  params,
}: {
  params: { id: string };
}) {
  const activeOrg = cookies().get("activeOrg")?.value;
  if (!activeOrg) return notFound();

  const organization = await prisma.organization.findUnique({
    where: { id: activeOrg },
  });
  if (!organization) return notFound();

  const gallery = await prisma.gallery.findUnique({
    where: { id: params.id },
    include: { GalleryPhoto: true, Event: true, EventGroup: true },
  });

  if (!gallery) return notFound();

  return (
    <>
      <GalleryContainer gallery={gallery}>
        <GalleryForm gallery={gallery} organization={organization} />
        <GalleryPhotos photos={gallery.GalleryPhoto} />
      </GalleryContainer>
    </>
  );
}
