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
  IsDefined,
  IsStrongPassword,
} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from "@nestjs/swagger";
import { birthDateValidator } from "../../validators/birthDate.validator";
import { cpfValidator } from "../../validators/cpf.validator";

export enum Gender {
  male = "male",
  female = "female",
}

export enum Role {
  admin = "admin",
  user = "user",
}

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
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  number?: string;

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
  @IsString({ message: "Nome inválido" })
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @IsString({ message: "Sobrenome inválido" })
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

  @IsStrongPassword(
    {
      minLength: 8,
      minSymbols: 1,
      minNumbers: 1,
      minUppercase: 1,
      minLowercase: 1,
    },
    {
      message:
        "A senha precisa conter no mínimo: 8 caracteres, 1 símbolo, 1 letra maíuscula e 1 número.",
    }
  )
  password: string;

  @IsDefined()
  @ValidateNested({ each: true })
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

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsString()
  @MinLength(3)
  id: string;
}
