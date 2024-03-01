import { Controller, Post, Body } from "@nestjs/common";
import { QrCodeService } from "./qrcode.service";

@Controller("qrCode")
export class QrCodeController {
  constructor(private qrCodeService: QrCodeService) {}

  @Post()
  async send(@Body() generateQrCodeDto: string[]) {
    return await this.qrCodeService.queueQrCodes(generateQrCodeDto);
  }
}
