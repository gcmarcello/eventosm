import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as crypto from "crypto";

function verifySignature(obj, secret: string) {
  return crypto.createHmac("sha256", secret).update(obj).digest("hex");
}

@Injectable()
export class SignatureGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    const payload = JSON.stringify(req.body);

    const secret = this.configService.get("WHATSAPP_APP_KEY");

    const hash = verifySignature(payload, secret);

    const signature = req.headers["x-hub-signature-256"].split("=")[1];

    const isSignatureValid = hash === signature;

    return isSignatureValid;
  }
}
