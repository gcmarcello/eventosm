import {
  Alert,
  AlertActions,
  AlertBody,
  AlertTitle,
  Button,
} from "odinkit/client";
import { Dispatch, SetStateAction, useState } from "react";

export default function SafetyAlert({
  isSafetyDisclaimerOpen,
  setIsSafetyDisclaimerOpen,
}: {
  isSafetyDisclaimerOpen: boolean;
  setIsSafetyDisclaimerOpen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <Alert
      size="3xl"
      open={isSafetyDisclaimerOpen}
      onClose={setIsSafetyDisclaimerOpen}
    >
      <AlertTitle>Segurança no Upload de Documentos</AlertTitle>

      <AlertBody>
        <div className="text-sm text-zinc-800">
          <div className="flex flex-col gap-2">
            <p>
              Ao enviar seus documentos, garantimos total segurança através de
              um método chamado 'URL Pré-Assinada'.
            </p>
            <p>
              Isso quer dizer que cada documento é armazenado em nosso servidor
              de uma maneira que permite o acesso somente através de um link
              temporário exclusivo, que só pode ser criado por você, o
              proprietário do documento, ou o organizador que necessita
              acessá-lo.
            </p>
          </div>

          <p className="mt-3 font-semibold">
            Conte com a gente para manter suas informações seguras!
          </p>
        </div>
      </AlertBody>
      <AlertActions>
        <Button plain onClick={() => setIsSafetyDisclaimerOpen(false)}>
          Entendi.
        </Button>
      </AlertActions>
    </Alert>
  );
}
