"use client";

import React, { useEffect, useState } from "react";
import {
  Event,
  EventAbsences,
  EventGroup,
  EventModality,
} from "@prisma/client";
import { AbsencesPageContext } from "./AbsencesPage.ctx";
import { upsertEventModalityDto } from "@/app/api/events/dto";
import { showToast, useAction, useForm } from "odinkit/client";
import { upsertEventModality } from "@/app/api/events/action";
import { EventModalityWithCategories } from "prisma/types/Events";
import { deleteModalityDto } from "@/app/api/modalities/dto";
import { updateEventStatus } from "@/app/api/events/status/action";
import {
  changeAbsenceStatus,
  readAbsenceJustification,
} from "@/app/api/absences/action";
import { updateAbsenceStatusDto } from "@/app/api/absences/dto";

export function AbsencesPageProvider({
  children,
  event,
  eventGroup,
}: {
  event?: Event;
  eventGroup?: EventGroup;
  children: React.ReactNode;
}) {
  const [modalVisibility, setModalVisibility] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<EventAbsences | null>(
    null
  );

  const form = useForm({
    mode: "onChange",
    schema: updateAbsenceStatusDto,
    defaultValues: {
      absenceId: selectedAbsence?.id,
      status: "denied",
    },
  });

  const {
    data: eventStatusData,
    trigger: eventStatusTrigger,
    isMutating: isEventStatusMutating,
  } = useAction({
    action: updateEventStatus,
    onSuccess: () =>
      showToast({
        message: "Status do evento atualizado com sucesso!",
        variant: "success",
        title: "Sucesso!",
      }),
    onError: (error) =>
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro!",
      }),
  });

  const {
    data: absenceStatus,
    trigger: triggerAbsenceStatus,
    isMutating: isAbsenceStatusMutating,
  } = useAction({
    action: changeAbsenceStatus,
    onSuccess: () => {
      handleModalClose();
      showToast({
        message: "Status da ausência atualizado com sucesso!",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  const {
    data: absenceJustificationData,
    trigger: triggerReadAbsenceJustificationData,
  } = useAction({
    action: readAbsenceJustification,
    onSuccess: (data) => window.open(data.data, "_blank"),
    onError: (error) =>
      showToast({ message: error.message, variant: "error", title: "Erro!" }),
  });

  function handleModalOpen(absence: EventAbsences) {
    setSelectedAbsence(absence);
    setModalVisibility(true);
  }

  function handleModalClose() {
    setModalVisibility(false);
    setTimeout(() => {
      form.setValue("comment", undefined);
      setSelectedAbsence(null);
    }, 400);
  }

  useEffect(() => {
    if (selectedAbsence) {
      form.setValue("absenceId", selectedAbsence.id);
    } else {
      form.setValue("absenceId", "");
    }
  }, [selectedAbsence]);

  return (
    <AbsencesPageContext.Provider
      value={{
        handleModalClose,
        handleModalOpen,
        modalVisibility,
        selectedAbsence,
        setSelectedAbsence,
        triggerReadAbsenceJustificationData,
        triggerAbsenceStatus,
        isAbsenceStatusMutating,
        eventStatusTrigger,
        isEventStatusMutating,
        form,
      }}
    >
      {children}
    </AbsencesPageContext.Provider>
  );
}
