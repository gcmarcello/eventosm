import { IsString, MinLength, IsOptional, IsArray } from "class-validator";

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

export class CreateOrganizationRoleDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsArray()
  permissions: OrganizationPermissions[];
}
