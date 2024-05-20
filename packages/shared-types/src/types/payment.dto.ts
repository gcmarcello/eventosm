import {
  IsEmail,
  IsEnum,
  IsObject,
  IsPositive,
  Length,
  Matches,
  MinLength,
} from "class-validator";

export class CreatePayment {
  @MinLength(7)
  customer: string;
  @IsEnum(["CREDIT_CARD", "PIX", "BOLETO"])
  billingType: PaymentType;
  @IsPositive()
  value: number;
  @Matches(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)
  dueDate: string;
  externalReference?: string;
  description?: string;
  installmentCount?: number;
  totalValue?: number;
  installmentValue?: number;
  discount?: Discount;
  interest?: {
    value: number;
  };
  fine?: Fine;
  postalService?: boolean;
  split?: SplitPayment[];
  callback?: {
    successUrl: string;
    autoRedirect?: boolean;
  };
}

export class CreditCardInfo {
  @MinLength(5)
  holderName: string;
  @MinLength(16)
  number: string;
  @Length(2)
  expiryMonth: string;
  @Length(4)
  expiryYear: string;
  @MinLength(3)
  ccv: string;
}

export class creditCardHolderInfo {
  @MinLength(5)
  name: string;
  @IsEmail()
  email: string;
  @MinLength(11)
  cpfCnpj: string;
  @MinLength(8)
  postalCode: string;
  @MinLength(1)
  addressNumber: string;
  addressComplement?: string;
  @MinLength(9)
  phone: string;
}

export class CreateCreditCardPayment extends CreatePayment {
  @IsObject()
  creditCard: CreditCardInfo;
  @IsObject()
  creditCardHolderInfo: creditCardHolderInfo;
  creditCardToken?: string;
  authorizeOnly?: boolean;
  remoteIp: string;
}

export class UpdatePayment extends CreatePayment {
  id: string;
}

export type PaymentType = ["CREDIT_CARD", "PIX", "BOLETO"][number];

export class SplitPayment {
  walletId: string;
  fixedValue?: number;
  percentualValue?: number;
  totalFixedValue?: number;
}

interface Discount {
  value: number;
  dueDateLimitDays: number;
  type: "FIXED" | "PERCENTAGE";
}

interface Fine {
  value: number;
  type: "FIXED" | "PERCENTAGE";
}
