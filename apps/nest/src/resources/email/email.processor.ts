import {
  Processor,
  Process,
  OnQueueActive,
  OnQueueDrained,
  InjectQueue,
} from "@nestjs/bull";
import { Job, Queue } from "bull";
import { SendgridMailService } from "./sg";

import { MailDataRequired } from "@sendgrid/mail";
import { SettingsService } from "../settings/settings.service";

@Processor("email")
export class EmailProcessor {
  constructor(
    private sgMail: SendgridMailService,
    @InjectQueue("email") private emailQueue: Queue,
    private readonly settingsService: SettingsService
  ) {}

  @Process()
  async sendEmail(job: Job<MailDataRequired>) {
    return await this.sgMail
      .send({
        ...job.data,
        mailSettings: {
          sandboxMode: { enable: this.settingsService.isDevelopment },
        },
      })
      .catch((error) => console.log(error));
  }

  @OnQueueDrained()
  async onDrained() {
    await this.emailQueue.pause();
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data.to}...`
    );
  }
}
