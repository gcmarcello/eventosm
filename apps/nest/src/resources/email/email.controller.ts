import { Controller, Post, Body } from "@nestjs/common";
import { EmailService } from "./email.service";
import { Email, EmailTemplate } from "email-templates";
import { ApiTags } from "@nestjs/swagger";

@ApiTags("Email")
@Controller("email")
export class EmailController {
  constructor(private emailService: EmailService) {}

  @Post()
  async sendEmails<E extends EmailTemplate>(@Body() sendEmailDto: Email<E>[]) {
    return await this.emailService.queueEmails(sendEmailDto);
  }
}
