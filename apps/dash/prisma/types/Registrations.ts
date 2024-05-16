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
  modality?: EventModality;
  category?: ModalityCategory;
  team?: Team;
};

export type EventRegistrationWithEvent = EventRegistration & {
  event?: Event;
};

export type RegistrationWithInfo = EventRegistration & {
  user?: User & { info?: UserInfo & { city: City | null } };
  batch: EventRegistrationBatch;
  modality?: EventModality | null;
  category?: ModalityCategory;
  team: Team | null;
  addon?: EventAddon | null;
  coupon?: BatchCoupon | null;
};
