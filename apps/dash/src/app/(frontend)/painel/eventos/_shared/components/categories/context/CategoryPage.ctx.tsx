import {
  UpsertCategoryDocumentsDto,
  UpsertEventModalityCategoriesDto,
} from "@/app/api/categories/dto";
import { UpsertEventModalityDto } from "@/app/api/events/dto";
import { DeleteModalityDto } from "@/app/api/modalities/dto";
import {
  CategoryDocument,
  Event,
  EventGroup,
  EventModality,
  ModalityCategory,
} from "@prisma/client";
import { UseFormReturn } from "odinkit/client";
import { EventModalityWithCategories } from "prisma/types/Events";
import { Dispatch, SetStateAction, createContext } from "react";

export class CategoryPageContextProps {
  showForm: boolean = false;
  setShowForm: Dispatch<SetStateAction<boolean>>;
  event?: Event;
  eventGroup?: EventGroup;
  categoryForm: UseFormReturn<UpsertEventModalityCategoriesDto>;
  selectedCategory?: ModalityCategory & {
    CategoryDocument?: CategoryDocument[];
  };
  setSelectedCategory: Dispatch<
    SetStateAction<
      (ModalityCategory & { CategoryDocument?: CategoryDocument[] }) | undefined
    >
  >;
  categoryDocumentForm: UseFormReturn<UpsertCategoryDocumentsDto>;
  modality: EventModalityWithCategories;
}

export const CategoryPageContext = createContext(
  new CategoryPageContextProps()
);
