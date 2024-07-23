import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { uuid } from "./dbConstants";

export class BaseEntity {
  @PrimaryKey(uuid)
  id!: string;

  @Property({ default: "now()", type: "timestamp without time zone" })
  createdAt?: Date;

  @Property({
    onUpdate: () => new Date(),
    type: "timestamp without time zone",
    default: "now()",
  })
  updatedAt?: Date;
}
