import { Injectable } from "@nestjs/common";
import { AsaasService } from "../../asaas.service";
import { CreateCreditCardPayment, CreatePayment } from "../../types/payment";

@Injectable()
export class PaymentService {
  constructor(private readonly asaasService: AsaasService) {}

  async createPayment(body: CreatePayment) {
    return await this.asaasService.request({
      body,
      url: "/payments",
      method: "post",
    });
  }

  async createCreditCardPayment(body: CreateCreditCardPayment) {
    return await this.asaasService.request({
      body,
      url: "/payments",
      method: "post",
    });
  }
}
