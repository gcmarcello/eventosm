import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { Organization, EventRegistrationBatch } from "@prisma/client";
import { Button } from "odinkit/client";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";
import { EventGroupWithInfo } from "prisma/types/Events";
import { formatPrice } from "../../../../inscricoes/utils/price";
import { date } from "odinkit";
import {
  QrCodeIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

export default function RegistrationMobileButton({
  eventGroup,
  isUserRegistered,
  batch,
  organization,
  nextBatch,
  registrationCount,
}: {
  isUserRegistered: boolean;
  eventGroup: EventGroupWithInfo;
  batch: EventRegistrationBatchesWithCategoriesAndRegistrations | null;
  organization: Organization;
  nextBatch: EventRegistrationBatch | null;
  registrationCount: number;
}) {
  const handleButtonColor = () => {
    if (isUserRegistered) return "amber";
    if (!batch) return "rose";

    return organization.options.colors.primaryColor.tw.color;
  };

  const handleButtonName = () => {
    if (isUserRegistered) return "Inscrito!";
    if (batch) return "Inscrição";
    if (!batch && nextBatch) return "Inscrições em Breve!";
    if (!batch && !nextBatch) return "Inscrições Indisponíveis";
  };

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            disabled={!batch && !nextBatch}
            as="div"
            className="w-full p-2 shadow-sm"
          >
            <Button
              disabled={!batch && !nextBatch}
              className="w-full"
              color={handleButtonColor()}
            >
              {handleButtonName()}
              {!batch && !nextBatch ? (
                ""
              ) : open ? (
                <ChevronDownIcon className="size-5" />
              ) : (
                <ChevronUpIcon className="size-5" />
              )}
            </Button>
          </Disclosure.Button>

          <Transition
            enter="transition duration-300 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-300 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel>
              <div className=" bg-zinc-50 p-5">
                {batch ? (
                  <div className="space-y-2 rounded-lg bg-white p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        Valor da inscrição:
                      </span>
                      <span className="text-sm  text-zinc-500">
                        {batch.price ? (
                          formatPrice(batch?.price)
                        ) : (
                          <span className="text-green-400">Grátis!</span>
                        )}
                      </span>
                    </div>
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        Término do lote:
                      </span>
                      <span className="text-xs">
                        {date(batch.dateEnd, "DD/MM/YYYY HH:mm")}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 border-t border-zinc-200 pt-2">
                      {isUserRegistered ? (
                        <Button
                          href={`/inscricoes/campeonatos/${eventGroup.id}?team=true`}
                          plain
                        >
                          <QrCodeIcon
                            color={organization.options.colors.primaryColor.hex}
                            className="size-6"
                          />
                          Ver QR Code
                        </Button>
                      ) : (
                        batch.registrationType !== "team" && (
                          <Button
                            href={`/inscricoes/campeonatos/${eventGroup.id}`}
                            plain
                          >
                            <UserCircleIcon
                              color={
                                organization.options.colors.primaryColor.hex
                              }
                              className="size-6"
                            />
                            Individual
                          </Button>
                        )
                      )}
                      {batch.registrationType !== "team" && (
                        <Button
                          href={`/inscricoes/campeonatos/${eventGroup.id}?team=true`}
                          plain
                        >
                          <UserGroupIcon
                            color={organization.options.colors.primaryColor.hex}
                            className="size-6"
                          />
                          Equipes
                        </Button>
                      )}
                    </div>
                  </div>
                ) : nextBatch ? (
                  <div className="space-y-2 rounded-sm bg-white p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        Início do Lote:
                      </span>
                      <span className="text-xs">
                        {date(nextBatch.dateStart, "DD/MM/YYYY HH:mm")}
                      </span>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
