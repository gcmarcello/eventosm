import { Entity, Enum, ManyToOne, Property } from "@mikro-orm/core";
import { Gender } from "../user.dto";
import { State } from "../../geo/entities/state.entity";
import { City } from "../../geo/entities/city.entity";
import { BaseEntity } from "../../../baseEntity";

@Entity()
export class UserInfo extends BaseEntity {
  @Property({ type: "date", nullable: true })
  birthDate: Date;

  @Enum()
  gender: Gender;

  @Property()
  zipCode: string;

  @Property()
  address?: string;

  @Property()
  number?: string;

  @Property()
  complement?: string;

  @Property()
  support?: string;

  @ManyToOne(() => State, {
    nullable: true,
  })
  state?: State;

  @ManyToOne(() => City, { nullable: true })
  city?: City;
}
