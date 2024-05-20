"use client";
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
  showToast,
  useAction,
  useForm,
} from "odinkit/client";

import { Dispatch, SetStateAction, useContext, useMemo, useState } from "react";
import { Button } from "odinkit/client";
import { Input } from "odinkit/client";
import { format } from "path";
import { SubmitButton } from "odinkit";
import { usePanel } from "../../../../_shared/components/PanelStore";
import { ModalityPageContext } from "./context/ModalityPage.ctx";
import { upsertEventModality } from "@/app/api/events/action";
import { EventModality } from "@prisma/client";
import ModalityRemovalModal from "./ModalityRemovalModal";

export default function ModalityModal() {
  const {
    modalVisibility,
    setModalVisibility,
    modalityForm,
    handleModalClose,
    handleRemovalModalOpen,
    modalities,
  } = useContext(ModalityPageContext);

  const {
    data,
    trigger: upsertModalityTrigger,
    isMutating: upsertModalityLoading,
  } = useAction({
    action: upsertEventModality,
    redirect: false,
    onSuccess: () => {
      showToast({
        message: "Modalidade criada com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
      handleModalClose();
    },
    onError: (error) =>
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      }),
  });

  const ModalityField = useMemo(() => modalityForm.createField(), []);

  return (
    <Dialog open={modalVisibility} onClose={handleModalClose}>
      <ModalityRemovalModal />
      <Form
        className="flex h-full flex-col"
        hform={modalityForm}
        onSubmit={upsertModalityTrigger}
      >
        <DialogTitle>
          {modalityForm.getValues("id") ? "Atualizar" : "Criar"} Modalidade
        </DialogTitle>
        <DialogDescription>
          Ao criar a modalidade, você poderá criar as categorias de inscrição no
          seu evento.
        </DialogDescription>
        <DialogBody className="mt-2 grow">
          <ModalityField name="name">
            <Label>Nome</Label>
            <Input placeholder="Ex.: 5Km" />
            <Description></Description>
          </ModalityField>
        </DialogBody>
        <DialogActions>
          {modalityForm.watch("id") && modalities.length > 1 ? (
            <Button
              color="red"
              onClick={() =>
                modalityForm.watch("id")
                  ? handleRemovalModalOpen(modalityForm.watch("id")!)
                  : null
              }
            >
              Remover Modalidade
            </Button>
          ) : null}
          <Button color="white" onClick={() => setModalVisibility(false)}>
            Cancelar
          </Button>
          <SubmitButton>
            {modalityForm.getValues("id") ? "Salvar" : "Criar"}
          </SubmitButton>
        </DialogActions>{" "}
      </Form>
    </Dialog>
  );
}
