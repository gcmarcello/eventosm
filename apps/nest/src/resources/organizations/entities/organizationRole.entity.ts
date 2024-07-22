import { Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import { organizationsSchema } from "@/infrastructure/database/constants";
import { BaseEntity } from "@/infrastructure/database/baseEntity";
import { OrganizationPermission } from "./organizationPermission.entity";
import { Organization } from "./organization.entity";
import { User } from "@/resources/users/entities/user.entity";

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
