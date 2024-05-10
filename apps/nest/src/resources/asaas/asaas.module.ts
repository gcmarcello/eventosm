import { Module } from "@nestjs/common";
import { AsaasService } from "./asaas.service";
import { AsaasController } from "./asaas.controller";
import { CustomerService } from "./services/customer.service";
import { PaymentService } from "./services/payment.service";
import { SubAccountService } from "./services/subaccount.service";
import { WebhookService } from "./services/webhook.service";
import { CustomerController } from "./controllers/customer.controller";
import { PaymentController } from "./controllers/payment.controller";
import { SubaccountController } from "./controllers/subaccount.controller";
import { WebhookController } from "./controllers/webhook.controller";

@Module({
  controllers: [
    AsaasController,
    CustomerController,
    PaymentController,
    SubaccountController,
    WebhookController,
  ],
  providers: [
    AsaasService,
    CustomerService,
    PaymentService,
    SubAccountService,
    WebhookService,
  ],
})
export class AsaasModule {}
