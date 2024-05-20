import { Disclosure, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import {
  QrCodeIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { formatPrice } from "../../../inscricoes/utils/price";
import { Button, Date } from "odinkit/client";
import { useContext } from "react";
import { EventPageContext } from "../context/EventPage.ctx";

export default function RegistrationMobileButton() {
  const { event, organization, userRegistration, activeBatch, nextBatch } =
    useContext(EventPageContext);
  const handleButtonColor = () => {
    if (userRegistration) return "amber";
    if (!activeBatch) return "rose";
    if (
      activeBatch &&
      activeBatch.maxRegistrations <= activeBatch._count.EventRegistration
    )
      return "rose";

    return organization.options.colors.primaryColor.tw.color;
  };

  const handleButtonName = () => {
    if (userRegistration) return "Inscrito!";
    if (
      activeBatch &&
      activeBatch.maxRegistrations <= activeBatch._count.EventRegistration &&
      !nextBatch
    )
      return "Inscrições Esgotadas!";
    if (activeBatch) return "Inscrição";

    if (!activeBatch && nextBatch) return "Inscrições em Breve!";
    if (!activeBatch && !nextBatch) return "Inscrições Indisponíveis";
  };

  return (
    <Disclosure>
      {({ open }) => (
        <>
          <Disclosure.Button
            disabled={!activeBatch && !nextBatch}
            as="div"
            className="w-full p-2 shadow-sm"
          >
            <Button
              disabled={
                (!activeBatch && !nextBatch) ||
                Boolean(
                  activeBatch &&
                    activeBatch.maxRegistrations <=
                      activeBatch._count.EventRegistration &&
                    !nextBatch
                )
              }
              className="w-full"
              color={handleButtonColor()}
            >
              {handleButtonName()}
              {!activeBatch && !nextBatch ? (
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
                {activeBatch ? (
                  activeBatch.maxRegistrations <=
                    activeBatch._count.EventRegistration && !nextBatch ? (
                    "teste"
                  ) : (
                    <div className="space-y-2 rounded-lg bg-white p-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-medium">
                          Valor da inscrição:
                        </span>
                        <span className="text-sm  text-zinc-500">
                          {activeBatch.price ? (
                            formatPrice(activeBatch?.price)
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
                          <Date
                            date={activeBatch.dateEnd}
                            format="DD/MM/YYYY HH:mm"
                          />
                        </span>
                      </div>
                      <div className="flex justify-between gap-2 border-t border-zinc-200 pt-2">
                        {userRegistration ? (
                          <Button
                            href={`/perfil`}
                            plain
                            className="flex grow gap-2 underline"
                          >
                            <QrCodeIcon
                              color={
                                organization.options.colors.primaryColor.hex
                              }
                              className="size-6"
                            />
                            Ver QR Code
                          </Button>
                        ) : (
                          activeBatch.registrationType !== "team" && (
                            <Button
                              href={`/inscricoes/${event.id}`}
                              plain
                              className="flex grow gap-2 underline"
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
                        {activeBatch.registrationType !== "individual" && (
                          <Button
                            className="flex grow gap-2 underline"
                            href={`/inscricoes/${event.id}?team=true`}
                            plain
                          >
                            <UserGroupIcon
                              color={
                                organization.options.colors.primaryColor.hex
                              }
                              className="size-6"
                            />
                            Equipes
                          </Button>
                        )}
                      </div>
                    </div>
                  )
                ) : nextBatch ? (
                  <div className="space-y-2 rounded-sm bg-white p-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm font-medium">
                        Início do Lote:
                      </span>
                      <span className="text-xs">
                        {
                          <Date
                            date={nextBatch.dateStart}
                            format="DD/MM/YYYY HH:mm"
                          />
                        }
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
