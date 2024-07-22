import { BaseEntity } from "@/infrastructure/database/baseEntity";
import { Enum } from "@/infrastructure/database/decorators";
import { City } from "@/resources/geo/entites/city.entity";
import { State } from "@/resources/geo/entites/state.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Gender } from "shared-types";

@Entity()
export class UserInfo extends BaseEntity {
  @Property({ type: "date", nullable: true })
  birthDate: Date;

  @Enum(Gender)
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
