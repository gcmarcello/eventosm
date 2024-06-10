import { PrimaryKey, Property } from "@mikro-orm/core";
import { uuid } from "./constants";
import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export abstract class BaseEntity {
  @Field({ nullable: true })
  @PrimaryKey(uuid)
  id!: string;

  @Field(() => Date, { nullable: true })
  @Property({ default: "now()", type: "timestamp without time zone" })
  createdAt?: Date;

  @Field(() => Date, { nullable: true })
  @Property({
    onUpdate: () => new Date(),
    type: "timestamp without time zone",
    default: "now()",
  })
  updatedAt?: Date;
}
