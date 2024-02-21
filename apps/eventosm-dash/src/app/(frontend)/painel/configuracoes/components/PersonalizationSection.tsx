import { InformationCircleIcon } from "@heroicons/react/20/solid";
import FileImagePreview from "node_modules/odinkit/src/components/Form/File/FileImagePreview";
import { Text } from "odinkit";
import {
  ColorInput,
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Input,
  Label,
  Legend,
  showToast,
  useFormContext,
} from "odinkit/client";
import { OrganizationWithOptions } from "prisma/types/Organization";
import { useMemo } from "react";

export default function PersonalizationSection({
  organization,
}: {
  organization: OrganizationWithOptions;
}) {
  const form = useFormContext();
  const Field = useMemo(() => form.createField(), []);
  return (
    <Fieldset className=" grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border bg-opacity-50 px-4 py-4 shadow-sm lg:pb-4">
      <FieldGroup className="col-span-2">
        <Legend>Outras Configurações</Legend>
        <Text>Informações secundárias.</Text>
      </FieldGroup>
      <Field className="col-span-2 lg:col-span-1" name="abbreviation">
        <Label>Abreviação</Label>
        <Input placeholder="Ex: ESM para EventoSM" />
        <ErrorMessage />
        <Description className="flex gap-1">
          Usada em telas pequenas e locais diversos.
        </Description>
      </Field>
      <Field className="col-span-2 lg:col-span-1 " name="document">
        <Label>CNPJ</Label>
        <Input mask={"99.999.999/9999-99"} />
        <Text className="flex gap-1">
          <InformationCircleIcon className="h-5 w-5" /> O CNPJ é opcional
        </Text>
        <ErrorMessage />
      </Field>
      <Field name="primaryColor">
        <ColorInput />
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
                    {form.watch("images.logo")?.[0]?.name ?? ""}
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
              form.watch("images.hero")?.length &&
              form.watch("images.hero")?.[0] ? (
                <>
                  <Text>
                    <span className="font-semibold">Arquivo:</span>{" "}
                    {form.watch("images.hero")?.[0]?.name ?? ""}
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
                    {form.watch("images.bg")?.[0]?.name ?? ""}
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
          <FileImagePreview
            defaultValue={organization.options?.images?.bg || ""}
          />
        </div>
      </Field>
      {/* <Field className="col-span-1" name="options.primaryColor">
          <Label>Cor Principal</Label>
          <ColorInput />
          <Description className="flex gap-1">
            Usada na barra do painel e menus da organização.
          </Description>
          <ErrorMessage />
        </Field>
        <Field className="col-span-1" name="options.secondaryColor">
          <Label>Cor Secundária</Label>
          <ColorInput />
          <Description className="flex gap-1">
            Usada no rodapé dos menus da organização e botões públicos.
          </Description>
          <ErrorMessage />
        </Field> */}
    </Fieldset>
  );
}
