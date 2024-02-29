import { readEventGroups, readEventGroupsInfo } from "@/app/api/events/action";
import { ReadEventGroupDto } from "@/app/api/events/dto";
import { ReadEventAddonDto } from "@/app/api/products/dto";
import { cancelRegistration } from "@/app/api/registrations/action";
import {
  ClipboardDocumentCheckIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import { Organization } from "@prisma/client";
import clsx from "clsx";
import { set } from "lodash";
import Image from "next/image";
import { For } from "odinkit";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  showToast,
  useAction,
} from "odinkit/client";
import { EventGroupWithEvents } from "prisma/types/Events";
import { EventGroupRegistration } from "prisma/types/Registrations";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export function EventGroupRegistrationModal({
  registration,
  isOpen,
  setIsOpen,
  organization,
}: {
  organization: Organization;
  registration: EventGroupRegistration | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [screen, setScreen] = useState("general");
  const [eventGroup, setEventGroup] = useState<
    EventGroupWithEvents | undefined
  >(undefined);
  const {
    data: cancelData,
    trigger: cancelTrigger,
    isMutating,
  } = useAction({
    action: cancelRegistration,
    onSuccess: () => {
      setIsOpen(false);
      setShowCancelAlert(false);
      showToast({
        message: "Inscrição cancelada com sucesso",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({ message: error, variant: "error", title: "Erro!" });
    },
  });
  const {
    data: eventGroupData,
    trigger: eventGroupTrigger,
    isMutating: eventGroupMutating,
  } = useAction({
    action: readEventGroupsInfo,
    onSuccess: (data) => {
      if (data.data) setEventGroup(data.data[0] as any);
    },
  });

  useEffect(() => {
    if (registration && isOpen) {
      eventGroupTrigger({ where: { id: registration.eventGroup?.id } });
    }
  }, [isOpen]);

  if (!registration) return null;

  const secondaryNavigation = [
    {
      name: "Geral",
      icon: ClipboardDocumentCheckIcon,
      screen: "general",
    },
    {
      name: "Atestados",
      icon: UserCircleIcon,
      screen: "justifications",
    },
  ];

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Resumo da Inscrição</DialogTitle>
        <DialogDescription>
          Aqui você encontra as informações do evento e da sua inscrição.
        </DialogDescription>
        <DialogBody>
          <CancelEventGroupRegistrationAlert
            isLoading={isMutating}
            isOpen={showCancelAlert}
            setIsOpen={setShowCancelAlert}
            triggerCancellation={cancelTrigger}
            registration={registration}
          />
          <aside className="flex overflow-x-scroll pt-2 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-4 ">
            <nav className="flex-none px-4 sm:px-6 lg:px-0">
              <ul
                role="list"
                className="flex gap-x-3 gap-y-1 whitespace-nowrap "
              >
                {secondaryNavigation.map((item) => (
                  <li key={item.name}>
                    <div
                      style={{
                        color:
                          item.screen === screen
                            ? organization?.options.colors.primaryColor.hex
                            : undefined,
                      }}
                      className={clsx(
                        "text-gray-700 hover:bg-gray-50 ",
                        "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6"
                      )}
                      onClick={() => setScreen(item.screen)}
                    >
                      <item.icon
                        className={clsx("h-6 w-6 shrink-0")}
                        aria-hidden="true"
                      />
                      {item.name}
                    </div>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
          {screen === "general" && (
            <div className="mt-2 border-t border-gray-100">
              <dl className="divide-y divide-gray-100">
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Evento
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {registration.eventGroup?.name}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Etapas
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {registration.eventGroup?.Event?.length}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Modalidade
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {registration.modality?.name}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    Categoria
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    {registration.category?.name}
                  </dd>
                </div>
                <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    QR Code de Confirmação
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                    <div className="flex flex-col items-center justify-center lg:items-start">
                      <div className="relative h-36 w-36 border border-slate-100 p-5">
                        <Image
                          fill={true}
                          alt="qrcode da inscricao"
                          src={registration.qrCode}
                        ></Image>
                      </div>
                      <DialogDescription>
                        O QR Code é a sua identificação para o check-in em todas
                        as etapas, não o compartilhe com ninguém.
                      </DialogDescription>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          )}
          {screen === "justifications" && (
            <>
              <dl className="divide-y divide-gray-100">
                {eventGroup && (
                  <For each={eventGroup?.Event}>
                    {(event) => (
                      <div className="px-4 py-3 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                        <dt className="text-sm font-medium leading-6 text-gray-900 sm:col-span-2">
                          {event.name}
                        </dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700  sm:mt-0">
                          {registration.eventGroup?.name}
                        </dd>
                      </div>
                    )}
                  </For>
                )}
              </dl>
            </>
          )}
        </DialogBody>

        <DialogActions className="flex justify-between">
          <Button color="red" onClick={() => setShowCancelAlert(true)}>
            Cancelar Inscrição
          </Button>
          <Button onClick={() => setIsOpen(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

function CancelEventGroupRegistrationAlert({
  isOpen,
  setIsOpen,
  triggerCancellation,
  isLoading,
  registration,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isLoading: boolean;
  triggerCancellation: ({ registrationId }: { registrationId: string }) => void;
  registration: EventGroupRegistration;
}) {
  return (
    <>
      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>
          Você tem certeza que deseja cancelar sua inscrição no(a){" "}
          {registration.eventGroup?.name}?
        </AlertTitle>
        <AlertDescription>
          A inscrição será cancelada automaticamente em todas as etapas, e você
          ficará impossibilitado de participar do evento. A possibilidade de
          reinscrição estará sujeita a disponibilidade de vagas.
        </AlertDescription>
        <AlertActions>
          <Button plain onClick={() => setIsOpen(false)}>
            Voltar
          </Button>
          <Button
            color={"red"}
            loading={isLoading}
            onClick={() =>
              triggerCancellation({ registrationId: registration.id })
            }
          >
            Cancelar
          </Button>
        </AlertActions>
      </Alert>
    </>
  );
}
