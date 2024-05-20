import { Injectable } from "@nestjs/common";
import { AsaasService } from "../asaas.service";
import { CreateCreditCardPayment, CreatePayment } from "shared-types";

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

  async deletePayment(body: { paymentId: string }) {
    return await this.asaasService.request({
      body,
      url: "/payments",
      method: "delete",
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
