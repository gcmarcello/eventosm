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
import { Field, InputType } from "@nestjs/graphql";

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

@InputType()
class UserInfoDto {
  @Validate(IsValidBirthDate)
  @Field({ nullable: true })
  birthDate: string;

  @IsEnum(Gender)
  @Field({ nullable: true })
  gender: Gender;

  @IsString()
  @MinLength(3, { message: "Insira o endereço." })
  @MaxLength(255)
  @Field({ nullable: true })
  address: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Field({ nullable: true })
  number: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Field({ nullable: true })
  complement?: string;

  @IsString()
  @MaxLength(10)
  @Field({ nullable: true })
  city: string;

  @IsString()
  @MaxLength(10)
  @Field({ nullable: true })
  state: string;

  @IsString()
  @MinLength(9, { message: "CEP inválido" })
  @Field({ nullable: true })
  zipCode: string;
}

@InputType()
export class CreateUserDto {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @Field()
  fullName: string;

  @IsEmail({}, { message: "Email inválido" })
  @Field()
  email: string;

  @Validate(IsCPF)
  @Field()
  document: string;

  @MinLength(10, { message: "Telefone inválido" })
  @MaxLength(255)
  @Field()
  phone: string;

  @IsString()
  @MinLength(6, { message: "A senha deve ter ao menos 6 caracteres" })
  @MaxLength(255)
  @Field()
  password: string;

  @ValidateNested()
  @Type(() => UserInfoDto)
  @Field()
  info: UserInfoDto;

  @IsBoolean()
  @Field({ nullable: true })
  acceptTerms: boolean;
}

@InputType()
export class ReadUserDto {
  @IsOptional()
  @Field({ nullable: true })
  fullName?: string;

  @IsOptional()
  @Field({ nullable: true })
  email?: string;

  @IsOptional()
  @Field({ nullable: true })
  document?: string;

  @IsOptional()
  @Field({ nullable: true })
  phone?: string;

  @IsOptional()
  @Field({ nullable: true })
  info?: UserInfoDto;
}
