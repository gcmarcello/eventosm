import {
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
  };
  position?: number;
};

export type EventGroupResultWithInfo = Omit<EventResultWithInfo, "eventId">;
