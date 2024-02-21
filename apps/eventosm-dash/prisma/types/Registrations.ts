import { CategoryBatch, EventRegistrationBatch } from "@prisma/client";

export type EventRegistrationBatchesWithCategories = EventRegistrationBatch & {
  CategoryBatch: CategoryBatch[];
};
