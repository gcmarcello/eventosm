import { Injectable } from "@nestjs/common";
import { AsaasService } from "../../asaas.service";
import { CreateClient, UpdateClient } from "../../types/client";

@Injectable()
export class CustomerService {
  constructor(private readonly asaasService: AsaasService) {}

  async createClient(body: CreateClient) {
    return await this.asaasService.request({
      body,
      url: "/customers",
      method: "post",
    });
  }

  async getClient(id: string) {
    return await this.asaasService.request({
      url: `/customers/${id}`,
      method: "get",
    });
  }

  async updateClient(id: string, body: UpdateClient) {
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
