import { Entity, ManyToOne, PrimaryKey, Property } from "@mikro-orm/core";

import { Field, ObjectType } from "@nestjs/graphql";
import { State } from "./state.entity";

@ObjectType()
@Entity({ schema: "geo" })
export class City {
  @Field({ nullable: true })
  @PrimaryKey({ type: "string" })
  id!: string;

  @Field({ nullable: true })
  @Property({ unique: true })
  uf!: string;

  @Field({ nullable: true })
  @Property({ unique: true })
  name!: string;

  @Field(() => [State], { nullable: true })
  @ManyToOne()
  state: State;
}
