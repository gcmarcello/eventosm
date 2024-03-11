import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class WebhookGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const query = req.query;

    if (
      query["hub.verify_token"] !=
      this.configService.get("WHATSAPP_WEBHOOK_KEY")
    )
      return false;

    req["hub.challenge"] = query["hub.challenge"];

    return true;
  }
}
