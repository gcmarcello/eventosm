//client
import { IsBoolean, IsOptional, IsString, MinLength } from "class-validator";
import { CreateUserDto } from "../user/user.dto";

export class LoginDto {
  @IsString()
  @MinLength(6, { message: "Seu Email/CPF deve ter no mínimo 6 caracteres." })
  identifier: string;

  @IsString()
  @MinLength(6, { message: "A senha deve ter no mínimo 6 caracteres." })
  password: string;

  @IsBoolean()
  @IsOptional()
  isEmail?: boolean;

  @IsOptional()
  @IsBoolean()
  remember?: boolean;
}

export class SignupDto extends CreateUserDto {}
