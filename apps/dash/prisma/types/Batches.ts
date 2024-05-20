import {
  CategoryBatch,
  EventRegistrationBatch,
  ModalityBatch,
  ModalityCategory,
} from "@prisma/client";

export type EventRegistrationBatchesWithCategoriesAndRegistrations =
  EventRegistrationBatch & {
    CategoryBatch: (CategoryBatch & {
      category: ModalityCategory & { _count?: { EventRegistration: number } };
    })[];
    ModalityBatch: (ModalityBatch & {
      _count?: { EventRegistration: number };
    })[];
    _count: { EventRegistration: number };
  };
