import { Injectable } from "@nestjs/common";
import { MailService } from "@sendgrid/mail";
import { SettingsService } from "../settings/settings.service";

@Injectable()
export class SendgridMailService extends MailService {
  constructor(private settingsService: SettingsService) {
    super();

    this.setApiKey(
      this.settingsService.get("SENDGRID_API_KEY") || "SENDGRID_API_KEY not set"
    );

    this.setApiKey(
      this.settingsService.get("SENDGRID_API_KEY") || "SENDGRID_API_KEY not set"
    );
  }
}
