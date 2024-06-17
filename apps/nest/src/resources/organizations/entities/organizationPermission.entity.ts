import { Entity } from "@mikro-orm/core";
import { organizationsSchema } from "@/database/constants";
import { BaseEntity } from "@/database/baseEntity";
import { createEnum } from "@/database/createEnum";
import { Enum } from "@/database/decorators";

export enum OrganizationPermissions {
  CreateOrganization = "organization:create",
  UpdateOrganization = "organization:update",
  DeleteOrganization = "organization:delete",
  ReadPrivateOrganizations = "organization:read-private",
  CreateEvent = "event:create",
  UpdateEvent = "event:update",
  DeleteEvent = "event:delete",
  ReadPrivateEvents = "event:read-private",
  CreateTournament = "tournament:create",
  UpdateTournament = "tournament:update",
  DeleteTournament = "tournament:delete",
  ReadPrivateTournaments = "tournaments:read-private",
  CreateNews = "news:create",
  UpdateNews = "news:update",
  DeleteNews = "news:delete",
  ReadPrivateNews = "news:read-private",
}

export const organizationPermission = createEnum(
  OrganizationPermissions,
  "OrganizationPermissions"
);

@Entity(organizationsSchema)
export class OrganizationPermission extends BaseEntity {
  @Enum(organizationPermission)
  permission: OrganizationPermissions;
}
