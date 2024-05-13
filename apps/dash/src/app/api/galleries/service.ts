import { Organization } from "@prisma/client";
import { CreateGalleryPhotosDto, UpsertGalleryDto } from "./dto";
import { UserSession } from "@/middleware/functions/userSession.middleware";

export async function upsertGallery(
  data: UpsertGalleryDto & {
    organization: Organization;
    userSession: UserSession;
  }
) {
  const { organization, userSession, ...parsedData } = data;
  const id = data.id ?? crypto.randomUUID();
  const { mediaUrls, ...rest } = parsedData;
  const parsedMedia = mediaUrls?.map((url) => ({ imageUrl: url }));
  return await prisma.gallery.upsert({
    where: { id },
    update: {
      ...rest,
      organizationId: organization.id,
      GalleryPhoto: { create: parsedMedia },
    },
    create: {
      ...rest,
      organizationId: organization.id,
      GalleryPhoto: { create: parsedMedia },
    },
  });
}

export async function createGalleryPhotos(data: CreateGalleryPhotosDto) {
  return await prisma.galleryPhoto.createMany({
    data: data.photoUrls.map((url) => ({
      galleryId: data.galleryId,
      imageUrl: url,
    })),
  });
}
