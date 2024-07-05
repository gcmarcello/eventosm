import { Module } from "@nestjs/common";
import { BullModule } from "../../infrastructure/bull/bull.module";
import { QrCodeController } from "./qrcode.controller";
import { QrCodeService } from "./qrcode.service";
import { QrCodeProcessor } from "./qrcode.processor";
import { UploadsService } from "@/infrastructure/uploads/uploads.service";

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
  providers: [UploadsService, QrCodeProcessor, QrCodeService],
})
export class QrCodeModule {}
