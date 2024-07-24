import {
  IsDefined,
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from "class-validator";
import { OrganizationOptions } from "./entities/organization.entity";
import { Type } from "class-transformer";
import { IsSlug } from "../../decorators/IsSlug.decorator";
export class CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  name: string;

  @MinLength(3)
  @IsOptional()
  description?: string;

  @IsDefined()
  @ValidateNested()
  @Type(() => OrganizationOptions)
  options: OrganizationOptions;

  @IsEmail()
  @IsOptional()
  email?: string;

  @MinLength(9)
  @IsOptional()
  phone?: string;

  @MinLength(11)
  @IsOptional()
  document?: string;

  @IsSlug()
  slug: string;
}
export class UpdateOrganizationDto extends CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  id: string;
}

export class ReadOrganizationDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  ownerId?: string;

  @IsOptional()
  slug?: string;
}
