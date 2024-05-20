import {
  QrCodeIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {
  Event,
  EventRegistration,
  EventRegistrationBatch,
  Organization,
} from "@prisma/client";
import { Button, Date } from "odinkit/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { useContext } from "react";
import { EventPageContext } from "../context/EventPage.ctx";
import { Alertbox, Link, Text, formatPhone } from "odinkit";
import BatchModal from "@/app/(frontend)/painel/eventos/_shared/components/batches/BatchModal";
import { formatPrice } from "../../../inscricoes/utils/price";
import PixIcon from "node_modules/odinkit/src/icons/PixIcon";
import BarcodeIcon from "node_modules/odinkit/src/icons/BarcodeIcon";
import { CreditCardIcon } from "@heroicons/react/24/solid";

export function RegistrationButton() {
  const { event, organization, userRegistration, activeBatch, nextBatch } =
    useContext(EventPageContext);

  function handleButtons() {
    if (userRegistration?.status === "active") {
      return (
        <Alertbox
          type="success"
          className="my-3 w-full"
          title="Você já está inscrito neste evento!"
        >
          <Link href="/perfil" className="underline hover:no-underline">
            Clique aqui
          </Link>{" "}
          para ir ao seu perfil e visualizar sua inscrição.
        </Alertbox>
      );
    }

    if (userRegistration?.status === "pending")
      return (
        <Alertbox
          type="warning"
          className="my-3 w-full"
          title="Você já tem uma inscrição pendente para este evento!"
        >
          <Link href="/perfil" className="underline hover:no-underline">
            Clique aqui
          </Link>{" "}
          para ir ao seu perfil e finalizar a inscrição.
        </Alertbox>
      );

    if (userRegistration?.status === "suspended") {
      return (
        <Alertbox
          type="warning"
          className="my-3 w-full"
          title="Sua inscrição foi suspensa!"
        >
          <Link href="/perfil" className="underline hover:no-underline">
            Clique aqui
          </Link>{" "}
          para ir ao seu perfil e verificar o motivo.
        </Alertbox>
      );
    }

    if (!activeBatch && nextBatch) {
      return (
        <Button className={"w-full"} disabled color="rose">
          Inscrições em breve{" - "}
          <Date date={nextBatch.dateStart} format="DD/MM/YYYY HH:mm" />
        </Button>
      );
    }

    if (event.EventRegistrationBatch.length && !activeBatch)
      return (
        <Button disabled color="red" className={"w-full"}>
          Inscrições Esgotadas
        </Button>
      );

    return (
      <div className="flex gap-2">
        {(activeBatch?.registrationType === "team" ||
          activeBatch?.registrationType === "mixed") && (
          <Button
            href={`/inscricoes/${event.id}?team=true`}
            className={"grow"}
            color={organization.options.colors.secondaryColor.tw.color}
          >
            <UserGroupIcon
              color={organization.options.colors.primaryColor.hex}
              className="size-6"
            />
            Inscrição de Equipe
          </Button>
        )}
        {(activeBatch?.registrationType === "individual" ||
          activeBatch?.registrationType === "mixed") && (
          <Button
            href={`/inscricoes/${event.id}`}
            className={"grow"}
            color={organization.options.colors.primaryColor.tw.color}
          >
            <UserCircleIcon
              color={organization.options.colors.primaryColor.hex}
              className="size-6"
            />
            Inscrição Individual
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="mt-2 hidden w-full lg:block">
      {activeBatch && (
        <div className="mt-3 space-y-3 rounded-lg border border-zinc-200 p-3">
          <div className="space-y-1">
            <Text>
              <span className="font-medium">Inscrições</span>{" "}
              {activeBatch.price ? (
                <>à partir de {formatPrice(activeBatch.price)}</>
              ) : (
                <div className="inline-flex font-medium text-green-500">
                  Gratuitas!
                </div>
              )}
            </Text>
            <Text>
              <span className="font-medium">Lote {activeBatch.name}: </span>
              <Date
                date={activeBatch.dateStart}
                format="DD/MM/YYYY HH:mm"
              /> - <Date date={activeBatch.dateEnd} format="DD/MM/YYYY HH:mm" />
            </Text>
            {activeBatch.price ? (
              <div className="flex gap-1 font-medium">
                <Text>Formas de Pagamento: </Text>
                <div className="inline-flex gap-2 text-zinc-500">
                  <PixIcon />
                  <BarcodeIcon />
                  <CreditCardIcon className="size-6" />
                </div>
              </div>
            ) : null}
          </div>
          {handleButtons()}
        </div>
      )}
    </div>
  );
}
