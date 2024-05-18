import { readEventGroupCheckinsAndAbsences } from "@/app/api/events/action";
import {
  Event,
  EventAbsences,
  EventCheckIn,
  EventRegistration,
} from "@prisma/client";
import { set } from "lodash";
import { Badge, For, LoadingSpinner } from "odinkit";
import { useAction } from "odinkit/client";
import { EventGroupEventCheckinsAndAbsences } from "prisma/types/Events";
import { useEffect, useState } from "react";
import AbsenceJustificationModal from "../../AbsenceJustificationModal";

export function EventGroupAttendance({
  registration,
}: {
  registration: EventRegistration;
}) {
  const [checkinsAndAbsences, setCheckinsAndAbsences] =
    useState<EventGroupEventCheckinsAndAbsences | null>(null);
  const [selectedAbsence, setSelectedAbsence] = useState<EventAbsences | null>(
    null
  );
  const [showJustificationModal, setShowJustificationModal] = useState(false);

  const {
    data: checkinsAndAbsencesData,
    trigger: checkinsAndAbsencesTrigger,
    isMutating: checkinsAndAbsencesMutating,
  } = useAction({
    action: readEventGroupCheckinsAndAbsences,
  });

  function handleAbsenceModal(absence: EventAbsences) {
    setSelectedAbsence(absence);
    setShowJustificationModal(true);
  }

  function handleCheckinOrAbsence(
    eventCheckin: EventCheckIn | undefined,
    absenceJustification: EventAbsences | undefined,
    event: Event
  ) {
    if (eventCheckin) {
      return (
        <Badge className="my-auto" color="green">
          Presente
        </Badge>
      );
    } else {
      if (event.status === "review") {
        switch (absenceJustification?.status) {
          case "approved":
            return (
              <Badge className="my-auto" color="purple">
                Ausência justificada
              </Badge>
            );
          case "denied":
            return (
              <Badge
                className="my-auto cursor-pointer underline"
                color="red"
                onClick={() => handleAbsenceModal(absenceJustification)}
              >
                Atestado reprovado (reenviar)
              </Badge>
            );
          case "pending":
            if (absenceJustification.justificationUrl) {
              return (
                <Badge className="my-auto" color="yellow">
                  Atestado em Análise
                </Badge>
              );
            } else {
              return (
                <Badge
                  className="my-auto cursor-pointer underline"
                  color="amber"
                  onClick={() => handleAbsenceModal(absenceJustification)}
                >
                  Enviar Atestado
                </Badge>
              );
            }

          default:
            break;
        }
      }
    }
  }

  useEffect(() => {
    if (registration?.id) {
      checkinsAndAbsencesTrigger({
        where: {
          registrationId: registration.id,
        },
      });
    }
  }, []);

  if (!checkinsAndAbsencesData)
    return (
      <div className="mt-10 flex justify-center">
        <LoadingSpinner />
      </div>
    );

  return (
    <dl className="divide-y divide-gray-100">
      {selectedAbsence?.id && (
        <AbsenceJustificationModal
          showJustificationModal={showJustificationModal}
          setShowJustificationModal={setShowJustificationModal}
          triggerUpdate={() =>
            checkinsAndAbsencesTrigger({
              where: {
                registrationId: registration.id,
              },
            })
          }
          absenceId={selectedAbsence.id}
        />
      )}
      {checkinsAndAbsencesData && (
        <For each={checkinsAndAbsencesData?.eventGroup?.Event || []}>
          {(event) => {
            const eventCheckin = checkinsAndAbsencesData?.EventCheckIn.find(
              (checkin) => checkin.eventId === event.id
            );
            const absenceJustification =
              checkinsAndAbsencesData?.EventAbsences.find(
                (absence) => absence.eventId === event.id
              );

            return (
              <>
                <div className="flex justify-between px-4 py-3 sm:gap-4 sm:px-0">
                  <dt className="text-sm font-medium leading-6 text-gray-900">
                    {event.name}
                  </dt>
                  <dd className="mt-1 flex justify-end text-sm leading-6 text-gray-700 sm:mt-0">
                    {event.status === "published" && !eventCheckin ? (
                      <Badge className="my-auto">Aberto</Badge>
                    ) : (
                      handleCheckinOrAbsence(
                        eventCheckin,
                        absenceJustification,
                        event
                      )
                    )}
                  </dd>
                </div>
              </>
            );
          }}
        </For>
      )}
    </dl>
  );
}
