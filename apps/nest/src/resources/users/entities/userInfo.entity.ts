import { BaseEntity } from "@/database/baseEntity";
import { createEnum } from "@/database/createEnum";
import { Enum } from "@/database/decorators";
import { City } from "@/resources/geo/entites/city.entity";
import { State } from "@/resources/geo/entites/state.entity";
import { Entity, OneToOne, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";

enum Gender {
  male,
  female,
}

export const gender = createEnum(Gender, "Gender");

@ObjectType()
@Entity()
export class UserInfo extends BaseEntity {
  @Field({ nullable: true })
  @Property()
  birthDate: Date;

  @Field({ nullable: true })
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
  complement: string;

  @Field({ nullable: true })
  @Property()
  support: boolean;

  @Field({ nullable: true })
  @OneToOne()
  state: State;

  @Field({ nullable: true })
  @OneToOne()
  city: City;
}
