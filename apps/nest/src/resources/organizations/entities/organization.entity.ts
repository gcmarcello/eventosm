import { BaseEntity } from "@/infrastructure/database/baseEntity";
import { Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Color } from "./color.entity";
import { organizationsSchema } from "@/infrastructure/database/constants";
import { OrganizationCustomDomain } from "./organizationCustomDomain.entity";
import { User } from "@/resources/users/entities/user.entity";
import { OrganizationRole } from "./organizationRole.entity";

export type OrganizationColors = {
  primaryColor: Color;
  secondaryColor: Color;
  tertiaryColor: Color;
};

export class OrganizationOptions {
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
}
@Entity(organizationsSchema)
export class Organization extends BaseEntity {
  @Property()
  name: string;

  @Property({ type: "text" })
  description?: string;

  @Property()
  email?: string;

  @Property()
  phone?: string;

  @Property()
  document?: string;

  @Property()
  slug: string;

  @Property({ type: "jsonb", nullable: true })
  options?: OrganizationOptions;

  @OneToMany(
    () => OrganizationCustomDomain,
    (customDomain) => customDomain.organization
  )
  customDomain?: OrganizationCustomDomain;

  @OneToMany(() => OrganizationRole, (role) => role.organization)
  roles?: OrganizationRole[];

  @ManyToOne()
  owner: User;
}
