"use client";
import { createUserDocumentDto } from "@/app/api/users/dto";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import { ShieldCheckIcon } from "@heroicons/react/24/outline";
import {
  DialogBody,
  DialogActions,
  DialogTitle,
  Button,
  Dialog,
  DialogDescription,
  Input,
  Label,
  useForm,
  useAction,
  showToast,
  Form,
  FileInput,
  FileDropArea,
  ErrorMessage,
  Select,
  Description,
  Switch,
  Fieldset,
  FieldGroup,
} from "odinkit/client";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { createUserDocument } from "@/app/api/users/action";
import { uploadFiles } from "@/app/api/uploads/action";
import { SubmitButton, Text } from "odinkit";
import SafetyAlert from "./SafetyAlert";
import { upsertOrganizationDocument } from "@/app/api/orgs/action";
import { upsertOrganizationDocumentDto } from "@/app/api/orgs/dto";
import {
  Organization,
  OrganizationDocument,
  OrganizationDocumentStatus,
} from "@prisma/client";

export default function OrgDocumentModal({
  document,
  setIsOpen,
  isOpen,
  organization,
}: {
  document?: OrganizationDocument;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
  organization: Organization;
}) {
  const [isSafetyDisclaimerOpen, setIsSafetyDisclaimerOpen] = useState(false);

  const form = useForm({
    schema: upsertOrganizationDocumentDto.omit({ key: true }).merge(
      z.object({
        file: document?.id ? z.array(z.any()).optional() : z.array(z.any()),
      })
    ),
  });

  useEffect(() => {
    if (document) {
      form.setValue("type", document.type);
      form.setValue("name", document.name);
      form.setValue("description", document.description || undefined);
      form.setValue("id", document.id);
      form.setValue("highlight", document.highlight || false);
      form.setValue("status", document.status || "draft");
    } else form.reset();
  }, [document]);

  const Field = useMemo(() => form.createField(), []);

  const { data, trigger } = useAction({
    action: upsertOrganizationDocument,
    onSuccess: (data) => {
      setIsOpen(false);
      form.reset();
      showToast({
        message: data.message || "Documento enviado com sucesso.",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({
        message: error.message,
        variant: "error",
        title: "Erro!",
      });
    },
  });

  return (
    <>
      <Form
        hform={form}
        onSubmit={async (data) => {
          const { file, ...rest } = data;

          if (!file?.length && document?.key)
            return await trigger({
              ...rest,
              key: document.key,
            });

          const uploadedFiles = await uploadFiles(
            [{ name: "file", file: file ? file[0] : [] }],
            "orgdocuments/",
            true
          );

          if (!uploadedFiles?.file?.key)
            return showToast({
              message: "Erro ao enviar arquivo.",
              variant: "error",
              title: "Erro!",
            });

          await trigger({
            ...rest,
            key: uploadedFiles?.file?.key,
          });
        }}
      >
        <Dialog open={isOpen} onClose={setIsOpen}>
          <DialogTitle>Enviar Documento</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            <ShieldCheckIcon className="size-20 md:size-8" />{" "}
            <span>
              Seus documentos estão seguros pela tecnologia de URL Pré-Assinada.{" "}
              <span
                className="cursor-pointer underline"
                onClick={() => setIsSafetyDisclaimerOpen(true)}
              >
                Como funciona?
              </span>
            </span>
          </DialogDescription>
          <DialogBody className="mt-2">
            <SafetyAlert
              setIsSafetyDisclaimerOpen={setIsSafetyDisclaimerOpen}
              isSafetyDisclaimerOpen={isSafetyDisclaimerOpen}
            />
            <Fieldset>
              <FieldGroup>
                <Field name="name">
                  <Label>Nome do Documento</Label>
                  <Input />
                  <Description>
                    Utilize um nome que facilite a identificação do documento,
                    ele estará visível para os usuários.
                  </Description>
                  <ErrorMessage />
                </Field>
                <Field name="description">
                  <Label>Descrição</Label>
                  <Input />
                  <ErrorMessage />
                </Field>

                <Field variant="switch" name="highlight">
                  <Label>Destaque?</Label>
                  <Switch
                    color={organization.options.colors.primaryColor.tw.color}
                  />
                  <Description>
                    Esse documento será exibido em destaque na página de
                    documentos da organização.
                  </Description>
                  <ErrorMessage />
                </Field>
                <div className="grid gap-3 lg:grid-cols-2">
                  <Field name="status">
                    <Label>Status</Label>
                    <Select
                      data={[
                        { id: "draft", name: "Rascunho" },
                        { id: "published", name: "Publicado" },
                      ]}
                      displayValueKey="name"
                    />
                    <ErrorMessage />
                  </Field>
                  <Field name="type">
                    <Label>Tipo do Documento</Label>
                    <Select
                      data={[
                        { id: "general", name: "Geral" },
                        { id: "bid", name: "Edital de Licitação" },
                        { id: "contract", name: "Contrato" },
                      ]}
                      displayValueKey="name"
                    />
                    <ErrorMessage />
                  </Field>
                </div>
                <Field name="file">
                  <FileInput
                    fileTypes={["pdf", "docx"]}
                    maxFiles={1}
                    maxSize={3}
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
                  <ErrorMessage />
                </Field>
              </FieldGroup>
            </Fieldset>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton>
              {form.watch("id") ? "Salvar" : "Enviar"}
            </SubmitButton>
          </DialogActions>
        </Dialog>
      </Form>
    </>
  );
}
