import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";
export class CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  name: string;

  @MinLength(3)
  @IsOptional()
  description?: string;

  @IsEmail()
  email?: string;

  @MinLength(9)
  phone?: string;

  @MinLength(11)
  document?: string;

  @IsString()
  @MinLength(3)
  slug: string;
}
export class UpdateOrganizationDto extends CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  id: string;
}

export class ReadOrganizationDto {
  @IsOptional()
  id: string;

  @IsOptional()
  ownerId: string;

  @IsOptional()
  slug: string;
}
