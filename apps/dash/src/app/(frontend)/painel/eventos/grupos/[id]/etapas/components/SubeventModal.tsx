"use client";
import {
  UpsertEventDto,
  UpsertEventModalityDto,
  upsertEventDto,
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
  useForm,
  useFormContext,
  useMocker,
} from "odinkit/client";

import { Dispatch, SetStateAction, useMemo, useState } from "react";

import { Button } from "odinkit/client";
import { Input } from "odinkit/client";
import { usePanel } from "@/app/(frontend)/painel/_shared/components/PanelStore";
import {
  FileImagePreview,
  SubmitButton,
  Tabs,
  Text,
  fileFromUrl,
  z,
} from "odinkit";
import { Event } from "@prisma/client";
import { fakerPT_BR } from "@faker-js/faker";
import dayjs from "dayjs";
import { updateEventStatus } from "@/app/api/events/status/action";
import { SubeventControl } from "./SubeventControl";
import { EventGroupWithEvents } from "prisma/types/Events";
import { OrganizationWithDomain } from "prisma/types/Organization";
import { upsertEvent } from "@/app/api/events/action";
import { uploadFiles } from "@/app/api/uploads/action";

const schema = upsertEventDto
  .omit({ imageUrl: true })
  .merge(z.object({ image: z.array(z.any()).optional() }));

export type Schema = z.infer<typeof schema>;

export default function SubeventModal({
  modalState,
  subevent,
  eventGroup,
  organization,
}: {
  eventGroup: EventGroupWithEvents;
  modalState: {
    setIsModalOpen: Dispatch<SetStateAction<boolean>>;
    isModalOpen: boolean;
  };
  subevent: Event | undefined;
  isLoading?: boolean;
  organization: OrganizationWithDomain;
}) {
  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  const form = useForm({
    schema,
    mode: "onChange",
    defaultValues: {
      eventGroupId: eventGroup.id,
      name:
        subevent?.name ||
        `${eventGroup.name} - #${eventGroup.Event.length + 1} Etapa`,
      id: subevent?.id,
      dateStart: dayjs(subevent?.dateStart).format("DD/MM/YYYY") || "",
      dateEnd: dayjs(subevent?.dateEnd).format("DD/MM/YYYY") || "",
      location: subevent?.location || "",
      rules: eventGroup?.rules || "",
      description: eventGroup?.description || "",
    },
  });

  const Field = useMemo(() => form.createField(), []);

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

  const { data, trigger } = useAction({
    action: upsertEvent,
    prepare: async (data: Schema) => {
      const { image, ...rest } = data;

      if (!image)
        return {
          ...rest,
          imageUrl: eventGroup.imageUrl ?? undefined,
        };

      const uploadedFiles = await uploadFiles(
        [{ name: "image", file: image ? image[0] : [] }],
        "/events/"
      );

      return { ...rest, imageUrl: uploadedFiles?.image?.url };
    },
    onSuccess: () => {
      modalState.setIsModalOpen(false);
      showToast({
        message: "Etapa salva com sucesso!",
        title: "Sucesso!",
        variant: "success",
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
    onError: (error) =>
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro!",
      }),
  });

  if (!subevent) return null;

  return (
    <Form hform={form} onSubmit={trigger}>
      <Dialog
        size="full"
        open={modalState.isModalOpen}
        onClose={modalState.setIsModalOpen}
      >
        <DialogTitle onClose={() => modalState.setIsModalOpen(false)}>
          {subevent ? "Atualizar" : "Criar"} Etapa
        </DialogTitle>

        <DialogBody>
          <Tabs
            color={primaryColor?.hex}
            tabs={[
              {
                content: (
                  <>
                    <Fieldset>
                      <FieldGroup className="grid grid-cols-2 gap-3">
                        <Field className="col-span-2 lg:col-span-1" name="name">
                          <Label>Nome do Evento</Label>
                          <Input placeholder="10 KM da Rua 3" />
                          <ErrorMessage />
                        </Field>
                        <Field
                          className="col-span-2 lg:col-span-1"
                          name="location"
                        >
                          <Label>Local</Label>
                          <Input placeholder="Rua 3" />
                          <ErrorMessage />
                        </Field>
                      </FieldGroup>
                      <FieldGroup className="grid grid-cols-2 gap-3">
                        <Field
                          className="col-span-2 lg:col-span-1"
                          name="dateStart"
                        >
                          <Label>Início do Evento</Label>
                          <Input mask={"99/99/9999"} placeholder="01/01/2024" />
                          <ErrorMessage />
                        </Field>
                        <Field
                          className="col-span-2 lg:col-span-1"
                          name="dateEnd"
                        >
                          <Label>Término do Evento</Label>
                          <Input mask={"99/99/9999"} placeholder="02/01/2024" />
                          <ErrorMessage />
                        </Field>
                      </FieldGroup>
                      <FieldGroup>
                        <Field name="image" className="col-span-2">
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
                                      <span className="font-semibold">
                                        Arquivo:
                                      </span>{" "}
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
                            <FileImagePreview
                              defaultValue={subevent?.imageUrl || ""}
                            />
                          </div>
                          <ErrorMessage />
                        </Field>
                        <Field
                          className="col-span-2 lg:col-span-2"
                          name="description"
                        >
                          <Label>Descrição da Etapa</Label>
                          <RichTextEditor />
                          <ErrorMessage />
                        </Field>
                      </FieldGroup>
                    </Fieldset>
                    <Description>ID: {form.getValues("id")}</Description>
                  </>
                ),
                title: "Geral",
              },
              {
                content: (
                  <div>
                    <SubeventControl
                      eventGroup={eventGroup}
                      eventId={subevent.id}
                      organization={organization}
                    />
                  </div>
                ),
                title: "Realização",
              },
            ]}
          />
        </DialogBody>
        <DialogActions>
          <Button
            color="white"
            onClick={() => modalState.setIsModalOpen(false)}
          >
            Cancelar
          </Button>
          <SubmitButton color={primaryColor?.tw.color}>
            {subevent ? "Salvar" : "Criar"}
          </SubmitButton>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
