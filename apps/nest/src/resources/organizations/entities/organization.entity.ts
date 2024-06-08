import { BaseEntity } from "@/database/baseEntity";
import { Entity, Property } from "@mikro-orm/core";
import { Color } from "./color.entity";

export type OrganizationColors = {
  primaryColor: Color;
  secondaryColor: Color;
  tertiaryColor: Color;
};

@Entity()
export class Organization extends BaseEntity {
  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  phone?: string;

  @Property()
  document?: string;

  @Property()
  slug: string;

  @Property()
  abbreviation?: string;

  @Property({ type: "jsonb", nullable: true })
  options: {
    images?: {
      bg?: string;
      hero?: string;
      logo?: string;
    };
    socialMedia?: {
      facebook?: string | null;
      instagram?: string | null;
      twitter?: string | null;
      youtube?: string | null;
    };
    colors: OrganizationColors;
    pages?: {
      documents?: boolean;
    };
  };
}
