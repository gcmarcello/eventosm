import {
  BatchCoupon,
  CategoryBatch,
  City,
  Event,
  EventAddon,
  EventGroup,
  EventModality,
  EventRegistration,
  EventRegistrationBatch,
  ModalityCategory,
  Team,
  User,
  UserInfo,
} from "@prisma/client";
import { EventGroupWithEvents } from "./Events";

export type EventRegistrationBatchesWithCategories = EventRegistrationBatch & {
  CategoryBatch: CategoryBatch[];
};

export type EventGroupRegistration = EventRegistration & {
  eventGroup?: EventGroupWithEvents;
  modality?: EventModality | null;
  category?: ModalityCategory;
  team?: Team | null;
};

export type EventRegistrationWithEvent = EventRegistration & {
  event?: Event;
};

export type EventRegistrationWithInfo = EventRegistration & {
  event?: Event | null;
  user?: User & { info?: UserInfo & { city: City | null } };
  batch?: EventRegistrationBatch;
  modality?: EventModality | null;
  category?: ModalityCategory;
  team?: Team | null;
  addon?: EventAddon | null;
  coupon?: BatchCoupon | null;
};

export type EventGroupRegistrationWithInfo = Omit<
  EventGroupRegistration,
  "event"
> & { EventGroup: EventGroupWithEvents };
