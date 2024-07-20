import { BaseEntity } from "@/database/baseEntity";
import { Enum } from "@/database/decorators";
import { City } from "@/resources/geo/entites/city.entity";
import { State } from "@/resources/geo/entites/state.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";

export enum Gender {
  male = "male",
  female = "female",
}

@Entity()
export class UserInfo extends BaseEntity {
  @Property({ type: "date", nullable: true })
  birthDate: Date;

  @Enum(Gender)
  gender: Gender;

  @Property()
  zipCode: string;

  @Property()
  address: string;

  @Property()
  number: string;

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
