import { Controller, Post, Body } from "@nestjs/common";
import { CreateSubAccountDto } from "../types/subaccount.dto";
import { SubAccountService } from "../services/subaccount.service";

@Controller("asaas/account")
export class SubaccountController {
  constructor(private readonly subAccountService: SubAccountService) {}

  @Post("/")
  async createSubAccount(@Body() body: CreateSubAccountDto) {
    return await this.subAccountService.createSubAccount(body);
  }
}
