import {
  EventAddon,
  EventModality,
  EventRegistration,
  ModalityCategory,
  Payment,
  User,
} from "@prisma/client";
import { UserWithoutPassword } from "./User";

export type PaymentWithRegistrations = Payment & {
  EventRegistration: (EventRegistration & {
    user: UserWithoutPassword;
    modality: EventModality | null;
    category: ModalityCategory;
    addon: EventAddon | null;
  })[];
};
