import { IsString, MinLength, IsOptional, IsArray } from "class-validator";
import { OrganizationPermission } from "../entities/organizationPermission.entity";

export class CreateOrganizationRoleDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsOptional()
  @IsArray()
  permissions: OrganizationPermission[];
}
