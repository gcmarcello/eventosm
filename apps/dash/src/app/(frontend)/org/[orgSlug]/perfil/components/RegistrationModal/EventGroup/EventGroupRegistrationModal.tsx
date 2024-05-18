import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { Organization, Team } from "@prisma/client";
import {
  Button,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from "odinkit/client";
import { useContext, useMemo, useState } from "react";
import TabNavigation, {
  Tab,
} from "../../../../_shared/components/TabNavigation";
import { EventGroupRegistrationInfo } from "./components/EventGroupRegistrationInfo";
import { EventGroupAttendance } from "./components/EventGroupAttendance";
import { EventGroupResults } from "./components/EventGroupResults";
import { CancelRegistrationModal } from "./components/CancelRegistrationModal";
import { EventGroupRegistrationModalContext } from "../context/RegistrationModal.ctx";

export function EventGroupRegistrationModal({}: {}) {
  const [showCancelAlert, setShowCancelAlert] = useState(false);

  const { visibility, setVisibility, registration, teams, organization } =
    useContext(EventGroupRegistrationModalContext);

  const navigation: Tab[] = useMemo(
    () => [
      {
        name: "Geral",
        icon: <InformationCircleIcon />,
        content: <EventGroupRegistrationInfo />,
      },
      {
        name: "Presença",
        icon: <CheckIcon />,
        content: <EventGroupAttendance registration={registration} />,
      },
      {
        name: "Resultados",
        icon: <ClipboardDocumentCheckIcon />,
        content: <EventGroupResults />,
      },
    ],
    []
  );

  return (
    <>
      <Dialog open={visibility} onClose={setVisibility}>
        <DialogTitle>Resumo da Inscrição</DialogTitle>
        <DialogDescription>
          Aqui você encontra as informações do evento e da sua inscrição.
        </DialogDescription>
        <DialogBody className="min-h-72">
          <CancelRegistrationModal
            isOpen={showCancelAlert}
            setIsOpen={setShowCancelAlert}
          />
          <TabNavigation organization={organization} tabs={navigation} />
        </DialogBody>

        <DialogActions className="flex justify-between">
          <Button color="red" onClick={() => setShowCancelAlert(true)}>
            Cancelar Inscrição
          </Button>
          <Button onClick={() => setVisibility(false)}>Fechar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
