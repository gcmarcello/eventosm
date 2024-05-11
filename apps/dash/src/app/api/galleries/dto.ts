import { z } from "zod";

export const upsertGalleryDto = z.object({
  name: z.string().min(3).max(255),
  description: z.string().min(3).max(255).optional(),
  eventGroupId: z.string().optional(),
  eventId: z.string().optional(),
  mediaUrls: z.array(z.string()).optional(),
  id: z.string().optional(),
});

export type UpsertGalleryDto = z.infer<typeof upsertGalleryDto>;

export const createGalleryPhotosDto = z.object({
  galleryId: z.string(),
  photoUrls: z.array(z.string()),
});

export type CreateGalleryPhotosDto = z.infer<typeof createGalleryPhotosDto>;

export const deleteGalleryPhotoDto = z.object({
  photoId: z.string(),
});

export type DeleteGalleryPhotoDto = z.infer<typeof deleteGalleryPhotoDto>;

export const updateGalleryPhotoDto = z.object({
  photoId: z.string(),
  photoUrl: z.string(),
});

export type UpdateGalleryPhotoDto = z.infer<typeof updateGalleryPhotoDto>;
