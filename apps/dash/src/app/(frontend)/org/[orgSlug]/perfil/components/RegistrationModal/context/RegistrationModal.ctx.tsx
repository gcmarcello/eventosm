import { Dispatch, SetStateAction, createContext } from "react";

import {
  EventGroupRegistration,
  EventRegistrationWithInfo,
} from "prisma/types/Registrations";
import { Organization, Team } from "@prisma/client";

export class RegistrationModalContextProps {
  visibility: boolean;
  setVisibility: Dispatch<SetStateAction<boolean>>;
  teams: Team[];
  organization: Organization;
}

export class EventGroupRegistrationModalContextProps extends RegistrationModalContextProps {
  registration: EventGroupRegistration;
}

export class EventRegistrationModalContextProps extends RegistrationModalContextProps {
  registration: EventRegistrationWithInfo;
}

export const EventGroupRegistrationModalContext = createContext(
  new EventGroupRegistrationModalContextProps()
);

export const EventRegistrationModalContext = createContext(
  new EventRegistrationModalContextProps()
);
