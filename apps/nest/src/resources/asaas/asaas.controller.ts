import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import { CustomerService } from "./services/customer/customer.service";
import { PaymentService } from "./services/payment/payment.service";
import { CreateCreditCardPayment, CreatePayment } from "./types/payment";
import { CreateClient } from "./types/client";
import { CreateSubAccountDto } from "./types/subaccount";
import { SubAccountService } from "./services/subaccount/payment.service";
import { WebhookService } from "./services/webhook/webhook.service";
import { CreateWebhookDto } from "./types/webhook/webhook.request";

@Controller("asaas")
export class AsaasController {
  constructor(
    private readonly customerService: CustomerService,
    private readonly paymentService: PaymentService,
    private readonly subAccountService: SubAccountService,
    private readonly webhookService: WebhookService
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

  @Post("/account")
  async createSubAccount(@Body() body: CreateSubAccountDto) {
    return await this.subAccountService.createSubAccount(body);
  }

  @Post("/webhook")
  async receiveWebhook(@Body() body: any) {
    return await this.webhookService.receiveWebhook(body);
  }

  @Post("/admin/webhook/")
  async createWebhook(@Body() body: CreateWebhookDto) {
    return await this.webhookService.createWebhook(body);
  }

  @Get("/admin/webhook/")
  async getWebhooks() {
    return await this.webhookService.getWebhooks();
  }

  @Get("/admin/webhook/:id")
  async getWebhook(@Param() params: { id: string }) {
    return await this.webhookService.getWebhook(params.id);
  }

  @Delete("/admin/webhook/:id")
  async deleteWebhook(@Param() params: { id: string }) {
    return await this.webhookService.deleteWebhook(params.id);
  }
}
