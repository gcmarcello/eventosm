import { createContext } from "react";
import {
  EventRegistration,
  EventRegistrationBatch,
  Organization,
} from "@prisma/client";
import { EventWithInfo } from "prisma/types/Events";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";

export class EventPageContextProps {
  organization: Organization;
  event: EventWithInfo;
  userRegistration: EventRegistration | null;
  activeBatch: EventRegistrationBatchesWithCategoriesAndRegistrations | null;
  nextBatch: EventRegistrationBatch | null;
  isActiveBatchFull: boolean;
}

export const EventPageContext = createContext(new EventPageContextProps());
