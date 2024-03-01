import { Module } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { EmailProcessor } from "./email.processor";
import { BullModule } from "../bull/bull.module";
import { EmailService } from "./email.service";
import { SendgridMailService } from "./sg";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "email",
      limiter: {
        max: 60,
        duration: 1000 /* 1 second */ * 60,
      },
    }),
  ],
  controllers: [EmailController],
  providers: [EmailProcessor, SendgridMailService, EmailService],
})
export class EmailModule {}
