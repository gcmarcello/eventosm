"use client";
import { readEventGroups, upsertEventGroup } from "@/app/api/events/action";
import { upsertEventGroupDto } from "@/app/api/events/dto";
import { uploadFiles } from "@/app/api/uploads/action";
import { Color, EventGroup } from "@prisma/client";
import {
  Container,
  ExtractSuccessResponse,
  FileImagePreview,
  SubmitButton,
  Text,
} from "odinkit";
import {
  Button,
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Form,
  Input,
  Label,
  Legend,
  Radio,
  RadioField,
  RadioGroup,
  RichTextEditor,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useMemo } from "react";
import { z } from "odinkit";

export default function GeralForm({
  eventGroup,
  color,
}: {
  color: Color;
  eventGroup: EventGroup;
}) {
  const form = useForm({
    id: "generalEventGroupForm",
    schema: upsertEventGroupDto.omit({ imageUrl: true }).merge(
      z.object({
        file: eventGroup.imageUrl
          ? z.array(z.any()).optional()
          : z.array(z.any()),
      })
    ),
    mode: "onChange",
    defaultValues: {
      id: eventGroup.id,
      name: eventGroup.name,
      slug: eventGroup.slug,
      location: eventGroup.location || "",
      description: eventGroup.description || "",
      rules: eventGroup.rules || "",
      details: eventGroup.details || "",
      registrationType: eventGroup.registrationType,
      eventGroupType: eventGroup.eventGroupType,
    },
  });

  const Field = useMemo(() => form.createField(), []);

  const { data, trigger, isMutating } = useAction({
    action: upsertEventGroup,
    onSuccess: (res) => {
      showToast({
        message: res.message || "Sucesso",
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

  return (
    <Form
      hform={form}
      onSubmit={async (data) => {
        const { file, ...rest } = data;

        const uploadedFiles = await uploadFiles(
          [{ name: "file", file: file ? file[0] : [] }],
          "events/groups/"
        );

        await trigger({ ...rest, imageUrl: uploadedFiles?.file?.url });
      }}
    >
      <Fieldset>
        <div className="flex justify-between">
          <div>
            <Legend>Informações Gerais</Legend>
            <Text>
              Informações gerais sobre o grupo de eventos. Você pode alterar
              essas informações a qualquer momento.
            </Text>
          </div>
          <SubmitButton
            type="submit"
            className={"my-auto hidden lg:block"}
            color={color.tw.color}
          >
            Salvar
          </SubmitButton>
        </div>
        <FieldGroup className="grid grid-cols-2 gap-3 lg:divide-x ">
          <div className="col-span-2 space-y-3 px-2 lg:col-span-1">
            <Field name="name">
              <Label>Nome</Label>
              <Input />
              <ErrorMessage />
            </Field>
            <Field name="slug">
              <Label>Link do Grupo de Eventos</Label>
              <Input />
              <Description className={"text-sm"}>
                https://eventosm.com.br/eventos/
                <span className="font-semibold">{`${form.watch("slug") || "exemplo"}`}</span>
              </Description>
              <ErrorMessage />
            </Field>
            <Field name="location">
              <Label>Local do Grupo de Eventos</Label>
              <Input placeholder="São Paulo - SP" />
              <ErrorMessage />
            </Field>
            <Field enableAsterisk={false} name="registrationType">
              <Label>Estilo de Inscrição</Label>
              <RadioGroup>
                <RadioField>
                  <Radio color={color.tw.color} value="individual" />
                  <Label>Individual</Label>
                  <Description>
                    Inscrições podem ser feitas apenas por atletas.
                  </Description>
                </RadioField>
                <RadioField>
                  <Radio color={color.tw.color} value="team" />
                  <Label>Equipes</Label>
                  <Description>
                    Inscrições podem ser feitas apenas por equipes.
                  </Description>
                </RadioField>
                <RadioField>
                  <Radio color={color.tw.color} value="mixed" />
                  <Label>Mista</Label>
                  <Description>
                    Inscrições podem ser feitas por atletas ou equipes.
                  </Description>
                </RadioField>
              </RadioGroup>
            </Field>
          </div>
          <div className={"col-span-2 flex-col lg:col-span-1 lg:flex lg:ps-6"}>
            <Field name="file">
              <Label>Capa do Evento</Label>
              <div className="my-3 flex justify-center ">
                <FileImagePreview defaultValue={eventGroup.imageUrl || ""} />
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
                    form.watch("file")?.length ? (
                      <>
                        <Text>
                          <span className="font-semibold">Arquivo:</span>{" "}
                          {form.watch("file")?.[0].name}{" "}
                          <span
                            onClick={() => {
                              form.resetField("file");
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
          </div>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-4 gap-8">
          <div className="col-span-4">
            <Field name="description">
              <Label>Descrição do Grupo de Eventos</Label>
              <RichTextEditor />
            </Field>
          </div>
          <div className="col-span-4">
            <Field name="rules">
              <Label>Regulamento do Grupo de Eventos</Label>
              <RichTextEditor />
            </Field>
          </div>
          <div className="col-span-4">
            <Field name="details">
              <Label>Detalhes do Grupo de Eventos</Label>
              <RichTextEditor />
            </Field>
          </div>
        </FieldGroup>
      </Fieldset>
    </Form>
  );
}
