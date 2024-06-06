"use client";
import { upsertEvent } from "@/app/api/events/action";
import { upsertEventDto } from "@/app/api/events/dto";
import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Form,
  Input,
  Label,
  Textarea,
  showToast,
  useAction,
  useForm,
  useMocker,
  useSteps,
} from "odinkit/client";
import { useEffect, useMemo, useRef } from "react";
import {
  Steps,
  BottomNavigation,
  SubmitButton,
  FileImagePreview,
  Text,
  Divider,
} from "odinkit";

import { z } from "odinkit";
import { uploadFiles } from "@/app/api/uploads/action";
import { usePanel } from "../../../_shared/components/PanelStore";
import EventInfo from "./EventInfo";
import SportInfo from "./SportInfo";
import { Organization } from "@prisma/client";
import { RTE } from "../../../_shared/RichText";

export default function NewEventForm({
  organization,
}: {
  organization: Organization;
}) {
  const form = useForm({
    mode: "onChange",
    schema: upsertEventDto
      .omit({ imageUrl: true })
      .merge(z.object({ image: z.array(z.any()).optional() })),
    defaultValues: {
      name: "",
      location: "",
      description: "",
      rules: "",
      slug: "",
    },
  });

  const topRef = useRef(null!);
  const stepRefs = useRef<HTMLDivElement[]>([]);

  const { data, isMutating, trigger } = useAction({
    action: upsertEvent,
    onSuccess: () => {
      showToast({
        message: "Evento criado com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        title: "Erro",
        variant: "error",
      });
    },
    redirect: true,
  });

  const Field = useMemo(() => form.createField(), []);
  const steps = [
    { title: "Geral", content: <EventInfo Field={Field} /> },
    {
      title: "Esportivo",
      content: <SportInfo Field={Field} />,
    },
  ];

  const mocker = useMocker({
    form,
    data: () => ({
      name: "Evento de Teste",
      location: "Rua 3",
      dateStart: "01/01/2024",
      dateEnd: "02/01/2024",
      description:
        "Informações gerais do evento, aparecerão em destaque na página.",
      rules:
        "Regras do evento, aparecerão na página principal e durante a inscrição.",
      slug: "exemplo",
    }),
  });

  return (
    <Form
      hform={form}
      onSubmit={async (data) => {
        const { image, ...rest } = data;

        const uploadedFiles = await uploadFiles(
          [{ name: "image", file: image ? image[0] : [] }],
          "events/"
        );

        await trigger({ ...rest, imageUrl: uploadedFiles?.image?.url });
      }}
    >
      <Fieldset className=" rounded-lg bg-opacity-50 px-4 lg:pb-4">
        <FieldGroup>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Field name="name">
              <Label>Nome do Evento</Label>
              <Input placeholder="10 KM da Rua 3" />
              <ErrorMessage />
            </Field>
            <Field name="location">
              <Label>Local</Label>
              <Input placeholder="Rua 3" />
              <ErrorMessage />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field name="dateStart">
              <Label>Início</Label>
              <Input mask={"99/99/9999"} placeholder="01/01/2024" />
              <ErrorMessage />
            </Field>
            <Field name="dateEnd">
              <Label>Término</Label>
              <Input mask={"99/99/9999"} placeholder="02/01/2024" />
              <ErrorMessage />
            </Field>
          </div>
          <Field name="slug">
            <Label>Link do evento</Label>
            <Input />
            <Description>
              {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1] +
                "/org/evento/" +
                form.watch("slug")}
            </Description>
            <ErrorMessage />
          </Field>
          <Field name="description">
            <Label>Descrição do Evento</Label>
            <RTE />
            <ErrorMessage />
          </Field>
          <Field name="image">
            <Label>Capa do Evento</Label>
            <div className="my-3 flex justify-center ">
              <FileImagePreview />
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
                            form.resetField("image");
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
          </Field>
        </FieldGroup>
      </Fieldset>

      <div className="sticky bottom-0 z-50 space-y-2 bg-white dark:bg-zinc-900">
        <Divider />
        <div className="flex justify-end">
          <SubmitButton>Criar</SubmitButton>
        </div>
      </div>
    </Form>
  );
}
