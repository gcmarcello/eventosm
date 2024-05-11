import { CreateGalleryPhotosDto, UpsertGalleryDto } from "./dto";

export async function upsertGallery(data: UpsertGalleryDto) {
  const id = data.id ?? crypto.randomUUID();
  return await prisma.gallery.upsert({
    where: { id },
    update: data,
    create: data,
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
