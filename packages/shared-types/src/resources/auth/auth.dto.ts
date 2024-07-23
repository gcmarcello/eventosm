import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "../user/user.dto.js";

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

export class SignupDto extends CreateUserDto {}
