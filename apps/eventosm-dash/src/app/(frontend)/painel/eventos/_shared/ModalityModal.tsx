import {
  UpsertEventModalityDto,
  upsertEventModalityDto,
} from "@/app/api/events/dto";
import {
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Form,
  Label,
  UseFormReturn,
} from "odinkit/client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { usePanel } from "../../_shared/components/PanelStore";
import { Button } from "odinkit/client";
import { Input } from "odinkit/client";
import { format } from "path";
import { SubmitButton } from "odinkit";

export default function ModalityModal({
  modalState,
  trigger,
  modalityForm,
  isLoading,
}: {
  modalState: {
    setIsModalityModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalityModalOpen: boolean;
  };
  trigger: (data: any) => void;
  modalityForm: UseFormReturn<UpsertEventModalityDto>;
  isLoading?: boolean;
}) {
  const ModalityField = useMemo(() => modalityForm.createField(), []);
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();
  return (
    <Form hform={modalityForm} onSubmit={trigger}>
      <Dialog
        size="5xl"
        open={modalState.isModalityModalOpen}
        onClose={modalState.setIsModalityModalOpen}
      >
        <DialogTitle>
          {modalityForm.getValues("id") ? "Atualizar" : "Criar"} Modalidade
        </DialogTitle>
        <DialogDescription>
          Ao criar a modalidade, você poderá criar as categorias de inscrição no
          seu evento.
        </DialogDescription>
        <DialogBody>
          <ModalityField name="name">
            <Label>Nome</Label>
            <Input placeholder="Ex.: 5Km" />
            <Description>{modalityForm.getValues("id")}</Description>
          </ModalityField>
        </DialogBody>
        <DialogActions>
          <Button
            color="white"
            onClick={() => modalState.setIsModalityModalOpen(false)}
          >
            Cancelar
          </Button>
          <SubmitButton color={primaryColor?.tw.color}>
            {modalityForm.getValues("id") ? "Salvar" : "Criar"}
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
