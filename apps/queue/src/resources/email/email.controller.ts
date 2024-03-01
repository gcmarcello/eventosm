import { Controller, Post, Body } from "@nestjs/common";
import { EmailService } from "./email.service";
import { Email, EmailTemplate } from "email-templates";

@Controller("email")
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  async sendEmails<E extends EmailTemplate>(@Body() sendEmailDto: Email<E>[]) {
    return await this.emailService.queueEmails(sendEmailDto);
  }
}
