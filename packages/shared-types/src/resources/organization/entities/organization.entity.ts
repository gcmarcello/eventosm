import { Entity, Enum, ManyToOne, OneToMany, Property } from "@mikro-orm/core";
import { Color } from "./color.entity";
import { OrganizationCustomDomain } from "./organizationCustomDomain.entity";
import { OrganizationRole } from "./organizationRole.entity";
import { organizationsSchema } from "../../../dbConstants";
import { User } from "../../user/entities/user.entity";
import { Event } from "../../events/entities/event.entity";
import { BaseEntity } from "../../../baseEntity";
import { IsDefined, IsEnum, IsOptional } from "class-validator";

export type OrganizationColors = {
  primaryColor: Color;
  secondaryColor: Color;
  tertiaryColor: Color;
};

export enum Timezones {
  "America/Noronha" = "America/Noronha",
  "America/Sao_Paulo" = "America/Sao_Paulo",
  "America/Manaus" = "America/Manaus",
  "America/Rio_Branco" = "America/Rio_Branco",
}

export class OrganizationOptions {
  @IsOptional()
  images?: {
    bg?: string;
    hero?: string;
    logo?: string;
  };
  @IsOptional()
  socialMedia?: {
    facebook?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    youtube?: string | null;
  };
  @IsOptional()
  colors?: OrganizationColors;
  @IsOptional()
  pages?: {
    documents?: boolean;
  };
  @IsDefined()
  @IsEnum(Timezones, {
    message: "Fuso horário inválido. Por favor utilize o formato TZ.",
  })
  timezone: Timezones = Timezones["America/Sao_Paulo"];
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

  @Property({ unique: true })
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

  @OneToMany(() => Event, (event) => event.organization)
  events?: Event[];
}
