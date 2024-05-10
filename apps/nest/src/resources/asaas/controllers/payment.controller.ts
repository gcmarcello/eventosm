import { Body, Controller, Post } from "@nestjs/common";

import { CreateCreditCardPayment, CreatePayment } from "../types/payment.dto";
import { PaymentService } from "../services/payment.service";

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
