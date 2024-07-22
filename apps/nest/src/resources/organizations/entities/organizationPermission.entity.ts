import { Entity } from "@mikro-orm/core";
import { organizationsSchema } from "@/infrastructure/database/constants";
import { BaseEntity } from "@/infrastructure/database/baseEntity";
import { Enum } from "@/infrastructure/database/decorators";
import { OrganizationPermissions } from "shared-types";

@Entity(organizationsSchema)
export class OrganizationPermission extends BaseEntity {
  @Enum(OrganizationPermissions)
  permission: OrganizationPermissions;
}
