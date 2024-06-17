import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, MinLength } from "class-validator";
@InputType()
export class CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  @Field()
  name: string;

  @MinLength(3)
  @IsOptional()
  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  document?: string;

  @IsString()
  @MinLength(3)
  @Field()
  slug: string;
}
@InputType()
export class UpdateOrganizationDto extends CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  @Field()
  id: string;
}

@InputType()
export class ReadOrganizationDto {
  @IsOptional()
  @Field()
  id: string;

  @IsOptional()
  @Field()
  ownerId: string;

  @IsOptional()
  @Field()
  slug: string;
}
