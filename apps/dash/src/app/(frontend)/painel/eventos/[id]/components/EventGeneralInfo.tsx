"use client";
import { upsertEventDto } from "@/app/api/events/dto";
import dayjs from "dayjs";
import {
  Description,
  ErrorMessage,
  Fieldset,
  Label,
  Form,
  useForm,
  Select,
  Textarea,
  Input,
  showToast,
  useAction,
  RichTextEditor,
  FileInput,
  FileDropArea,
  FieldGroup,
  Checkbox,
} from "odinkit/client";
import { FileImagePreview, Heading, SubmitButton, Text, z } from "odinkit";
import { EventWithRegistrationCount } from "prisma/types/Events";
import { useMemo } from "react";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone"; // dependent on utc plugin
import { upsertEvent } from "@/app/api/events/action";
import { uploadFiles } from "@/app/api/uploads/action";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function EventGeneralInfo({
  event,
}: {
  event: EventWithRegistrationCount;
}) {
  const form = useForm({
    mode: "onChange",
    schema: upsertEventDto
      .omit({ imageUrl: true })
      .merge(z.object({ image: z.array(z.any()).optional() })),
    defaultValues: {
      name: event.name,
      location: event.location,
      description: event.description ?? "",
      rules: event.rules ?? "",
      dateEnd: dayjs(event.dateEnd).utc().format("DD/MM/YYYY"),
      dateStart: dayjs(event.dateStart).utc().format("DD/MM/YYYY"),
      slug: event.slug,
      id: event.id,
    },
  });

  const {
    data: generalInfo,
    trigger: generalInfoTrigger,
    isMutating,
  } = useAction({
    action: upsertEvent,
    redirect: true,
    onSuccess: () => {
      showToast({
        message: "Informações gerais atualizadas com sucesso!",
        title: "Sucesso",
        variant: "success",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message || "Erro ao atualizar informações gerais",
        title: "Erro!",
        variant: "error",
      });
    },
  });

  const Field = useMemo(() => form.createField(), []);
  return (
    <Form
      hform={form}
      onSubmit={async (data) => {
        const { image, ...rest } = data;

        if (!image)
          return await generalInfoTrigger({
            ...rest,
            imageUrl: event.imageUrl ?? "",
          });

        const uploadedFiles = await uploadFiles(
          [{ name: "image", file: image ? image[0] : [] }],
          "events/"
        );

        await generalInfoTrigger({
          ...rest,
          imageUrl: uploadedFiles?.image?.url,
        });
      }}
    >
      <div className="flex justify-end">
        <SubmitButton>Salvar</SubmitButton>
      </div>
      <Fieldset className="grid grid-cols-2 gap-x-4 gap-y-4">
        <FieldGroup className="col-span-2 lg:col-span-1">
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
          <div className="grid grid-cols-2 gap-3">
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
          </div>

          <Field className="col-span-2 lg:col-span-1" name="slug">
            <Label>Link do Evento</Label>
            <Input />
            <ErrorMessage />
            <Description className="flex gap-1">
              Letras minúsculas, números e hífens.
            </Description>
            <Text className="text-wrap italic">
              {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1]}/org/
              {form.watch("slug")}
            </Text>
          </Field>
        </FieldGroup>

        <FieldGroup className="col-span-2 lg:col-span-1">
          <Heading>Opções do Evento</Heading>
          <Field enableAsterisk={false} name="options.accountlessRegistration">
            <Checkbox />
            <Label className={"ms-3"}>Inscrição sem conta</Label>

            <ErrorMessage />
            <Description>
              O sistema criará uma conta no ato da inscrição, porém o usuário só
              terá acesso ao site depois de confirmá-la.
            </Description>
          </Field>
          <Field enableAsterisk={false} name="options.accountlessRegistration">
            <Checkbox />
            <Label className={"ms-3"}>Múltiplas inscrições por usuário</Label>

            <ErrorMessage />
            <Description>
              Permite que um usuário faça inscrições em mais de uma categoria.
            </Description>
          </Field>
          <Field name="image">
            <Label>Capa do Evento</Label>
            <div className="my-3 flex justify-center ">
              <FileImagePreview defaultValue={event.imageUrl || ""} />
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
        <Field className="col-span-2" name="description">
          <Label>Descrição do Evento</Label>
          <RichTextEditor />
          <ErrorMessage />
        </Field>
        <Field className="col-span-2" name="rules">
          <Label>Regulamento do Evento</Label>
          <RichTextEditor />
          <ErrorMessage />
        </Field>
      </Fieldset>
    </Form>
  );
}
