import { Field } from "@nestjs/graphql";
import { IsString, MinLength } from "class-validator";

export class CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  @Field({ nullable: true })
  name: string;

  @IsString()
  @MinLength(3)
  @Field({ nullable: true })
  description?: string;

  @IsString()
  @Field({ nullable: true })
  email?: string;

  @IsString()
  @Field({ nullable: true })
  phone?: string;

  @IsString()
  @Field({ nullable: true })
  document?: string;

  @IsString()
  @MinLength(3)
  @Field({ nullable: true })
  slug: string;
}

export class UpdateOrganizationDto extends CreateOrganizationDto {
  @IsString()
  @MinLength(3)
  @Field()
  id: string;
}
