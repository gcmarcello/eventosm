import { ReadEventGroupDto } from "@/app/api/events/dto";
import { readEventGroupCheckinsAndAbsences } from "@/app/api/events/action";
import { ReadEventAddonDto } from "@/app/api/products/dto";
import {
  cancelRegistration,
  connectRegistrationToTeam,
} from "@/app/api/registrations/action";
import {
  CheckIcon,
  ClipboardDocumentCheckIcon,
  InformationCircleIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import {
  EventAbsences,
  EventRegistration,
  Organization,
  Team,
} from "@prisma/client";
import clsx from "clsx";
import { set } from "lodash";
import Image from "next/image";
import { Badge, For, SubmitButton } from "odinkit";
import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
  Button,
  Description,
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
  Form,
  Select,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import {
  EventGroupEventCheckinsAndAbsences,
  EventGroupWithEvents,
} from "prisma/types/Events";
import {
  EventGroupRegistration,
  EventRegistrationWithInfo,
} from "prisma/types/Registrations";
import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { connectRegistrationToTeamDto } from "@/app/api/registrations/dto";
import { format } from "path";
import DocumentModal from "../AbsenceJustificationModal";
import AbsenceJustificationModal from "../AbsenceJustificationModal";
import { redirect } from "next/dist/server/api-utils";
import {
  EventGroupRegistrationModalContext,
  EventRegistrationModalContext,
} from "../context/RegistrationModal.ctx";
import { CancelRegistrationModal } from "../EventGroup/components/CancelRegistrationModal";
import { CancelEventRegistrationModal } from "./components/CancelEventRegistrationModal";
import TabNavigation, {
  Tab,
} from "../../../../_shared/components/TabNavigation";
import { EventRegistrationInfo } from "./components/EventRegistrationInfo";
import { EventResults } from "./components/EventResults";

const secondaryNavigation = [
  {
    name: "Geral",
    icon: InformationCircleIcon,
    screen: "general",
  },
  {
    name: "Resultados",
    icon: ClipboardDocumentCheckIcon,
    screen: "results",
  },
];

export function EventRegistrationModal() {
  const [showJustificationModal, setShowJustificationModal] = useState(false);
  const [selectedAbsence, setSelectedAbsence] = useState<EventAbsences | null>(
    null
  );
  const [showCancelAlert, setShowCancelAlert] = useState(false);
  const [isTeamChangeOpen, setTeamChangeIsOpen] = useState(false);
  const [screen, setScreen] = useState("general");
  const [eventGroup, setEventGroup] = useState<
    EventGroupEventCheckinsAndAbsences | undefined
  >(undefined);

  const { registration, organization, teams, setVisibility, visibility } =
    useContext(EventRegistrationModalContext);

  const navigation: Tab[] = useMemo(
    () => [
      {
        name: "Geral",
        icon: <InformationCircleIcon />,
        content: <EventRegistrationInfo />,
      },
      {
        name: "Resultados",
        icon: <ClipboardDocumentCheckIcon />,
        content: <EventResults />,
      },
    ],
    []
  );

  const {
    data: eventGroupData,
    trigger: eventGroupTrigger,
    isMutating: eventGroupMutating,
  } = useAction({
    action: readEventGroupCheckinsAndAbsences,
    onSuccess: (data) => {
      if (data.data)
        setEventGroup(data.data as EventGroupEventCheckinsAndAbsences);
    },
  });

  const {
    data: connectRegistrationToTeamData,
    trigger: connectRegistrationToTeamTrigger,
  } = useAction({
    action: connectRegistrationToTeam,
    onSuccess: (data) => {
      setTeamChangeIsOpen(false);
      setVisibility(false);
      showToast({
        message: data.message || "Inscrição conectada à equipe com sucesso.",
        variant: "success",
        title: "Sucesso!",
      });
    },
    onError: (error) => {
      showToast({ message: error.message, variant: "error", title: "Erro!" });
    },
  });

  const connectTeamForm = useForm({
    schema: connectRegistrationToTeamDto,
    defaultValues: {
      registrationId: registration.id,
      teamId: "",
    },
  });

  function fetchCheckinsAndAbsences() {
    eventGroupTrigger({
      where: {
        registrationId: registration.id,
      },
    });
  }

  const Field = useMemo(() => connectTeamForm.createField(), []);

  useEffect(() => {
    if (registration?.id && visibility) {
      fetchCheckinsAndAbsences();
    }
  }, [visibility]);

  if (!registration) return null;

  return (
    <>
      <Dialog open={visibility} onClose={setVisibility}>
        <DialogTitle>Resumo da Inscrição</DialogTitle>
        <DialogDescription>
          Aqui você encontra as informações do evento e da sua inscrição.
        </DialogDescription>
        <DialogBody className="min-h-72">
          <CancelEventRegistrationModal
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
