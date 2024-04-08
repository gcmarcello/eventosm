import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CustomerService } from "./services/customer/customer.service";
import { PaymentService } from "./services/payment/payment.service";
import { CreateCreditCardPayment, CreatePayment } from "./types/payment";
import { CreateClient } from "./types/client";

@Controller("asaas")
export class AsaasController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly paymentService: PaymentService
  ) {}

  @Get("/customer/:id")
  async getCustomer(@Param() params: { id: string }) {
    return await this.customerService.getClient(params.id);
  }

  @Post("/customer")
  async createCustomer(@Body() createClientDto: CreateClient) {
    return await this.customerService.createClient(createClientDto);
  }

  @Post("/payment")
  async createPayment(@Body() body: CreatePayment) {
    return await this.paymentService.createPayment(body);
  }

  @Post("/payment/cc")
  async createCreditCardPayment(@Body() body: CreateCreditCardPayment) {
    return await this.paymentService.createPayment(body);
  }
}
