import { Injectable } from "@nestjs/common";
import { MailService } from "@sendgrid/mail";
import { SettingsService } from "../../settings/settings.service";

@Injectable()
export class SendgridMailService extends MailService {
  constructor(private settingsService: SettingsService) {
    super();

    this.setApiKey(this.settingsService.sendgridApiKey);
  }
}
