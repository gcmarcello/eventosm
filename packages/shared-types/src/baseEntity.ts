import { Entity, PrimaryKey, Property } from "@mikro-orm/core";
import { uuid } from "./dbConstants";

export class BaseEntity {
  @PrimaryKey(uuid)
  id!: string;

  @Property({ defaultRaw: "now()", type: "timestamp without time zone" })
  createdAt?: Date;

  @Property({
    type: "timestamp without time zone",
    onUpdate: () => new Date(),
    defaultRaw: "now()",
  })
  updatedAt?: Date;
}
