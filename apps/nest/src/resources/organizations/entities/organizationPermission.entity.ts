import { Entity } from "@mikro-orm/core";
import { organizationsSchema } from "@/database/constants";
import { BaseEntity } from "@/database/baseEntity";
import { Enum } from "@/database/decorators";
import { OrganizationPermissions } from "shared-types";

@Entity(organizationsSchema)
export class OrganizationPermission extends BaseEntity {
  @Enum(OrganizationPermissions)
  permission: OrganizationPermissions;
}
