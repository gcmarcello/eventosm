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

export default function ConfirmEventFinishModal({
  isOpen,
  setIsOpen,
  event,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  event: Event;
}) {
  const [subeventAttendance, setSubeventAttendance] = useState<any>(undefined);

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

  const {
    data: subeventAbsences,
    trigger: subeventAbsencesTrigger,
    isMutating: subeventAbsencesMutating,
  } = useAction({
    action: readSubeventReviewData,
    onSuccess: (data) => {
      const info = data.data;
      setSubeventAttendance(info);
    },
  });

  const form = useForm({
    schema: updateEventStatusDto,
    defaultValues: {
      status: "finished",
    },
  });

  useEffect(() => {
    subeventAbsencesTrigger({ eventId: event.id });
    form.setValue("eventId", event.id);
    form.setValue("eventGroupId", event?.eventGroupId ?? undefined);
  }, [event]);

  const Field = useMemo(() => form.createField(), []);

  return (
    <Form
      className="my-2"
      hform={form}
      onSubmit={(data) => eventStatusTrigger(data)}
    >
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Finalizar Evento</DialogTitle>
        <DialogDescription>
          Após finalizado, você não poderá mais alterar presenças ou
          justificativas.
        </DialogDescription>
        <DialogBody>
          <Fieldset>
            <FieldGroup>
              {subeventAttendance?.absences &&
              subeventAttendance.absences?.filter(
                (abs: EventAbsences) =>
                  abs.status === EventAbsenceStatus.pending
              ).length ? (
                <Field name="finishEvent.unjustifiedAbsences">
                  <Alertbox className="my-2" type="info">
                    O evento ainda possui {subeventAttendance.absences.length}{" "}
                    justificativa
                    {subeventAttendance.absences.length > 1 ? "s" : ""} de
                    ausência pendentes, o que você deseja fazer?
                  </Alertbox>
                  <Label>Processar ausências pendentes</Label>
                  <Select
                    data={[
                      { id: "approved", name: "Aprovar todos" },
                      { id: "denied", name: "Reprovar todos" },
                    ]}
                    displayValueKey="name"
                  />
                </Field>
              ) : null}
            </FieldGroup>
          </Fieldset>

          <Text>ID: {event.id}</Text>
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <SubmitButton>Finalizar</SubmitButton>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
