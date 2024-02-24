import { readEventGroups, upsertEventGroup } from "@/app/api/events/action";
import { upsertEventGroupDto } from "@/app/api/events/dto";
import { uploadFiles } from "@/app/api/uploads/action";
import { ExtractSuccessResponse, FileImagePreview, Text } from "odinkit";
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
  Legend,
  Radio,
  RadioField,
  RadioGroup,
  TinyMCE,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useMemo } from "react";
import { z } from "zod";

export async function GeralForm({
  eventGroup,
}: {
  eventGroup: ExtractSuccessResponse<typeof readEventGroups>[0];
}) {
  const form = useForm({
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
        message: error,
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

        trigger({ ...rest, imageUrl: uploadedFiles?.file?.url });
      }}
      id="generalEventGroupForm"
    >
      <Fieldset>
        <Legend>Informações Gerais</Legend>
        <Text>
          Informações gerais sobre o grupo de eventos. Você pode alterar essas
          informações a qualquer momento.
        </Text>
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
                  <Radio color="emerald" value="individual" />
                  <Label>Individual</Label>
                  <Description>
                    Inscrições podem ser feitas apenas por atletas.
                  </Description>
                </RadioField>
                <RadioField>
                  <Radio color="emerald" value="team" />
                  <Label>Equipes</Label>
                  <Description>
                    Inscrições podem ser feitas apenas por equipes.
                  </Description>
                </RadioField>
                <RadioField>
                  <Radio color="emerald" value="mixed" />
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
                <FileImagePreview defaultValue={eventGroup.imageUrl || ""} />
              </div>
            </Field>
          </div>
        </FieldGroup>

        <FieldGroup className="grid grid-cols-4 gap-8">
          <div className="col-span-4">
            <Field name="description">
              <Label>Descrição do Grupo de Eventos</Label>
              <TinyMCE />
            </Field>
          </div>
          <div className="col-span-4">
            <Field name="rules">
              <Label>Regulamento do Grupo de Eventos</Label>
              <TinyMCE />
            </Field>
          </div>
          <div className="col-span-4">
            <Field name="details">
              <Label>Detalhes do Grupo de Eventos</Label>
              <TinyMCE />
            </Field>
          </div>
        </FieldGroup>
      </Fieldset>
    </Form>
  );
}
