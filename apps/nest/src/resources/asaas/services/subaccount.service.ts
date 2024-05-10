import { Injectable } from "@nestjs/common";
import { AsaasService } from "../asaas.service";
import { CreateSubAccountDto } from "shared-types";

@Injectable()
export class SubAccountService {
  constructor(private readonly asaasService: AsaasService) {}

  async createSubAccount(body: CreateSubAccountDto) {
    return await this.asaasService.request({
      body,
      url: "/accounts/",
      method: "post",
    });
  }

  async getSubAccount(id: string) {
    return await this.asaasService.request({
      url: `/accounts?id=${id}`,
      method: "get",
    });
  }
}
