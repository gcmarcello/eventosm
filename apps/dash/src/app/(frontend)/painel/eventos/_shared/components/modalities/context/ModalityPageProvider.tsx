"use client";

import React, { useEffect, useState } from "react";
import { Event, EventGroup, EventModality } from "@prisma/client";
import { ModalityPageContext } from "./ModalityPage.ctx";
import { upsertEventModalityDto } from "@/app/api/events/dto";
import { showToast, useAction, useForm } from "odinkit/client";
import { upsertEventModality } from "@/app/api/events/action";
import { EventModalityWithCategories } from "prisma/types/Events";
import { deleteModalityDto } from "@/app/api/modalities/dto";

export function ModalityPageProvider({
  children,
  event,
  eventGroup,
  modalities,
}: {
  event?: Event;
  eventGroup?: EventGroup;
  children: React.ReactNode;
  modalities: EventModalityWithCategories[];
}) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [removalModalVisibility, setRemovalModalVisibility] = useState(false);
  const [selectedModality, setSelectedModality] =
    useState<EventModality | null>(null);

  const modalityForm = useForm({
    mode: "onChange",
    schema: upsertEventModalityDto,
    defaultValues: event
      ? { eventId: event.id }
      : { eventGroupId: eventGroup?.id },
  });

  const deleteModalityForm = useForm({
    mode: "onChange",
    schema: deleteModalityDto,
    defaultValues: {
      id: selectedModality?.id,
    },
  });

  function handleModalOpen({ id, name }: { id?: string; name?: string }) {
    setModalVisibility(true);
    modalityForm.setValue("id", id);
    modalityForm.setValue("name", name ?? "");
    modalityForm.setValue("eventGroupId", eventGroup?.id);
    modalityForm.setValue("eventId", event?.id);
  }

  function handleModalClose() {
    setModalVisibility(false);
    deleteModalityForm.resetField("id", undefined);
    deleteModalityForm.resetField("targetModalityId", undefined);
    modalityForm.resetField("id", undefined);
    modalityForm.resetField("name", undefined);
    modalityForm.resetField("eventGroupId", { defaultValue: eventGroup?.id });
    modalityForm.resetField("eventId", { defaultValue: event?.id });
  }

  function handleRemovalModalOpen(modalityId: string) {
    deleteModalityForm.setValue("id", modalityId);
    setRemovalModalVisibility(true);
  }

  return (
    <ModalityPageContext.Provider
      value={{
        modalVisibility,
        setModalVisibility,
        selectedModality,
        setSelectedModality,
        modalityForm,
        deleteModalityForm,
        modalities,
        handleModalOpen,
        handleModalClose,
        removalModalVisibility,
        setRemovalModalVisibility,
        handleRemovalModalOpen,
      }}
    >
      {children}
    </ModalityPageContext.Provider>
  );
}
