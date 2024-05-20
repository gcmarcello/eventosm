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
  ErrorMessage,
  Form,
  Label,
  Select,
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
import { deleteModality } from "@/app/api/modalities/action";
import { set } from "lodash";

export default function ModalityRemovalModal() {
  const {
    removalModalVisibility,
    setRemovalModalVisibility,
    setModalVisibility,
    handleModalClose,
    deleteModalityForm,
    modalities,
  } = useContext(ModalityPageContext);

  const {
    data,
    trigger: removeModalityTrigger,
    isMutating: removeModalityLoading,
  } = useAction({
    action: deleteModality,
    redirect: false,
    onSuccess: () => {
      showToast({
        message: "Modalidade removida com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
      setRemovalModalVisibility(false);
      setModalVisibility(false);
    },
    onError: (error) => {
      console.log(error);
      showToast({
        message: error.message,
        title: "Erro!",
        variant: "error",
      });
    },
  });

  const ModalityField = useMemo(() => deleteModalityForm.createField(), []);

  return (
    <Dialog open={removalModalVisibility} onClose={handleModalClose}>
      <Form
        className="flex h-full flex-col"
        hform={deleteModalityForm}
        onSubmit={removeModalityTrigger}
      >
        <DialogTitle>
          Remover Modalidade -{" "}
          {
            modalities.find((f) => f.id === deleteModalityForm.watch("id"))
              ?.name
          }
        </DialogTitle>
        <DialogDescription>
          Para remover uma modalidade, você precisa escolher uma modalidade alvo
          para receber as categorias da que será removida.
        </DialogDescription>
        <DialogBody className="mt-3 grow">
          <ModalityField name="targetModalityId">
            <Label>Nome</Label>
            <Select
              data={modalities.filter(
                (f) => f.id !== deleteModalityForm.watch("id")
              )}
              displayValueKey="name"
            />
            <Description>
              Você pode escolher qualquer modalidade menos a atual.
            </Description>
            <ErrorMessage />
          </ModalityField>
        </DialogBody>
        <DialogActions>
          <Button
            color="white"
            onClick={() => setRemovalModalVisibility(false)}
          >
            Cancelar
          </Button>
          <SubmitButton>Remover</SubmitButton>
        </DialogActions>
      </Form>
    </Dialog>
  );
}
