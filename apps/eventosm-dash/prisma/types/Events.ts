import {
  Event,
  EventAddon,
  EventGroup,
  EventGroupRules,
  EventModality,
  EventRegistration,
  EventRegistrationBatch,
  ModalityCategory,
  User,
} from "@prisma/client";

export type EventWithRegistrationCount = Event & {
  _count: { EventRegistration: number };
} & {
  EventRegistrationBatch: (EventRegistrationBatch & {
    _count: { EventRegistration: number };
  })[];
};

export type EventModalityWithCategories = EventModality & {
  modalityCategory: ModalityCategory[];
};

export type EventGroupWithInfo = EventGroup & {
  Event: Event[];
  Rules?: EventGroupRules;
  EventAddon?: EventAddon[];
  EventRegistration?: (EventRegistration & { user: User })[];
  EventModality: EventModalityWithCategories[];
  EventRegistrationBatch: (EventRegistrationBatch & {
    _count: { EventRegistration: number };
  })[];
};

export type EventGroupWithEvents = EventGroup & { Event: Event[] };
