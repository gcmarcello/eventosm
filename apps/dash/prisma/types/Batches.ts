import {
  CategoryBatch,
  EventRegistrationBatch,
  ModalityBatch,
  ModalityCategory,
} from "@prisma/client";

export type EventRegistrationBatchesWithCategoriesAndRegistrations =
  EventRegistrationBatch & {
    CategoryBatch: (CategoryBatch & { category: ModalityCategory })[];
    ModalityBatch: ModalityBatch[];
    _count: { EventRegistration: number };
  };
