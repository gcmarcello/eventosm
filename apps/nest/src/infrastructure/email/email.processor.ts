import { Processor, Process, OnQueueActive } from "@nestjs/bull";
import { Job } from "bull";
import { SendgridMailService } from "./sg";

import { MailDataRequired } from "@sendgrid/mail";
import { SettingsService } from "../../settings/settings.service";

@Processor("email")
export class EmailProcessor {
  constructor(
    private sgMail: SendgridMailService,
    private readonly settingsService: SettingsService
  ) {}

  @Process()
  async sendEmail(job: Job<MailDataRequired>) {
    try {
      const email = await this.sgMail
        .send({
          ...job.data,
          from: {
            email: job.data.from as string, //@TODO - fix typing all the way back to NextJS backend.
            name: "EventoSM",
          },
          mailSettings: {
            sandboxMode: { enable: this.settingsService.isDevelopment },
          },
        })
        .then(() => console.log("Mail Sent"));

      return email;
    } catch (err) {
      console.log(err);
    }
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data.to}...`
    );
  }
}
