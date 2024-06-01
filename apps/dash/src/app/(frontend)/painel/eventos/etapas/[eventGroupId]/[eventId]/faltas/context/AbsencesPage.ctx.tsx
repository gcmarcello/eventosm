import { UpdateAbsenceStatusDto } from "@/app/api/absences/dto";
import { EventAbsenceStatus, EventAbsences, EventStatus } from "@prisma/client";
import { Exception, SuccessResponse } from "odinkit";
import { UseFormReturn } from "odinkit/client";
import { Dispatch, SetStateAction, createContext } from "react";

export type AbsenceWithUser = EventAbsences & {
  registration: { user: { fullName: string; phone: string } };
};

export class AbsencesPageContextProps {
  modalVisibility: boolean;
  handleModalClose: () => void;
  handleModalOpen: (absence: AbsenceWithUser) => void;
  selectedAbsence: AbsenceWithUser | null;
  setSelectedAbsence: Dispatch<SetStateAction<AbsenceWithUser | null>>;
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
