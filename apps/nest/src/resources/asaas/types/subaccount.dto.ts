import {
  IsEmail,
  IsEnum,
  IsNumber,
  IsOptional,
  Matches,
  MinLength,
} from "class-validator";

export class CreateSubAccountDto {
  @MinLength(3)
  name: string;
  @IsEmail()
  email: string;
  @MinLength(11)
  cpfCnpj: string;
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
  @IsOptional()
  birthDate?: string;
  @IsEnum(["INDIVIDUAL", "ASSOCIATION", "LIMITED", "MEI"])
  @IsOptional()
  companyType?: string;
  @MinLength(11)
  mobilePhone: string;
  @IsOptional()
  site?: string;
  @IsNumber()
  incomeValue: number;
  @MinLength(5)
  address: string;
  @MinLength(1)
  addressNumber: string;
  @IsOptional()
  complement?: string;
  @MinLength(8)
  postalCode: string;
  @MinLength(2)
  province: string;
}

export interface CreateSubAccountResponse {
  object: string;
  id: string;
  name: string;
  email: string;
  loginEmail: string;
  phone: null;
  mobilePhone: string;
  address: string;
  addressNumber: string;
  complement: null;
  province: string;
  postalCode: string;
  cpfCnpj: string;
  birthDate: null;
  personType: string;
  companyType: string;
  city: number;
  state: string;
  country: string;
  tradingName: null;
  site: null;
  walletId: string;
  apiKey: string;
  accountNumber: AccountNumber;
  incomeRange: string;
}

export interface AccountNumber {
  agency: string;
  account: string;
  accountDigit: string;
}
