import { Injectable } from "@nestjs/common";
import { AsaasService } from "../asaas.service";
import { CreateWebhookDto } from "../types/webhook/webhook.dto";

@Injectable()
export class WebhookService {
  constructor(private readonly asaasService: AsaasService) {}

  async createWebhook(body: CreateWebhookDto) {
    return await this.asaasService.request({
      body,
      url: "/webhooks/",
      method: "post",
    });
  }

  async deleteWebhook(id: string) {
    return await this.asaasService.request({
      url: `/webhooks/${id}`,
      method: "delete",
    });
  }

  async getWebhooks() {
    return await this.asaasService.request({
      url: `/webhooks`,
      method: "get",
    });
  }

  async getWebhook(id: string) {
    return await this.asaasService.request({
      url: `/webhooks/${id}`,
      method: "get",
    });
  }

  async receiveWebhook(body: any) {
    console.log(body);
    return body;
  }
}
