import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
} from "@nestjs/common";
import { WebhookService } from "../services/webhook.service";
import { CreateWebhookDto } from "../types/webhook/webhook.dto";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Asaas Webhook")
@Controller("asaas/webhook")
export class WebhookController {
  constructor(private readonly webhookService: WebhookService) {}

  @Post("/receive")
  async receiveWebhook(@Body() body: any, @Res() res: Response) {
    res.status(200).send();
    return await this.webhookService.receiveWebhook(body);
  }

  @Post("/")
  async createWebhook(@Body() body: CreateWebhookDto) {
    return await this.webhookService.createWebhook(body);
  }

  @Get("/")
  async getWebhooks() {
    return await this.webhookService.getWebhooks();
  }

  @Get("/:id")
  async getWebhook(@Param() params: { id: string }) {
    return await this.webhookService.getWebhook(params.id);
  }

  @Delete("/:id")
  async deleteWebhook(@Param() params: { id: string }) {
    return await this.webhookService.deleteWebhook(params.id);
  }
}
