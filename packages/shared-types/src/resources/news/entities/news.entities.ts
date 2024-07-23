import { BaseEntity } from "../../../baseEntity";
import { Entity, Enum, Property } from "@mikro-orm/core";

enum NewsStatus {
  draft = "draft",
  published = "published",
  archived = "archived",
}

@Entity()
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

  @Enum()
  status: NewsStatus;
}
