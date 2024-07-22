import { BaseEntity } from "@/infrastructure/database/baseEntity";
import { organizationsSchema } from "@/infrastructure/database/constants";
import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Organization } from "./organization.entity";

@Entity(organizationsSchema)
export class OrganizationCustomDomain extends BaseEntity {
  @Property()
  domain: string;

  @ManyToOne(() => Organization, { nullable: true })
  organization: Organization;
}
