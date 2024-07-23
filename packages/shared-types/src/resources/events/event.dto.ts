import {
  IsDate,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";

export class CreateEventDto {
  @IsUUID()
  organization: string;

  @IsString()
  @MinLength(3, {
    message: "O nome do evento precisa ter ao menos 3 caracteres.",
  })
  name: string;

  @IsString()
  @MinLength(3, {
    message: "O slug do evento precisa ter ao menos 3 caracteres.",
  })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDate()
  dateStart: Date;

  @IsDate()
  dateEnd?: Date;

  @IsString()
  @IsOptional()
  location?: string;
}
