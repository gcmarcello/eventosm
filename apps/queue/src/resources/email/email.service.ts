import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import { Email, EmailTemplate, generateSendGridEmail } from "email-templates";

@Injectable()
export class EmailService {
  constructor(@InjectQueue("email") private emailQueue: Queue) {}

  async queueEmails<E extends EmailTemplate>(sendEmailDto: Email<E>[]) {
    const opts = {
      attempts: 3,
      backoff: 3000,
    };
    return await this.emailQueue.addBulk(
      sendEmailDto.map((data) => ({
        data: generateSendGridEmail(data),
        opts,
      }))
    );
  }
}
