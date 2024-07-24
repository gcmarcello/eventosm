import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { eventsSchema } from "../../../dbConstants";
import { Organization } from "../../organization/entities/organization.entity";
import { BaseEntity } from "../../../baseEntity";

export enum EventStatus {
  PENDING = "pending",
  ACTIVE = "active",
  FINISHED = "finished",
  CANCELLED = "cancelled",
}

export class EventOptions {
  images?: {
    logo?: string;
    banner?: string;
  };
  registrationOptions?: {
    registrationType: "mixed" | "individual" | "team";
  };
}

@Entity(eventsSchema)
export class Event extends BaseEntity {
  @Property()
  name: string;

  @Property()
  slug: string;

  @Property()
  description?: string;

  @Property()
  rules?: string;

  @Property()
  location?: string;

  @Property()
  dateStart: Date;

  @Property()
  dateEnd?: Date;

  @Enum({ default: EventStatus.PENDING })
  status: EventStatus;

  @Property({ type: "jsonb", nullable: true })
  options?: EventOptions;

  @ManyToOne(() => Organization)
  organization: Organization;
}
