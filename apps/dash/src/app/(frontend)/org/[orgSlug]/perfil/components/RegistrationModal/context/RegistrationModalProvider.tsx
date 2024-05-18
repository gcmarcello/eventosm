"use client";

import React, { useEffect, useState } from "react";
import { Organization, Prisma, Team, User } from "@prisma/client";
import {
  EventGroupRegistration,
  EventRegistrationWithInfo,
} from "prisma/types/Registrations";
import {
  EventGroupRegistrationModalContext,
  EventRegistrationModalContext,
} from "./RegistrationModal.ctx";

export function RegistrationModalProvider({
  children,
  registration,
  teams,
  organization,
}: {
  registration: EventGroupRegistration | EventRegistrationWithInfo;
  teams: Team[];
  children: React.ReactNode;
  organization: Organization;
}) {
  const [visibility, setVisibility] = useState(false);

  if (registration.eventGroupId)
    return (
      <EventGroupRegistrationModalContext.Provider
        value={{
          visibility,
          setVisibility,
          registration,
          teams,
          organization,
        }}
      >
        {children}
      </EventGroupRegistrationModalContext.Provider>
    );

  return (
    <EventRegistrationModalContext.Provider
      value={{
        visibility,
        setVisibility,
        registration,
        teams,
        organization,
      }}
    >
      {children}
    </EventRegistrationModalContext.Provider>
  );
}
