import { Body, Controller, Get, Post } from "@nestjs/common";
import { AsaasService } from "./asaas.service";
import { CreateClientDto } from "./dto/client.dto";

@Controller("asaas")
export class AsaasController {
  constructor(private readonly asaasService: AsaasService) {}

  @Get("/client")
  async find() {
    return "xd";
  }

  @Post("/client")
  async findAll(@Body() createClientDto: CreateClientDto) {
    return await this.asaasService.createClient(createClientDto);
  }
}
