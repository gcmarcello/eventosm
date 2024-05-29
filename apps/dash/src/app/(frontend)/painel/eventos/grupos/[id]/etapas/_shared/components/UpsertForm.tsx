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
  Link,
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
  Heading,
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
import { EventGroupWithEvents } from "prisma/types/Events";
import { OrganizationWithDomain } from "prisma/types/Organization";
import { upsertEvent } from "@/app/api/events/action";
import { uploadFiles } from "@/app/api/uploads/action";
import { RTE } from "@/app/(frontend)/painel/_shared/RichText";

const schema = upsertEventDto
  .omit({ imageUrl: true })
  .merge(z.object({ image: z.array(z.any()).optional() }));

export type Schema = z.infer<typeof schema>;

export function UpsertForm({
  organization,
  subevent,
  eventGroup,
}: {
  eventGroup: EventGroupWithEvents;
  organization: OrganizationWithDomain;
  subevent?: Event | undefined;
}) {
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
      description: subevent?.description || "",
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

  return (
    <Form hform={form} onSubmit={trigger} className="pb-20 pt-4 lg:pb-4">
      <div className="flex w-full justify-between">
        <div className="mb-3 items-center gap-3 lg:flex">
          <Heading>Resultados - {subevent?.name}</Heading>
          <Link
            className="text-sm"
            style={{
              color: organization.options.colors.primaryColor.hex,
            }}
            href={`/painel/eventos/grupos/${eventGroup.id}/etapas`}
          >
            Voltar à lista de etapas
          </Link>
        </div>
      </div>
      <Fieldset>
        <div className={"grid grid-cols-2 gap-3 lg:divide-x"}>
          <FieldGroup className="col-span-2 gap-2 lg:col-span-1">
            <Field className="col-span-2 lg:col-span-1" name="name">
              <Label>Nome do Evento</Label>
              <Input placeholder="10 KM da Rua 3" />
              <ErrorMessage />
            </Field>
            <Field className="col-span-2 lg:col-span-1" name="location">
              <Label>Local</Label>
              <Input placeholder="Rua 3" />
              <ErrorMessage />
            </Field>
            <Field className="col-span-2 lg:col-span-1" name="dateStart">
              <Label>Início do Evento</Label>
              <Input mask={"99/99/9999"} placeholder="01/01/2024" />
              <ErrorMessage />
            </Field>
            <Field className="col-span-2 lg:col-span-1" name="dateEnd">
              <Label>Término do Evento</Label>
              <Input mask={"99/99/9999"} placeholder="02/01/2024" />
              <ErrorMessage />
            </Field>
          </FieldGroup>
          <FieldGroup className="col-span-2 lg:col-span-1 lg:px-3">
            <Field name="image" className="col-span-2">
              <Label>Capa do Evento</Label>
              <div className="my-3 flex justify-center">
                <FileImagePreview defaultValue={subevent?.imageUrl || ""} />
              </div>
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

              <ErrorMessage />
            </Field>
          </FieldGroup>
        </div>
        <FieldGroup className="col-span-2">
          <Field className="col-span-2 lg:col-span-2" name="description">
            <Label>Descrição da Etapa</Label>
            <RTE />
            <ErrorMessage />
            <Description>ID: {form.getValues("id")}</Description>
          </Field>
        </FieldGroup>
        <div className="col-span-2 flex  justify-end">
          <SubmitButton
            className={"w-full"}
            color={organization.options.colors.primaryColor.tw.color}
          >
            Salvar
          </SubmitButton>
        </div>
      </Fieldset>
    </Form>
  );
}
