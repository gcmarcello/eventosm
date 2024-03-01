import { Module } from "@nestjs/common";
import { BullModule } from "../bull/bull.module";
import { QrCodeController } from "./qrcode.controller";
import { QrCodeService } from "./qrcode.service";
import { BackblazeService } from "./bb";
import { QrCodeProcessor } from "./qrcode.processor";

@Module({
  imports: [
    BullModule.registerQueue({
      name: "qrCode",
      limiter: {
        max: 60,
        duration: 1000 /* 1 second */ * 60,
      },
    }),
  ],
  controllers: [QrCodeController],
  providers: [BackblazeService, QrCodeProcessor, QrCodeService],
})
export class QrCodeModule {}
