import { PartialType } from "@nestjs/mapped-types";
import { IsEmail, IsUUID, MinLength } from "class-validator";

export class CreateClientDto {
  @MinLength(11)
  name: string;
  @IsEmail()
  email: string;
  @MinLength(11)
  cpfCnpj: string;
  @MinLength(11)
  mobilePhone: string;
  @IsUUID()
  externalReference: string;
  phone?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
}

export class UpdateClientDto extends PartialType(CreateClientDto) {
  id: string;
}
