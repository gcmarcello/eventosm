import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsUUID,
  IsUrl,
  MinLength,
} from "class-validator";
import { EventType } from "./events";

export class CreateWebhookDto {
  @IsEnum(["SEQUENTIALLY", "NON_SEQUENTIALLY"])
  sendType: string;
  @MinLength(3)
  name: string;
  @IsUrl()
  url: string;
  @IsEmail()
  email: string;
  @IsBoolean()
  enabled: boolean;
  @IsBoolean()
  interrupted: false;
  @IsOptional()
  authToken?: string;
  events: EventType[];
}

export class UpdateWebhookDto extends CreateWebhookDto {
  @IsUUID()
  id: string;
}
