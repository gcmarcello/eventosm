export class CreatePaymentDto {
  customer: string;
  billingType: string;
  value: number;
  dueDate: string;
  description: string;
  daysAfterDueDateToRegistrationCancellation?: string;
  externalReference?: string;
  installmentCount?: number;
  totalValue?: number;
  installmentValue?: number;
  discount?: {
    value: number;
    dueDateLimit: string;
    type: "FIXED" | "PERCENTAGE";
  };
  interest?: {
    value: number;
  };
  fine?: {
    value: number;
    type: "FIXED" | "PERCENTAGE";
  };
  postalService?: boolean;
  split?: {
    walletId: string;
    fixedValue?: number;
    percentualValue?: number;
    totalFixedValue?: number;
  }[];
  callback?: {
    successUrl: string;
    autoRedirect: boolean;
  };
}
