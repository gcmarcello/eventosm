import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { OrganizationPermission } from "./organizationPermission.entity";
import { Organization } from "./organization.entity";
import { organizationsSchema } from "../../../dbConstants";
import { BaseEntity } from "../../../baseEntity";
import { User } from "../../user/entities/user.entity";

@Entity(organizationsSchema)
export class OrganizationRole extends BaseEntity {
  @Property()
  name: string;

  @ManyToOne(() => Organization, { nullable: true })
  organization: Organization;

  @ManyToMany(() => OrganizationPermission)
  permissions?: OrganizationPermission[];

  @ManyToMany(() => User)
  users?: User[];
}
