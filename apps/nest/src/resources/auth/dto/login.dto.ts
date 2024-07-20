import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @MinLength(6)
  identifier: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsBoolean()
  @IsOptional()
  isEmail?: boolean;
}
