import {
  EventModality,
  EventRegistration,
  EventResult,
  ModalityCategory,
  Team,
  User,
} from "@prisma/client";

export type EventResultWithInfo = EventResult & {
  Registration: EventRegistration & {
    user: { fullName: string };
    team?: Team | null;
    category?: ModalityCategory;
    modality?: EventModality | null;
  };
  position?: number;
  catPosition?: number;
};

export type EventGroupResultWithInfo = Omit<EventResultWithInfo, "eventId">;
