import { BaseEntity } from "@/database/baseEntity";
import { createEnum } from "@/database/createEnum";
import { Property } from "@mikro-orm/core";
import { Field } from "@nestjs/graphql";

enum NewsStatus {
  draft,
  published,
  archived,
}

export const gender = createEnum(NewsStatus, "NewsStatus");

export class News extends BaseEntity {
  @Field({ nullable: true })
  @Property()
  title: string;

  @Field({ nullable: true })
  @Property()
  subtitle: string;

  @Field({ nullable: true })
  @Property()
  content: string;

  @Field({ nullable: true })
  @Property()
  imageUrl: string;

  @Field({ nullable: true })
  @Property()
  slug: string;

  @Field(() => NewsStatus, { nullable: true })
  @Property()
  status: NewsStatus;
}
