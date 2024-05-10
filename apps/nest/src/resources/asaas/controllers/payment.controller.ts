import { Body, Controller, Post } from "@nestjs/common";
import { PaymentService } from "../services/payment.service";
import { CreatePayment, CreateCreditCardPayment } from "shared-types";

@Controller("asaas/payment")
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post("/")
  async createPayment(@Body() body: CreatePayment) {
    return await this.paymentService.createPayment(body);
  }

  @Post("/creditcard")
  async createCreditCardPayment(@Body() body: CreateCreditCardPayment) {
    return await this.paymentService.createPayment(body);
  }
}
