import { readModalityBatchRegistrations } from "@/app/api/batches/action";
import { Field } from "@headlessui/react";
import {
  Event,
  EventGroup,
  EventRegistration,
  EventRegistrationBatch,
} from "@prisma/client";
import { Chart, DoughnutController } from "chart.js";
import { LoadingSpinner, Table, Text } from "odinkit";
import {
  Button,
  ChartContainer,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Input,
  Label,
  createChart,
  useAction,
} from "odinkit/client";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function ModalityControlModal({
  batch,
  isOpen,
  setIsOpen,
}: {
  batch: EventRegistrationBatch;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  useEffect(() => {
    if (isOpen) {
      triggerRegistrationBatch({ batchId: batch.id });
    }
  }, [isOpen]);

  const {
    data: registrationBatch,
    trigger: triggerRegistrationBatch,
    isMutating: isLoading,
    reset,
  } = useAction({
    action: readModalityBatchRegistrations,
  });

  const chart = createChart({
    type: "doughnut",
    data: {
      labels: registrationBatch?.map((r) => r.modality?.name) || [],
      datasets: [
        {
          label: "Número de Inscritos",
          data: registrationBatch?.map((r) => r._count.modalityId || []),
          backgroundColor: [
            "rgba(231, 76, 60, 1)",
            "rgba(255, 164, 46, 1)",
            "rgba(46, 204, 113, 1)",
          ],
          borderColor: [
            "rgba(255, 255, 255 ,1)",
            "rgba(255, 255, 255 ,1)",
            "rgba(255, 255, 255 ,1)",
          ],
          borderWidth: 5,
        },
      ],
    },
    options: {
      rotation: -90,
      circumference: 180,
    },
  });

  function handleClose() {
    setIsOpen(false);
    reset();
  }

  return (
    <Dialog open={isOpen} onClose={() => handleClose()}>
      <DialogTitle>Lote {batch.name} - Modalidades</DialogTitle>
      <DialogDescription>
        Esses são os dados de inscrição por modalidade deste lote.
      </DialogDescription>
      <DialogBody>
        <div className="mt-4 flex justify-center">
          {registrationBatch ? (
            registrationBatch.length > 0 ? (
              <ChartContainer chart={chart} />
            ) : (
              <Text>Nenhuma inscrição ativa neste lote.</Text>
            )
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </DialogBody>
      <DialogActions>
        <Button plain onClick={() => handleClose()}>
          Voltar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
