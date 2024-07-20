import { Entity } from "@mikro-orm/core";
import { organizationsSchema } from "@/database/constants";
import { BaseEntity } from "@/database/baseEntity";
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

@Entity(organizationsSchema)
export class OrganizationPermission extends BaseEntity {
  @Enum(OrganizationPermissions)
  permission: OrganizationPermissions;
}
