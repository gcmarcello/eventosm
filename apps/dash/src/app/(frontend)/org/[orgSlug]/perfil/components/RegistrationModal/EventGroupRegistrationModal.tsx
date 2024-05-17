import { cancelRegistration } from "@/app/api/registrations/action";
import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import {
  Event,
  EventAbsences,
  EventResult,
  Organization,
  Team,
} from "@prisma/client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  showToast,
  useAction,
} from "odinkit/client";
import { EventGroupEventCheckinsAndAbsences } from "prisma/types/Events";
import { EventGroupRegistration } from "prisma/types/Registrations";
import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { readUserEventGroupResults } from "@/app/api/results/action";
import TabNavigation, { Tab } from "../../../_shared/components/TabNavigation";
import { GeneralEventGroupRegistrationInfo } from "./EventGroup/GeneralEventGroupRegistrationInfo";
import { EventGroupAttendance } from "./EventGroup/EventGroupAttendance";
import { EventGroupResults } from "./EventGroup/EventGroupResults";
import { CancelRegistrationModal } from "../CancelRegistrationModal";

export function EventGroupRegistrationModal({
  registration,
  isOpen,
  setIsOpen,
  organization,
  teams,
}: {
  organization: Organization;
  registration: EventGroupRegistration;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  teams: Team[];
}) {
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  if (!registration) return null;

  const navigation: Tab[] = useMemo(
    () => [
      {
        name: "Geral",
        icon: <InformationCircleIcon />,
        content: (
          <GeneralEventGroupRegistrationInfo
            organization={organization}
            registration={registration}
            teams={teams}
          />
        ),
      },
      {
        name: "Presença",
        icon: <CheckIcon />,
        content: <EventGroupAttendance registration={registration} />,
      },
      {
        name: "Resultados",
        icon: <ClipboardDocumentCheckIcon />,
        content: (
          <EventGroupResults eventGroupId={registration.eventGroupId!} />
        ),
      },
    ],
    []
  );

  return (
    <>
      <Dialog open={isOpen} onClose={setIsOpen}>
        <DialogTitle>Resumo da Inscrição</DialogTitle>
        <DialogDescription>
          Aqui você encontra as informações do evento e da sua inscrição.
        </DialogDescription>
        <DialogBody className="min-h-72">
          <CancelRegistrationModal
            isOpen={showCancelAlert}
            setIsOpen={setShowCancelAlert}
            registration={registration}
          />

          <TabNavigation organization={organization} tabs={navigation} />
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
