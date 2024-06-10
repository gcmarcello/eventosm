import { BaseEntity } from "@/database/baseEntity";
import { createEnum } from "@/database/createEnum";
import { Enum } from "@/database/decorators";
import { City } from "@/resources/geo/entites/city.entity";
import { State } from "@/resources/geo/entites/state.entity";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

export enum Gender {
  male = "male",
  female = "female",
}

export const gender = createEnum(Gender, "Gender");

@ObjectType()
@Entity()
export class UserInfo extends BaseEntity {
  @Field({ nullable: true })
  @Property({ type: "date", nullable: true })
  birthDate: Date;

  @Field(() => Gender, { nullable: true })
  @Enum(gender)
  gender: Gender;

  @Field({ nullable: true })
  @Property()
  zipCode: string;

  @Field({ nullable: true })
  @Property()
  address: string;

  @Field({ nullable: true })
  @Property()
  number: string;

  @Field({ nullable: true })
  @Property()
  complement?: string;

  @Field({ nullable: true })
  @Property()
  support?: string;

  @Field({ nullable: true })
  @ManyToOne(() => State, {
    nullable: true,
  })
  state?: State;

  @Field({ nullable: true })
  @ManyToOne(() => City, { nullable: true })
  city?: City;
}
