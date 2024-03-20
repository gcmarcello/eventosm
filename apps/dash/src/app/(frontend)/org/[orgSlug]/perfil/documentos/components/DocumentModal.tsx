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
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  AlertBody,
  useForm,
  useAction,
  showToast,
  Form,
  FileInput,
  FileDropArea,
  ErrorMessage,
  Select,
  Description,
} from "odinkit/client";
import { useMemo, useState } from "react";
import { z } from "zod";
import SafetyAlert from "./SafetyAlert";
import { createUserDocument } from "@/app/api/users/action";
import { uploadFiles } from "@/app/api/uploads/action";
import { SubmitButton, Text } from "odinkit";

export default function DocumentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSafetyDisclaimerOpen, setIsSafetyDisclaimerOpen] = useState(false);

  const form = useForm({
    schema: createUserDocumentDto
      .omit({ key: true })
      .merge(z.object({ file: z.array(z.any()) })),
  });

  const Field = useMemo(() => form.createField(), []);

  const { data, trigger } = useAction({
    action: createUserDocument,
    onSuccess: () => {
      setIsOpen(false);
      showToast({
        message: "Documento enviado com sucesso!",
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
      <Button
        className={"w-full lg:w-auto"}
        type="button"
        onClick={() => setIsOpen(true)}
      >
        Novo documento
      </Button>
      <Form
        hform={form}
        onSubmit={async (data) => {
          const { file, ...rest } = data;

          const uploadedFiles = await uploadFiles(
            [{ name: "file", file: file ? file[0] : [] }],
            "documents/",
            true
          );

          if (!uploadedFiles?.file?.key)
            return showToast({
              message: "Erro ao enviar arquivo.",
              variant: "error",
              title: "Erro!",
            });

          console.log(uploadedFiles);

          await trigger({ ...rest, key: uploadedFiles?.file?.key });
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
          <DialogBody className="">
            <SafetyAlert
              setIsSafetyDisclaimerOpen={setIsSafetyDisclaimerOpen}
              isSafetyDisclaimerOpen={isSafetyDisclaimerOpen}
            />
            <div className="mt-2">
              <Field name="type">
                <Label>Tipo do Documento</Label>
                <Select
                  data={[
                    { id: "disability", name: "Laudo PCD" },
                    {
                      id: "physicalAptitude",
                      name: "Atestado de Aptidão Física",
                    },
                  ]}
                  displayValueKey="name"
                />
                <ErrorMessage />
              </Field>
              <Field name="name">
                <Label>Nome do Documento</Label>
                <Input />
                <Description>
                  O nome é opcional, mas pode ser útil para identificação.
                </Description>
                <ErrorMessage />
              </Field>
              <Field name="file">
                <FileInput
                  fileTypes={["pdf", "docx"]}
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
                <ErrorMessage />
                <Description className={"mt-3 font-semibold "}>
                  Não realize o envio de atestados de ausência por aqui. Eles
                  devem ser enviados através do painel da inscrição.
                </Description>
              </Field>
            </div>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <SubmitButton>Enviar</SubmitButton>
          </DialogActions>
        </Dialog>
      </Form>
    </>
  );
}
