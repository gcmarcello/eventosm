import {
  IsDate,
  IsDateString,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from "class-validator";
import { EventOptions } from "./entities/event.entity";

export class CreateEventDto {
  @IsUUID()
  organization: string;

  @IsString()
  @MinLength(3, {
    message: "O nome do evento precisa ter ao menos 3 caracteres.",
  })
  name: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @MinLength(3, {
    message: "O slug do evento precisa ter ao menos 3 caracteres.",
  })
  slug: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  dateStart: string;

  @IsDateString()
  dateEnd?: string;

  @IsOptional()
  options?: EventOptions;
}
