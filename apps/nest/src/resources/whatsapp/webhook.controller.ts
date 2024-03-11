import { Controller, Get, Post, Body, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { SignatureGuard } from "./signature.guard";
import { WebhookGuard } from "./webhook.guard";

@ApiTags("webhooks")
@Controller("webhooks/whatsapp")
export class WhatsappWebhooksController {
  constructor() {}

  @UseGuards(WebhookGuard)
  @Get()
  async auth(@Req() req) {
    return req["hub.challenge"];
  }

  @UseGuards(SignatureGuard)
  @Post()
  async receiver(@Body() body) {
    console.dir(body, { depth: null });
  }
}
