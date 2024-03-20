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
import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { z } from "zod";
import { createUserDocument } from "@/app/api/users/action";
import { uploadFiles } from "@/app/api/uploads/action";
import { SubmitButton, Text } from "odinkit";
import SafetyAlert from "./SafetyAlert";
import { createAbsenceJustificationDto } from "@/app/api/absences/dto";
import { updateAbsenceJustification } from "@/app/api/absences/action";
import { Event, EventAbsences } from "@prisma/client";

export default function AbsenceJustificationModal({
  showJustificationModal,
  setShowJustificationModal,
  absenceId,
  fetchCheckinsAndAbsences,
}: {
  showJustificationModal: boolean;
  setShowJustificationModal: Dispatch<SetStateAction<boolean>>;
  absenceId: string;
  fetchCheckinsAndAbsences: () => void;
}) {
  const [isSafetyDisclaimerOpen, setIsSafetyDisclaimerOpen] = useState(false);

  const form = useForm({
    schema: createAbsenceJustificationDto("client"),
    defaultValues: {
      absenceId,
    },
  });

  const Field = useMemo(() => form.createField(), []);

  const { data, trigger } = useAction({
    action: updateAbsenceJustification,
    onSuccess: () => {
      setShowJustificationModal(false);
      fetchCheckinsAndAbsences();
      showToast({
        message: "Atestado enviado com sucesso!",
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
          const { justification, ...rest } = data;

          const uploadedFiles = await uploadFiles(
            [{ name: "file", file: justification ? justification[0] : [] }],
            "justifications/",
            true
          );

          if (!uploadedFiles?.file?.key)
            return showToast({
              message: "Erro ao enviar arquivo.",
              variant: "error",
              title: "Erro!",
            });

          await trigger({ ...rest, justificationUrl: uploadedFiles.file.key });
        }}
      >
        <Dialog
          open={showJustificationModal}
          onClose={setShowJustificationModal}
        >
          <DialogTitle>Enviar Atestado</DialogTitle>
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
              <Field name="justification">
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
                      form.watch("justification")?.length ? (
                        <>
                          <Text>
                            <span className="font-semibold">Arquivo:</span>{" "}
                            {form.watch("justification")?.[0].name}{" "}
                            <span
                              onClick={() => {
                                form.resetField("justification");
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
              <span className={"mt-2 text-xs text-zinc-400"}>
                ID: {absenceId}
              </span>
            </div>
          </DialogBody>
          <DialogActions>
            <Button plain onClick={() => setShowJustificationModal(false)}>
              Cancelar
            </Button>
            <SubmitButton>Enviar</SubmitButton>
          </DialogActions>
        </Dialog>
      </Form>
    </>
  );
}
