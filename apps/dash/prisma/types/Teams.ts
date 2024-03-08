import { EventRegistration, Team } from "@prisma/client";
import { UserWithInfo } from "./User";

export type TeamWithUsers = Team & {
  User: (UserWithInfo & { EventRegistration?: EventRegistration[] })[];
};
