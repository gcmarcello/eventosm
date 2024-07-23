import { Entity, ManyToOne, Property } from "@mikro-orm/core";
import { Organization } from "./organization.entity";
import { BaseEntity } from "../../../baseEntity";
import { organizationsSchema } from "../../../dbConstants";

@Entity(organizationsSchema)
export class OrganizationCustomDomain extends BaseEntity {
  @Property()
  domain: string;

  @ManyToOne(() => Organization, { nullable: true })
  organization: Organization;
}
