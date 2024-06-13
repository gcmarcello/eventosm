import { BaseEntity } from "@/database/baseEntity";
import { Entity, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Color } from "./color.entity";
import { organizationsSchema } from "@/database/constants";
import { Field } from "@nestjs/graphql";
import { OrganizationCustomDomain } from "./organizationCustomDomain.entity";
import { User } from "@/resources/users/entities/user.entity";

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
  @Field({ nullable: true })
  @Property()
  name: string;

  @Field({ nullable: true })
  @Property({ type: "text" })
  description: string;

  @Field({ nullable: true })
  @Property()
  email: string;

  @Field({ nullable: true })
  @Property()
  phone?: string;

  @Field({ nullable: true })
  @Property()
  document?: string;

  @Field({ nullable: true })
  @Property()
  slug: string;

  @Field(() => OrganizationOptions, { nullable: true })
  @Property({ type: "jsonb", nullable: true })
  options: OrganizationOptions;

  @Field(() => [OrganizationCustomDomain], { nullable: true })
  @OneToMany(
    () => OrganizationCustomDomain,
    (customDomain) => customDomain.organization
  )
  customDomain?: OrganizationCustomDomain;

  @Field(() => User)
  @ManyToOne()
  owner: User;
}
