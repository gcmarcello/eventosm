import { Controller, Post, Body } from "@nestjs/common";
import { SubAccountService } from "../services/subaccount.service";
import { CreateSubAccountDto } from "shared-types";

@Controller("asaas/account")
export class SubaccountController {
  constructor(private readonly subAccountService: SubAccountService) {}

  @Post("/")
  async createSubAccount(@Body() body: CreateSubAccountDto) {
    return await this.subAccountService.createSubAccount(body);
  }
}
