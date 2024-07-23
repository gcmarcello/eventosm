import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { eventsSchema } from "../../../dbConstants";
import { Organization } from "../../organization/entities/organization.entity";
import { BaseEntity } from "../../../baseEntity";

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

  @ManyToOne(() => Organization)
  organization: Organization;
}
