"use client";
import {
  updateOrganization,
  updateOrganizationStyle,
} from "@/app/api/orgs/action";
import { updateOrganizationStyleDto } from "@/app/api/orgs/dto";
import { uploadFiles } from "@/app/api/uploads/action";
import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Organization } from "@prisma/client";
import { FileImagePreview, SubmitButton, Text, z } from "odinkit";
import {
  ColorInput,
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
  showToast,
  useAction,
  useForm,
  useFormContext,
} from "odinkit/client";
import { useMemo } from "react";

const schema = updateOrganizationStyleDto.omit({ images: true }).merge(
  z.object({
    images: z
      .object({
        bg: z.array(z.any()).optional(),
        hero: z.array(z.any()).optional(),
        logo: z.array(z.any()).optional(),
      })
      .optional(),
  })
);

export default function PersonalizationSection({
  organization,
}: {
  organization: Organization;
}) {
  const form = useForm({
    mode: "onChange",
    schema,
    defaultValues: {
      primaryColor: organization.options?.colors.primaryColor.id,
      secondaryColor: organization.options?.colors.secondaryColor.id,
      tertiaryColor: organization.options?.colors.tertiaryColor.id,
    },
  });
  const { data, trigger, isMutating } = useAction({
    action: updateOrganizationStyle,
    onSuccess: () => {
      showToast({
        message: "Configurações de estilo atualizadas com sucesso.",
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
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <Form
        hform={form}
        className="space-y-4"
        onSubmit={async (data) => {
          const { images, ...rest } = data;
          let hero;
          let bg;
          let logo;

          if (images?.hero) {
            hero = await uploadFiles(
              [{ name: "file", file: images?.hero ? images?.hero[0] : [] }],
              "org/hero/"
            );
          }

          if (images?.bg) {
            bg = await uploadFiles(
              [{ name: "file", file: images?.bg ? images?.bg[0] : [] }],
              "org/bg/"
            );
          }

          if (images?.logo) {
            logo = await uploadFiles(
              [{ name: "file", file: images?.logo ? images?.logo[0] : [] }],
              "org/logo/"
            );
          }

          await trigger({
            ...rest,
            images: {
              hero: hero?.file?.url,
              bg: bg?.file?.url,
              logo: logo?.file?.url,
            },
          });
        }}
      >
        <Fieldset className=" grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border bg-opacity-50 px-4 py-4 shadow-sm lg:pb-4">
          <FieldGroup className="space-y-2">
            <Field name="primaryColor">
              <Label>Cor Primária</Label>
              <ColorInput />
              <Description className="flex gap-1">
                Usada na barra do painel e menus da organização.
              </Description>
            </Field>
            <Field name="secondaryColor">
              <Label>Cor Primária</Label>
              <ColorInput />
              <Description className="flex gap-1">
                Usada no rodapé dos menus da organização e botões públicos.
              </Description>
            </Field>
            <Field name="tertiaryColor">
              <Label>Cor Primária</Label>
              <ColorInput />
              <Description className="flex gap-1">
                Usada em botões e outras áreas.
              </Description>
            </Field>
            <Field name="images.logo">
              <Label>Logo da Organização</Label>
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
                    form.watch("images.logo")?.length &&
                    form.watch("images.logo")?.[0] ? (
                      <>
                        <Text>
                          <span className="font-semibold">Arquivo:</span>{" "}
                          {form.watch("images.logo")?.[0]?.name}
                          <span
                            onClick={() => {
                              form.resetField("images.logo");
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
                  defaultValue={organization.options?.images?.logo || ""}
                />
              </div>
            </Field>
            <Field name="images.hero">
              <Label>Capa da Organização</Label>
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
                    form.watch("images.hero")?.length ? (
                      <>
                        <Text>
                          <span className="font-semibold">Arquivo:</span>{" "}
                          {form.watch("images.logo")?.[0]?.name}
                          <span
                            onClick={() => {
                              form.resetField("images.hero");
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
                  defaultValue={organization.options?.images?.hero || ""}
                />
              </div>
            </Field>
            <Field name="images.bg">
              <Label>Imagem de Fundo da Organização</Label>
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
                    form.watch("images.bg")?.length &&
                    form.watch("images.bg")?.[0] ? (
                      <>
                        <Text>
                          <span className="font-semibold">Arquivo:</span>{" "}
                          {form.watch("images.logo")?.[0]?.name}
                          <span
                            onClick={() => {
                              form.resetField("images.bg");
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
                  defaultValue={organization.options?.images?.bg || ""}
                />
              </div>
            </Field>
            <SubmitButton>Salvar</SubmitButton>
          </FieldGroup>
        </Fieldset>
      </Form>
    </>
  );
}
