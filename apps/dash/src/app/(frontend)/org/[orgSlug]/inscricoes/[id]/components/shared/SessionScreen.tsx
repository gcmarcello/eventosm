import {
  ClipboardDocumentCheckIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Heading, Text } from "odinkit";
import { Button } from "odinkit/client";
import { EventWithInfo } from "prisma/types/Events";
import { Dispatch, SetStateAction } from "react";

export default function SessionScreen({
  event,
  setShowSessionScreen,
}: {
  event: EventWithInfo;
  setShowSessionScreen: Dispatch<SetStateAction<boolean>>;
}) {
  return (
    <div className="p-4">
      <Heading>Iniciar Sessão</Heading>
      <Text>Detectamos que você não está logado. Como deseja prosseguir?</Text>
      <div className="mt-3 grid gap-y-3 divide-y divide-gray-200 lg:grid-cols-2 lg:flex-row lg:justify-evenly lg:gap-y-0 lg:divide-x lg:divide-y-0">
        <div className="flex flex-col items-center pe-3">
          <LockClosedIcon className="size-16 text-zinc-500 lg:size-24" />
          <Button outline href={`/login?redirect=inscricoes/${event.id}`}>
            Ir para o login{" "}
          </Button>
          <Text className="mt-1">
            Você será automaticamente redirecionado de volta para a página de
            inscrição.
          </Text>
        </div>
        <div className="flex flex-col items-center pt-3 lg:ps-3 lg:pt-0">
          <ClipboardDocumentCheckIcon className="size-16 text-zinc-500 lg:size-24" />
          <Button color="white" onClick={() => setShowSessionScreen(false)}>
            Inscrição sem login{" "}
          </Button>
          <Text className="mt-1">
            Criaremos um cadastro temporário para você. Você poderá completar o
            cadastro posteriormente.
          </Text>
        </div>
      </div>
    </div>
  );
}
