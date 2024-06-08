"use client";

import React, { useEffect, useState } from "react";
import {
  CategoryDocument,
  Event,
  EventGroup,
  EventModality,
  ModalityCategory,
} from "@prisma/client";
import { upsertEventModalityDto } from "@/app/api/events/dto";
import { showToast, useAction, useForm } from "odinkit/client";
import { upsertEventModality } from "@/app/api/events/action";
import { EventModalityWithCategories } from "prisma/types/Events";
import { deleteModalityDto } from "@/app/api/modalities/dto";
import { upsertEventModalityCategories } from "@/app/api/categories/action";
import {
  upsertCategoryDocumentsDto,
  upsertEventModalityCategoriesDto,
} from "@/app/api/categories/dto";
import { CategoryPageContext } from "./CategoryPage.ctx";

export function CategoryPageProvider({
  children,
  event,
  eventGroup,
  modality,
}: {
  event?: Event;
  eventGroup?: EventGroup;
  children: React.ReactNode;
  modality: EventModalityWithCategories;
}) {
  const [showForm, setShowForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<
    (ModalityCategory & { CategoryDocument?: CategoryDocument[] }) | undefined
  >(undefined);

  const categoryForm = useForm({
    mode: "onChange",
    schema: upsertEventModalityCategoriesDto,
    defaultValues: { categories: modality.modalityCategory },
  });

  const categoryDocumentForm = useForm({
    mode: "onChange",
    schema: upsertCategoryDocumentsDto,
    defaultValues: { documents: selectedCategory?.CategoryDocument ?? [] },
  });

  useEffect(() => {
    categoryDocumentForm.setValue(
      "documents",
      selectedCategory?.CategoryDocument || []
    );
  }, [selectedCategory]);

  return (
    <CategoryPageContext.Provider
      value={{
        modality,
        categoryForm,
        categoryDocumentForm,
        event,
        showForm,
        setShowForm,
        eventGroup,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </CategoryPageContext.Provider>
  );
}
