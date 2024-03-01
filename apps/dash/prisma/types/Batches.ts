import {
  CategoryBatch,
  EventRegistrationBatch,
  ModalityCategory,
} from "@prisma/client";

export type EventRegistrationBatchesWithCategoriesAndRegistrations =
  EventRegistrationBatch & {
    CategoryBatch: (CategoryBatch & { category: ModalityCategory })[];
    _count: { EventRegistration: number };
  };
