"use client";
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
  RichTextEditor,
  UseFormReturn,
  showToast,
  useAction,
  useFormContext,
  useMocker,
} from "odinkit/client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { Button } from "odinkit/client";
import { Input } from "odinkit/client";
import { usePanel } from "@/app/(frontend)/painel/_shared/components/PanelStore";
import { FileImagePreview, SubmitButton, Text, fileFromUrl } from "odinkit";
import { Event } from "@prisma/client";
import { fakerPT_BR } from "@faker-js/faker";
import dayjs from "dayjs";
import { updateEventStatus } from "@/app/api/events/status/action";

export default function SubeventModal({
  modalState,
  subevent,
  isLoading,
  eventGroupId,
}: {
  eventGroupId: string;
  modalState: {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
  };
  subevent: Event | undefined;
  isLoading?: boolean;
}) {
  type ClientUpsertEventDto = Omit<UpsertEventDto, "imageUrl"> & {
    image?: any[];
  };

  const form = useFormContext<ClientUpsertEventDto>();
  const SubeventField = useMemo(() => form.createField(), []);
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  useMocker({
    form: form,
    data: async () => ({
      dateEnd: dayjs(
        fakerPT_BR.date
          .future({ refDate: "01/03/2024", years: 0.5 })
          .toISOString()
      ).format("DD/MM/YYYY"),
      dateStart: dayjs(
        fakerPT_BR.date
          .future({ refDate: "01/01/2024", years: 0.2 })
          .toISOString()
      ).format("DD/MM/YYYY"),
      description: fakerPT_BR.lorem.paragraphs(3),
      image: [
        await fileFromUrl(
          "https://placehold.co/600x400?text=" +
            encodeURI(fakerPT_BR.lorem.words(2))
        ),
      ],
      location: fakerPT_BR.location.street(),
      name: fakerPT_BR.lorem.words(3),
    }),
  });

  const {
    data: eventStatusData,
    trigger: eventStatusTrigger,
    isMutating,
  } = useAction({
    action: updateEventStatus,
    onSuccess: () =>
      showToast({
        message: "Status do evento atualizado com sucesso!",
        variant: "success",
        title: "Sucesso!",
      }),
    onError: (message) =>
      showToast({
        message,
        variant: "error",
        title: "Erro!",
      }),
  });

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
          {form.getValues("id") && (
            <Button
              loading={isMutating}
              onClick={() =>
                eventStatusTrigger({
                  status: "finished",
                  eventId: form.getValues("id"),
                  eventGroupId: eventGroupId,
                })
              }
              className="my-auto"
              color="teal"
            >
              Analisar Evento
            </Button>
          )}
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
            <SubeventField name="image" className="col-span-2">
              <Label>Capa do Evento</Label>
              <FileInput
                fileTypes={["png", "jpg", "jpeg"]}
                maxFiles={1}
                maxSize={1}
                onError={(error) => {
                  if (typeof error === "string") {
                    showToast({
                      message: error.message,
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
                              form.setValue("image", undefined);
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
              <ErrorMessage />
            </SubeventField>
            <SubeventField
              className="col-span-2 lg:col-span-2"
              name="description"
            >
              <Label>Descrição da Etapa</Label>
              <RichTextEditor />
              <ErrorMessage />
            </SubeventField>
          </FieldGroup>
        </Fieldset>
        <Description>ID: {form.getValues("id")}</Description>
      </DialogBody>
      <DialogActions>
        <Button color="white" onClick={() => modalState.setIsModalOpen(false)}>
          Cancelar
        </Button>
        <SubmitButton color={primaryColor?.tw.color}>
          {form.getValues("id") ? "Salvar" : "Criar"}
        </SubmitButton>
      </DialogActions>
    </Dialog>
  );
}
