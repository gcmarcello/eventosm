import { cancelRegistration } from "@/app/api/registrations/action";
import Image from "next/image";
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
import { EventGroupRegistration } from "prisma/types/Registrations";
import { Dispatch, SetStateAction, useState } from "react";

export function EventGroupRegistrationModal({
  registration,
  isOpen,
  setIsOpen,
}: {
  registration: EventGroupRegistration | null;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [showCancelAlert, setShowCancelAlert] = useState(false);
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
  if (!registration) return null;

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
          <div className="mt-6 border-t border-gray-100">
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
