import { BaseEntity } from "@/database/baseEntity";
import { Property } from "@mikro-orm/core";

enum NewsStatus {
  draft,
  published,
  archived,
}

export class News extends BaseEntity {
  @Property()
  title: string;

  @Property()
  subtitle: string;

  @Property()
  content: string;

  @Property()
  imageUrl: string;

  @Property()
  slug: string;

  @Property()
  status: NewsStatus;
}
