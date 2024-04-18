import { getClientEnv } from "@/app/(frontend)/env";
import { UpsertEventDto } from "@/app/api/events/dto";
import { FileImagePreview, Text } from "odinkit";
import {
  Description,
  ErrorMessage,
  FieldGroup,
  Fieldset,
  FileDropArea,
  FileInput,
  Input,
  Label,
  Textarea,
  showToast,
  useFormContext,
} from "odinkit/client";
import { format } from "path";

export default function EventInfo({ Field }: { Field: any }) {
  const form = useFormContext();
  return (
    <Fieldset className=" rounded-lg bg-opacity-50 px-4 lg:pb-4">
      <FieldGroup>
        <div className="grid grid-cols-2 gap-x-4 lg:gap-y-4">
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
          <Field className="col-span-2 lg:col-span-1" name="description">
            <Label>Descrição do Evento</Label>
            <Textarea placeholder="Informações gerais do evento, aparecerão em destaque na página." />
            <ErrorMessage />
          </Field>
          <Field className="col-span-2 lg:col-span-1" name="slug">
            <Label>Link do evento</Label>
            <Input />
            <Description>
              {process.env.NEXT_PUBLIC_SITE_URL?.split("//")[1] +
                "/org/" +
                form.watch("slug")}
            </Description>
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
        </div>
      </FieldGroup>
    </Fieldset>
  );
}
