import { Processor, Process, OnQueueActive } from "@nestjs/bull";
import { Job } from "bull";
import sgMail from "@sendgrid/mail";
import { SendEmailDto } from "./dto/sendEmail.dto";

@Processor("email")
export class EmailProcessor {
  @Process()
  async sendEmail(job: Job<SendEmailDto>) {
    return await sgMail.send(job.data);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }
}
