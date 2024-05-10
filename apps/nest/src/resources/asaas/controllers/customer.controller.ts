import { Body, Controller, Get, Param, Post } from "@nestjs/common";

import { CustomerService } from "../services/customer.service";
import { CreateCustomer } from "../types/customer.dto";

@Controller("asaas/customer")
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post("/")
  async createCustomer(@Body() createCustomerDto: CreateCustomer) {
    return await this.customerService.createCustomer(createCustomerDto);
  }

  @Get("/:id")
  async getCustomer(@Param() params: { id: string }) {
    return await this.customerService.getCustomer(params.id);
  }
}
