import { Entity, Enum } from "@mikro-orm/core";
import { BaseEntity } from "../../../baseEntity";
import { organizationsSchema } from "../../../dbConstants";
import { OrganizationPermissions } from "../role.dto";

@Entity(organizationsSchema)
export class OrganizationPermission extends BaseEntity {
  @Enum()
  permission: OrganizationPermissions;
}
