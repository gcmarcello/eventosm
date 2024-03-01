import {
  CategoryBatch,
  Event,
  EventGroup,
  EventModality,
  EventRegistration,
  EventRegistrationBatch,
  ModalityCategory,
} from "@prisma/client";
import { EventGroupWithEvents } from "./Events";

export type EventRegistrationBatchesWithCategories = EventRegistrationBatch & {
  CategoryBatch: CategoryBatch[];
};

export type EventGroupRegistration = EventRegistration & {
  eventGroup?: EventGroupWithEvents;
  modality?: EventModality;
  category?: ModalityCategory;
};

export type EventRegistrationWithEvent = EventRegistration & {
  event?: Event;
};
