import { Reflector } from "@nestjs/core";

export enum OrganizationPermissions {
  CreateOrganization = "create:organization",
  UpdateOrganization = "update:organization",
  DeleteOrganization = "delete:organization",
  ReadPrivateOrganizations = "read:private-organizations",
  CreateEvent = "create:event",
  UpdateEvent = "update:event",
  DeleteEvent = "delete:event",
  ReadPrivateEvents = "read:private-events",
  CreateTournament = "create:tournament",
  UpdateTournament = "update:tournament",
  DeleteTournament = "delete:tournament",
  ReadPrivateTournaments = "read:private-tournaments",
  CreateNews = "create:news",
  UpdateNews = "update:news",
  DeleteNews = "delete:news",
  ReadPrivateNews = "read:private-news",
}

export const Permissions =
  Reflector.createDecorator<OrganizationPermissions[]>();
