import { BaseEntity } from "../../../baseEntity";
import { Entity, Property } from "@mikro-orm/core";

@Entity()
export class PasswordRecovery extends BaseEntity {
  @Property()
  token: string;
}
