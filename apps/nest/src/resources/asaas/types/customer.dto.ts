import { PartialType } from "@nestjs/swagger";
import { MinLength, IsEmail, IsUUID } from "class-validator";

export class CreateCustomer {
  @MinLength(5)
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

export class UpdateCustomer extends PartialType(CreateCustomer) {
  id: string;
}
export interface CreateCustomerResponse {
  object: "customer";
  id: string;
  dateCreated: Date;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  mobilePhone: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  postalCode?: string;
  cpfCnpj: string;
  personType: string;
  deleted: boolean;
  additionalEmails?: string[];
  externalReference: string;
  notificationDisabled: boolean;
  observations?: string;
  municipalInscription?: string;
  stateInscription?: string;
  canDelete: boolean;
  cannotBeDeletedReason?: string;
  canEdit: boolean;
  cannotEditReason?: string;
  city?: string;
  state?: string;
  country: string;
}
