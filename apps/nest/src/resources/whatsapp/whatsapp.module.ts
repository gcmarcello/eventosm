import { Module } from "@nestjs/common";
import { WhatsappWebhooksController } from "./webhook.controller";

@Module({ controllers: [WhatsappWebhooksController], providers: [] })
export class WhatsappModule {}
