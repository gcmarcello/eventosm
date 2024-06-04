"use client";
import { readSubeventReviewData } from "@/app/api/events/action";
import { readSubeventReviewData as readSubeventReviewDataService } from "@/app/api/events/service";
import { updateEventStatus } from "@/app/api/events/status/action";
import { updateEventStatusDto } from "@/app/api/events/status/dto";
import { Event, EventAbsenceStatus, EventAbsences } from "@prisma/client";
import { Alertbox, SubmitButton, Text } from "odinkit";
import {
  DialogBody,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogDescription,
  Label,
  Input,
  Button,
  showToast,
  useAction,
  useForm,
  Form,
  Select,
  Fieldset,
  FieldGroup,
  Description,
} from "odinkit/client";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";

export default function ConfirmEventReviewModal({
  isOpen,
  setIsOpen,
  event,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  event: Event;
}) {
  const {
    data: eventStatusData,
    trigger: eventStatusTrigger,
    isMutating,
  } = useAction({
    action: updateEventStatus,
    onSuccess: (data) => {
      showToast({
        message: "Status do evento atualizado com sucesso!",
        variant: "success",
        title: "Sucesso!",
      }),
        setIsOpen(false);
      form.reset();
    },
    onError: (error) =>
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro!",
      }),
  });

  const form = useForm({
    schema: updateEventStatusDto,
    defaultValues: {
      status: "review",
    },
  });

  useEffect(() => {
    form.setValue("eventId", event.id);
    form.setValue("eventGroupId", event?.eventGroupId ?? undefined);
  }, [event]);

  return (
    <Form
      className="my-2"
      hform={form}
      onSubmit={(data) => eventStatusTrigger(data)}
    >
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Iniciar Revisão do Evento</DialogTitle>
        <DialogDescription>
          Ao iniciar a revisão, todas as ausências serão processadas e os
          participantes serão notificados caso justificativas forem necessárias.
        </DialogDescription>
        <DialogBody></DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <SubmitButton>Iniciar Revisão</SubmitButton>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
