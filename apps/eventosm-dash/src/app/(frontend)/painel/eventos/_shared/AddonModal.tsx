import { upsertEventAddon } from "@/app/api/products/action";
import { upsertEventAddonDto } from "@/app/api/products/dto";
import { uploadFiles } from "@/app/api/uploads/action";

import { EventAddon } from "@prisma/client";
import { FileImagePreview, For, SubmitButton, Text } from "odinkit";
import {
  Button,
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
  Input,
  Label,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { useEffect, useMemo } from "react";
import { z } from "zod";
import { usePanel } from "../../_shared/components/PanelStore";
import { useFieldArray } from "react-hook-form";
import { PlusIcon } from "@heroicons/react/24/solid";

const schema = upsertEventAddonDto.omit({ image: true }).merge(
  z.object({
    image: z.array(z.any()).optional(),
  })
);
type Schema = z.infer<typeof schema>;

export default function AddonModal({
  isOpen,
  setIsOpen,
  addon,
  eventGroupId,
  eventId,
}: {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  addon?: EventAddon | null;
  eventGroupId?: string;
  eventId?: string;
}) {
  const form = useForm({
    schema,
    mode: "onChange",
    defaultValues: {
      options: [],
    },
  });

  const { append, remove, fields } = useFieldArray({
    name: "options" as any, //@todo: fix this
    control: form.control,
  });

  const {
    colors: { primaryColor, secondaryColor },
  } = usePanel();

  useEffect(() => {
    form.reset({
      description: addon?.description || "",
      name: addon?.name,
      price: addon?.price.toFixed(2).replace(".", ",") || "",
      eventGroupId: eventGroupId,
      options:
        (addon?.options as string[])?.map((option) => ({
          name: option,
        })) || [],
      eventId: eventId,
      id: addon?.id,
    });
  }, [addon]);

  const { isMutating, data, trigger } = useAction({
    action: upsertEventAddon,
    prepare: async (data: Schema) => {
      if (!data.image) {
        return { ...data, image: addon?.image || undefined };
      }

      const uploadedFiles = await uploadFiles(
        [{ name: "image", file: data.image ? data.image[0] : [] }],
        "events/addons/"
      );

      console.log({ ...data, image: uploadedFiles?.image?.url });
      return { ...data, image: uploadedFiles?.image?.url };
    },
    onSuccess: (data) => {
      setIsOpen(false);
      showToast({
        message: "Kit atualizado com sucesso.",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({
        message: error,
        variant: "error",
        title: "Erro!",
      });
    },
  });

  const Field = useMemo(() => form.createField(), []);
  return (
    <Form hform={form} onSubmit={(data) => trigger(data)}>
      <Dialog size="4xl" open={isOpen} onClose={setIsOpen}>
        <DialogTitle>
          {form.getValues("id") ? "Editar" : "Criar"} Kit
        </DialogTitle>
        <DialogDescription>{addon?.name}</DialogDescription>
        <DialogBody>
          <Fieldset>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 lg:col-span-1">
                <FieldGroup>
                  <Field name="name">
                    <Label>Nome</Label>
                    <Input />
                    <ErrorMessage />
                  </Field>
                  <Field name="description">
                    <Label>Descrição</Label>
                    <Input />
                    <ErrorMessage />
                  </Field>
                  <Field name="price">
                    <Label>Preço</Label>
                    <Input />
                    <ErrorMessage />
                  </Field>
                </FieldGroup>
              </div>

              <div className="col-span-2 lg:col-span-1">
                <FieldGroup>
                  <Field name="image">
                    <Label>Imagem do Kit</Label>
                    <div className="flex flex-col justify-between lg:flex-row">
                      <FileInput
                        className={"flex"}
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
                          className="max-w-32"
                          defaultValue={addon?.image || ""}
                        />
                      </div>
                    </div>
                  </Field>
                </FieldGroup>
              </div>
              <FieldGroup className="col-span-2 lg:col-span-1">
                <For each={fields}>
                  {(field, index) => (
                    <Field name={`options.${index}.name`}>
                      <Label>Opção {index + 1}</Label>
                      <Input />
                    </Field>
                  )}
                </For>
              </FieldGroup>
            </div>
          </Fieldset>
        </DialogBody>
        <DialogActions className="lg:justify-between">
          <Button className="flex gap-2 " onClick={() => append({ name: "" })}>
            <PlusIcon className="size-5" />
            Adicionar Opção
          </Button>
          <div className="flex justify-between gap-2">
            <Button plain onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton color={primaryColor?.tw.color}>Salvar</SubmitButton>
          </div>
        </DialogActions>
      </Dialog>
    </Form>
  );
}
