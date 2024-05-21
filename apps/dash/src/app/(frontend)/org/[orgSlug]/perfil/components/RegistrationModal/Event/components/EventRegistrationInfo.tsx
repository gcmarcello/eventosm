import Image from "next/image";
import { For } from "odinkit";
import { DialogDescription } from "odinkit/client";
import { useContext, useMemo, useState } from "react";
import { TeamChangeModal } from "../../TeamChangeModal";
import { EventRegistrationModalContext } from "../../context/RegistrationModal.ctx";

export function EventRegistrationInfo() {
  const [isTeamChangeOpen, setIsTeamChangeOpen] = useState(false);
  const { registration, teams, organization } = useContext(
    EventRegistrationModalContext
  );

  const registrationInfo = useMemo(
    () => [
      {
        title: "QR Code de Confirmação",
        content: (
          <>
            <div className="flex flex-col items-center justify-center lg:items-start">
              <div className="relative h-36 w-36 border border-slate-100 p-5">
                <Image
                  fill={true}
                  alt="qrcode da inscricao"
                  src={registration.qrCode}
                ></Image>
              </div>
              <DialogDescription>
                O QR Code é a sua identificação para o check-in em todas as
                etapas, não o compartilhe com ninguém.
              </DialogDescription>
            </div>
          </>
        ),
      },
      {
        title: "Evento",
        content: registration.event?.name,
      },
      {
        title: "Modalidade",
        content: registration.modality?.name,
      },
      {
        title: "Categoria",
        content: registration.category?.name,
      },
      {
        title: "Equipe",
        content: (
          <>
            {registration.team ? (
              registration.team.name
            ) : teams.length ? (
              <>
                <span
                  className="cursor-pointer underline hover:no-underline"
                  onClick={() => {
                    setIsTeamChangeOpen(true);
                  }}
                >
                  Atribuir equipe
                </span>
                <TeamChangeModal
                  isTeamChangeOpen={isTeamChangeOpen}
                  setIsTeamChangeOpen={setIsTeamChangeOpen}
                  organization={organization}
                  registration={registration}
                  teams={teams}
                />
              </>
            ) : (
              <>
                <span>Nenhuma </span>
                <div className="text-xs text-zinc-500">
                  (junte-se à uma equipe antes de atribuir.)
                </div>
              </>
            )}
          </>
        ),
      },
    ],
    [registration.team, isTeamChangeOpen]
  );

  return (
    <div className="mt-2 border-gray-100 ">
      <dl className="divide-y divide-gray-100">
        <For each={registrationInfo}>
          {(info) => (
            <div className="py-2 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0 lg:px-4">
              <dt className="text-sm font-medium leading-6 text-gray-900">
                {info.title}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {info.content}
              </dd>
            </div>
          )}
        </For>
      </dl>
    </div>
  );
}
