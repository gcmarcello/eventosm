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
  console.log(rest);
  return await prisma.gallery.upsert({
    where: { id },
    update: rest,
    create: {
      ...rest,
      GalleryPhoto: { create: mediaUrls?.map((url) => ({ imageUrl: url })) },
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
