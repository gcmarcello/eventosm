import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmailModule } from "./resources/email/email.module";
import { BullModule } from "@nestjs/bull";
import { SettingsModule } from "./resources/settings/settings.module";

@Module({
  imports: [
    SettingsModule,
    EmailModule,
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        password: process.env.REDIS_PASSWORD,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
