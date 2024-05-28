"use client";
import {
  Alert,
  AlertActions,
  AlertBody,
  AlertDescription,
  AlertTitle,
  Button,
  Description,
  Form,
  Input,
} from "odinkit/client";
import { useContext, useMemo, useState } from "react";
import { AbsencesPageContext } from "../context/AbsencesPage.ctx";
import { SubmitButton, Text } from "odinkit";
import { EyeIcon } from "@heroicons/react/24/outline";

export function DenyJustificationAlert() {
  const {
    modalVisibility,
    handleModalClose,
    selectedAbsence,
    form,
    triggerAbsenceStatus,
    triggerReadAbsenceJustificationData,
  } = useContext(AbsencesPageContext);

  const Field = useMemo(() => form.createField(), []);
  return (
    <>
      <Alert open={modalVisibility} onClose={handleModalClose} size="sm">
        <AlertTitle>
          Reprovar Atestado - {selectedAbsence?.registration.user.fullName}
        </AlertTitle>
        <AlertDescription>
          Você pode adicionar uma razão para a reprovação do atestado
          (opcional).
        </AlertDescription>
        <Form hform={form} onSubmit={(data) => triggerAbsenceStatus(data)}>
          <AlertBody>
            <Field name="comment">
              <Input />
            </Field>

            <Description className={"hidden lg:block"}>
              <span className={"text-xs"}>ID: {selectedAbsence?.id}</span>
            </Description>
          </AlertBody>
          <AlertActions>
            {selectedAbsence?.justificationUrl && (
              <div className="hidden lg:flex ">
                <Button
                  className={"w-full"}
                  plain
                  onClick={() =>
                    triggerReadAbsenceJustificationData({
                      id: selectedAbsence?.id,
                    })
                  }
                >
                  <EyeIcon className="h-5 w-5" />
                  Rever
                </Button>
              </div>
            )}

            <Button outline onClick={handleModalClose}>
              Cancelar
            </Button>
            <SubmitButton>Enviar</SubmitButton>
          </AlertActions>
        </Form>
      </Alert>
    </>
  );
}
