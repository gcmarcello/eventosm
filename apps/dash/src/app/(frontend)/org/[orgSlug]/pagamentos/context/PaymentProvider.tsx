"use client";

import React, { useEffect, useState } from "react";
import {
  Event,
  EventGroup,
  EventRegistration,
  Organization,
  Payment,
  Prisma,
  Team,
  User,
} from "@prisma/client";
import {
  EventGroupRegistration,
  EventRegistrationWithInfo,
} from "prisma/types/Registrations";
import { PaymentContext } from "./Payment.ctx";
import { PaymentType } from "shared-types";
import { PaymentWithRegistrations } from "prisma/types/Payments";

export function PaymentProvider({
  children,
  organization,
  events,
  eventGroups,
  payment,
}: {
  children: React.ReactNode;
  organization: Organization;
  events: Event[];
  eventGroups: EventGroup[];
  payment: PaymentWithRegistrations;
}) {
  const [paymentMethod, setPaymentMethod] =
    useState<PaymentType>("CREDIT_CARD");

  return (
    <PaymentContext.Provider
      value={{
        organization,
        paymentMethod,
        setPaymentMethod,
        events,
        eventGroups,
        payment,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
}
