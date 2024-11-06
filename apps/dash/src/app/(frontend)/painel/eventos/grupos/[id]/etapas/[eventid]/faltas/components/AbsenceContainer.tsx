"use client";
import {
  changeAbsenceStatus,
  readAbsenceJustification,
} from "@/app/api/absences/action";
import { readSubeventReviewData } from "@/app/api/events/action";
import { updateEventStatus } from "@/app/api/events/status/action";
import { XMarkIcon, CheckIcon } from "@heroicons/react/20/solid";
import { Event, EventGroup, Organization } from "@prisma/client";
import clsx from "clsx";
import {
  Heading,
  Table,
  Badge,
  ExtractSuccessResponse,
  Link,
  formatPhone,
} from "odinkit";
import { useAction, showToast, Button } from "odinkit/client";
import { useContext, useEffect } from "react";
import { sortAbsences } from "../utils/sorting";
import { DenyJustificationAlert } from "./DenyJustificationAlert";
import {
  AbsencesPageContext,
  AbsenceWithUser,
} from "../context/AbsencesPage.ctx";

export function AbsencesForm({
  event,
  eventGroup,
  organization,
  eventReview,
}: {
  event: Event;
  eventGroup: EventGroup;
  organization: Organization;
  eventReview: ExtractSuccessResponse<typeof readSubeventReviewData>;
}) {
  const {
    modalVisibility,
    selectedAbsence,
    setSelectedAbsence,
    handleModalOpen,
    triggerReadAbsenceJustificationData,
    triggerAbsenceStatus,
    isAbsenceStatusMutating,
    eventStatusTrigger,
    isEventStatusMutating,
  } = useContext(AbsencesPageContext);

  return (
    <>
      <div className="">
        <DenyJustificationAlert />
        <div className="mb-3 items-center gap-3 lg:flex">
          <Heading>Ausências - {event.name}</Heading>
          <Link
            className="text-sm"
            style={{
              color: organization.options.colors.primaryColor.hex,
            }}
            href={`/painel/eventos/grupos/${eventGroup.id}/etapas`}
          >
            Voltar à lista de etapas
          </Link>
        </div>
        <Table
          data={
            (sortAbsences(eventReview?.absences) as AbsenceWithUser[]) || []
          }
          search={false}
          columns={(columnHelper) => [
            columnHelper.accessor("registration.user.fullName", {
              id: "name",
              header: "Atleta",
              enableSorting: true,
              enableGlobalFilter: true,
              cell: (info) => info.getValue(),
            }),
          ]}
        />
        <div className="mt-4 flex justify-end">
          <Button
            loading={isEventStatusMutating}
            onClick={() =>
              eventStatusTrigger({
                status: "finished",
                eventId: event.id,
                eventGroupId: eventGroup.id,
              })
            }
            color={organization.options.colors.primaryColor.tw.color}
          >
            Finalizar Evento
          </Button>
        </div>
      </div>
    </>
  );
}
