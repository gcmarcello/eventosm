import { Module } from "@nestjs/common";
import { AsaasService } from "./asaas.service";
import { AsaasController } from "./asaas.controller";
import { CustomerService } from "./services/customer/customer.service";
import { PaymentService } from "./services/payment/payment.service";

@Module({
  controllers: [AsaasController],
  providers: [AsaasService, CustomerService, PaymentService],
})
export class AsaasModule {}
