import { UpdateAbsenceStatusDto } from "@/app/api/absences/dto";
import { EventAbsenceStatus, EventAbsences, EventStatus } from "@prisma/client";
import { Exception, SuccessResponse } from "odinkit";
import { UseFormReturn } from "odinkit/client";
import { Dispatch, SetStateAction, createContext } from "react";

export class AbsencesPageContextProps {
  modalVisibility: boolean;
  handleModalClose: () => void;
  handleModalOpen: (absence: EventAbsences) => void;
  selectedAbsence:
    | (EventAbsences & {
        registration: { user: { fullName: string; phone: string } };
      })
    | null;
  setSelectedAbsence: Dispatch<SetStateAction<EventAbsences | null>>;
  triggerReadAbsenceJustificationData: ({
    id,
  }: {
    id: string;
  }) => Promise<SuccessResponse<unknown> | Exception>;
  triggerAbsenceStatus: ({
    absenceId,
    status,
    comment,
  }: {
    absenceId: string;
    status: EventAbsenceStatus;
    comment?: string;
  }) => Promise<SuccessResponse<unknown> | Exception>;
  isAbsenceStatusMutating: boolean;
  eventStatusTrigger: ({
    eventId,
    status,
    eventGroupId,
  }: {
    eventId: string;
    status: EventStatus;
    eventGroupId: string;
  }) => Promise<SuccessResponse<unknown> | Exception>;
  isEventStatusMutating: boolean;
  form: UseFormReturn<UpdateAbsenceStatusDto>;
}

export const AbsencesPageContext = createContext(
  new AbsencesPageContextProps()
);
