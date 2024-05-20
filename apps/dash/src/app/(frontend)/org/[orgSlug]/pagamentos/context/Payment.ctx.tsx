import { Dispatch, SetStateAction, createContext } from "react";
import { Event, EventGroup, Organization } from "@prisma/client";
import { PaymentType } from "shared-types";
import { PaymentWithRegistrations } from "prisma/types/Payments";

export class PaymentContextProps {
  paymentMethod: PaymentType = "CREDIT_CARD";
  setPaymentMethod: Dispatch<SetStateAction<PaymentType>>;
  organization: Organization;
  events: Event[];
  eventGroups: EventGroup[];
  payment: PaymentWithRegistrations;
}

export const PaymentContext = createContext(new PaymentContextProps());
