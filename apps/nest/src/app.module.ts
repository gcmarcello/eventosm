import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { EmailModule } from "./resources/email/email.module";
import { SettingsModule } from "./resources/settings/settings.module";
import { BullModule } from "./resources/bull/bull.module";
import { QrCodeModule } from "./resources/qrcode/qrcode.module";
import { WhatsappModule } from "./resources/whatsapp/whatsapp.module";

@Module({
  imports: [
    BullModule,
    SettingsModule,
    QrCodeModule,
    EmailModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
