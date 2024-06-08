import { Entity, OneToMany, PrimaryKey, Property } from "@mikro-orm/core";
import { Field, ObjectType } from "@nestjs/graphql";
import { City } from "./city.entity";

@ObjectType()
@Entity({ schema: "geo" })
export class State {
  @Field({ nullable: true })
  @PrimaryKey({ type: "string" })
  id!: string;

  @Field({ nullable: true })
  @Property({ unique: true })
  uf!: string;

  @Field({ nullable: true })
  @Property({ unique: true })
  name!: string;

  @Field(() => [City], { nullable: true })
  @OneToMany(() => City, (city) => city.state)
  city: City;
}
