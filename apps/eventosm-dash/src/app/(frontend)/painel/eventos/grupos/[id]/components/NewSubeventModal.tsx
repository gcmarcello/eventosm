import {
  UpsertEventDto,
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
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Form,
  Label,
  UseFormReturn,
  showToast,
  useFormContext,
} from "odinkit/client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { Button } from "odinkit/client";
import { Input } from "odinkit/client";
import { format } from "path";
import { usePanel } from "@/app/(frontend)/painel/_shared/components/PanelStore";
import FileImagePreview from "node_modules/odinkit/src/components/Form/File/FileImagePreview";
import { Text } from "odinkit";
import { Event } from "@prisma/client";

export default function SubeventModal({
  modalState,
  subevent,
}: {
  modalState: {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
  };
  subevent: Event | undefined;
}) {
  type ClientUpsertEventDto = Omit<UpsertEventDto, "imageUrl"> & {
    image?: any[];
  };

  const form = useFormContext<ClientUpsertEventDto>();
  const SubeventField = useMemo(() => form.createField(), []);
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  return (
    <Dialog
      size="5xl"
      open={modalState.isModalOpen}
      onClose={modalState.setIsModalOpen}
    >
      <DialogTitle>
        {form.getValues("id") ? "Atualizar" : "Criar"} Etapa
      </DialogTitle>
      {/* <DialogDescription>
          Ao criar a modalidade, você poderá criar as categorias de inscrição no
          seu evento.
        </DialogDescription> */}
      <DialogBody>
        <Fieldset>
          <FieldGroup className="grid grid-cols-2 gap-3">
            <SubeventField className="col-span-2 lg:col-span-1" name="name">
              <Label>Nome do Evento</Label>
              <Input placeholder="10 KM da Rua 3" />
              <ErrorMessage />
            </SubeventField>
            <SubeventField className="col-span-2 lg:col-span-1" name="location">
              <Label>Local</Label>
              <Input placeholder="Rua 3" />
              <ErrorMessage />
            </SubeventField>
            <SubeventField
              className="col-span-2 lg:col-span-1"
              name="dateStart"
            >
              <Label>Início do Evento</Label>
              <Input mask={"99/99/9999"} placeholder="01/01/2024" />
              <ErrorMessage />
            </SubeventField>
            <SubeventField className="col-span-2 lg:col-span-1" name="dateEnd">
              <Label>Término do Evento</Label>
              <Input mask={"99/99/9999"} placeholder="02/01/2024" />
              <ErrorMessage />
            </SubeventField>
            <SubeventField name="image">
              <Label>Capa do Evento</Label>
              <FileInput
                fileTypes={["png", "jpg", "jpeg"]}
                maxFiles={1}
                maxSize={1}
                onError={(error) => {
                  if (typeof error === "string") {
                    showToast({
                      message: error,
                      title: "Erro",
                      variant: "error",
                    });
                  }
                }}
              >
                <FileDropArea
                  render={
                    form.watch("image")?.length ? (
                      <>
                        <Text>
                          <span className="font-semibold">Arquivo:</span>{" "}
                          {form.watch("image")?.[0].name}{" "}
                          <span
                            onClick={() => {
                              form.reset();
                            }}
                            className="cursor-pointer font-semibold text-emerald-600"
                          >
                            Trocar
                          </span>
                        </Text>
                      </>
                    ) : null
                  }
                />
              </FileInput>
              <div className="my-3">
                <FileImagePreview defaultValue={subevent?.imageUrl || ""} />
              </div>
            </SubeventField>
          </FieldGroup>
        </Fieldset>
        <Description>ID: {form.getValues("id")}</Description>
      </DialogBody>
      <DialogActions>
        <Button color="white" onClick={() => modalState.setIsModalOpen(false)}>
          Cancelar
        </Button>
        <Button form="SubeventForm" type="submit" color={primaryColor}>
          {form.getValues("id") ? "Salvar" : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
