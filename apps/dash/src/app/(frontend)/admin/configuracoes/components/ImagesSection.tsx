import { InformationCircleIcon } from "@heroicons/react/20/solid";
import { Organization } from "@prisma/client";
import { FileImagePreview, Text } from "odinkit";
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
import { useMemo } from "react";

export default function ImagesSection({
  organization,
}: {
  organization: Organization;
}) {
  const form = useFormContext();
  const Field = useMemo(() => form.createField(), []);
  return (
    <Fieldset className=" grid grid-cols-2 gap-x-4 gap-y-4 rounded-lg border bg-opacity-50 px-4 py-4 shadow-sm lg:pb-4">
      <FieldGroup className="col-span-2">
        <Legend>Imagens da Organização</Legend>
        {/* <Text>Informações secundárias.</Text> */}
      </FieldGroup>
      <Field name="images.logo">
        <Label>Logo da Organização</Label>
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
              form.watch("images.logo")?.length &&
              form.watch("images.logo")?.[0] ? (
                <>
                  <Text>
                    <span className="font-semibold">Arquivo:</span>{" "}
                    {form.watch("images.logo")?.[0]?.name ?? ""}
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
                message: error.message,
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
                message: error.message,
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
    </Fieldset>
  );
}
