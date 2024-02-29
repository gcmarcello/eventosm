import { Controller, Post, Body } from "@nestjs/common";
import { SendEmailDto } from "./dto/sendEmail.dto";
import { InjectQueue } from "@nestjs/bull";
import { Queue } from "bull";

@Controller("email")
export class EmailController {
  constructor(@InjectQueue("email") private emailQueue: Queue) {}

  @Post()
  send(@Body() sendEmailDto: SendEmailDto[]) {
    return this.emailQueue.addBulk(
      sendEmailDto.map((data) => ({
        data,
      }))
    );
  }
}
