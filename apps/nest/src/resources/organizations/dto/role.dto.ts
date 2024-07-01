import { Field, InputType } from "@nestjs/graphql";
import { IsString, MinLength, IsOptional, IsArray } from "class-validator";
import { OrganizationPermission } from "../entities/organizationPermission.entity";

@InputType()
export class CreateOrganizationRoleDto {
  @IsString()
  @MinLength(3)
  @Field()
  name: string;

  @IsOptional()
  @IsArray()
  permissions: OrganizationPermission[];
}
