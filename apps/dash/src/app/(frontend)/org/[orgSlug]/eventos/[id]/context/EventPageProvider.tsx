"use client";

import {
  EventRegistration,
  EventRegistrationBatch,
  Organization,
} from "@prisma/client";
import { EventPageContext } from "./EventPage.ctx";
import { EventWithInfo } from "prisma/types/Events";
import { EventRegistrationBatchesWithCategoriesAndRegistrations } from "prisma/types/Batches";

export function EventPageProvider({
  children,
  organization,
  event,
  userRegistration,
  activeBatch,
}: {
  children: React.ReactNode;
  organization: Organization;
  event: EventWithInfo;
  userRegistration: EventRegistration | null;
  activeBatch: EventRegistrationBatchesWithCategoriesAndRegistrations | null;
}) {
  const isActiveBatchFull = activeBatch
    ? activeBatch?._count.EventRegistration >= activeBatch.maxRegistrations
    : true;
  const nextBatch = activeBatch
    ? null
    : event.EventRegistrationBatch.find(
        (batch) => batch.dateStart > new Date() && !batch.protectedBatch
      ) ?? null;

  return (
    <EventPageContext.Provider
      value={{
        organization,
        event,
        userRegistration,
        activeBatch,
        nextBatch,
        isActiveBatchFull,
      }}
    >
      {children}
    </EventPageContext.Provider>
  );
}
