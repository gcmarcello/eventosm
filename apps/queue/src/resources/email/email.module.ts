import { Module } from "@nestjs/common";
import { EmailController } from "./email.controller";
import { BullModule } from "@nestjs/bull";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "email",
      limiter: {
        duration: 1000 /* 1 second */ * 60,
        max: 60,
      },
    }),
  ],
  controllers: [EmailController],
})
export class EmailModule {}
