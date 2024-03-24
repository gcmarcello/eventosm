import { EventModality, ModalityCategory } from "@prisma/client";

export type ModalitiesWithCategories = EventModality & {
  modalityCategory: ModalityCategory[];
};
