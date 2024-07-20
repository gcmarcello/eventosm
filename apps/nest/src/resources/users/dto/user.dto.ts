import { birthDateValidator } from "@/utils/validators/birthDate.validator";
import { cpfValidator } from "@/utils/validators/cpf.validator";
import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidateNested,
  IsEnum,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Gender } from "../entities/userInfo.entity";
import { Type } from "class-transformer";
import { Role } from "../entities/user.entity";

@ValidatorConstraint({ async: false })
class IsValidBirthDate implements ValidatorConstraintInterface {
  validate(date: string) {
    return birthDateValidator(date, { maxAge: 120, minAge: 1 });
  }

  defaultMessage() {
    return "Idade inválida";
  }
}

@ValidatorConstraint({ async: false })
class IsCPF implements ValidatorConstraintInterface {
  validate(text: string) {
    return cpfValidator(text);
  }

  defaultMessage() {
    return "CPF inválido.";
  }
}

class UserInfoDto {
  @Validate(IsValidBirthDate)
  birthDate: string;

  @IsEnum(Gender)
  gender: Gender;

  @IsString()
  @MinLength(3, { message: "Insira o endereço." })
  @MaxLength(255)
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  number: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  complement?: string;

  @IsString()
  @MaxLength(10)
  city: string;

  @IsString()
  @MaxLength(10)
  state: string;

  @IsString()
  @MinLength(9, { message: "CEP inválido" })
  zipCode: string;
}

export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(100)
  lastName: string;

  @IsEmail({}, { message: "Email inválido" })
  email: string;

  @Validate(IsCPF)
  document: string;

  @MinLength(10, { message: "Telefone inválido" })
  @MaxLength(255)
  phone: string;

  @IsString()
  @MinLength(6, { message: "A senha deve ter ao menos 6 caracteres" })
  @MaxLength(255)
  password: string;

  @ValidateNested()
  @Type(() => UserInfoDto)
  info: UserInfoDto;

  @IsBoolean()
  acceptTerms: boolean;
}

export class ReadUserDto {
  @IsOptional()
  id?: string;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  document?: string;

  @IsOptional()
  phone?: string;

  @IsOptional()
  role?: Role;

  @IsOptional()
  info?: UserInfoDto;
}
