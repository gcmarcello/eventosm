import { usePanel } from "@/app/(frontend)/admin/_shared/components/PanelStore";
import { CategoryPageContext } from "@/app/(frontend)/painel/eventos/_shared/components/categories/context/CategoryPage.ctx";
import { upsertCategoryDocuments } from "@/app/api/categories/action";
import { nestUpload } from "@/app/api/uploads/action";
import clsx from "clsx";
import { For, Link, Table, SubmitButton, Text } from "odinkit";
import {
  Button,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  ErrorMessage,
  FileDropArea,
  FileInput,
  Form,
  Input,
  Label,
  Select,
  showToast,
  useAction,
} from "odinkit/client";
import { useContext, useMemo, useState } from "react";
import { useFieldArray } from "react-hook-form";

export default function ModalityCategoryModal() {
  const { categoryDocumentForm, selectedCategory, setSelectedCategory } =
    useContext(CategoryPageContext);

  const { fields, append } = useFieldArray({
    control: categoryDocumentForm.control,
    name: "documents",
  });

  const { trigger } = useAction({
    action: upsertCategoryDocuments,
    onSuccess: () =>
      showToast({
        message: "Documentos atualizados com sucesso!",
        variant: "success",
      }),
  });

  const Field = useMemo(() => categoryDocumentForm.createField(), []);

  if (!selectedCategory) return null;

  return (
    <>
      <Dialog
        size="5xl"
        open={!!selectedCategory}
        onClose={() => {
          setSelectedCategory(undefined);
        }}
      >
        <Form
          hform={categoryDocumentForm}
          onSubmit={async (data) => {
            const documentArray = [];
            for (const document of data.documents) {
              if (document.template) {
                const response = await nestUpload({
                  files: [
                    { file: document.template[0] as File, name: document.name },
                  ],
                  folder: "templates/",
                });
                documentArray.push({ ...document, template: response[0]?.key });
              }
            }
            trigger({ documents: documentArray });
          }}
        >
          <DialogTitle onClose={() => setSelectedCategory(undefined)}>
            Documentos - {selectedCategory?.name}
          </DialogTitle>
          <DialogDescription>
            Estes documentos serão obrigatórios para inscrições desta categoria.
          </DialogDescription>
          <DialogBody className="overflow-x-auto lg:max-h-none lg:overflow-x-hidden">
            <div className="divide-y">
              <For each={fields} identifier="category">
                {(item, index) => (
                  <div className="my-2 py-2">
                    <Field name={`documents.${index}.type`}>
                      <Label>Tipo do Documento</Label>
                      <Select
                        data={[
                          {
                            name: "Autorização de Menor",
                            id: "minorAuthorization",
                          },
                          { name: "Aptidão Física", id: "physicalAptitude" },
                          { name: "Laudo PCD", id: "disability" },
                          { name: "Outros", id: "others" },
                        ]}
                        valueKey="id"
                        displayValueKey="name"
                      />
                    </Field>

                    {categoryDocumentForm.watch(`documents.${index}.type`) ===
                      "others" && (
                      <Field name={`documents.${index}.name`}>
                        <Label>Nome do Documento</Label>
                        <Input placeholder="Ex.: RG" />
                      </Field>
                    )}

                    <Field name={`documents.${index}.template`}>
                      <Label>Template</Label>
                      <FileInput
                        fileTypes={["pdf", "doc", "docx"]}
                        maxFiles={1}
                        maxSize={1}
                        validate={(files) => {
                          return true;
                        }}
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
                        <FileDropArea />
                        <ErrorMessage />
                      </FileInput>
                      <Description>
                        Tipos permitidos: PDF, DOCX, DOC
                      </Description>
                      {selectedCategory?.CategoryDocument?.[index]
                        ?.template && (
                        <Link
                          target="_blank"
                          href={`${process.env.NEXT_PUBLIC_BUCKET_URL}/templates/${selectedCategory?.CategoryDocument?.[index]?.template}`}
                        >
                          <Text>Ver Arquivo</Text>
                        </Link>
                      )}
                    </Field>
                  </div>
                )}
              </For>
            </div>
            <Button
              onClick={() =>
                append({
                  categoryId: selectedCategory.id,
                  type: "others",
                })
              }
            >
              Adicionar Documento
            </Button>
          </DialogBody>
          <DialogActions>
            <SubmitButton>Salvar</SubmitButton>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
