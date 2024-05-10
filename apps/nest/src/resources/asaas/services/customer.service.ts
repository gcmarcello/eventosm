import { Injectable } from "@nestjs/common";
import { AsaasService } from "../asaas.service";
import { CreateCustomer, UpdateCustomer } from "../types/customer.dto";

@Injectable()
export class CustomerService {
  constructor(private readonly asaasService: AsaasService) {}

  async createCustomer(body: CreateCustomer) {
    return await this.asaasService.request({
      body,
      url: "/customers",
      method: "post",
    });
  }

  async getCustomer(id: string) {
    return await this.asaasService.request({
      url: `/customers/${id}`,
      method: "get",
    });
  }

  async updateCustomer(id: string, body: UpdateCustomer) {
    return await this.asaasService.request({
      body,
      url: `/customers/${id}`,
      method: "put",
    });
  }

  async deleteClient(id: string) {
    return await this.asaasService.request({
      url: `/customers/${id}`,
      method: "delete",
    });
  }
}
