import { InjectQueue } from "@nestjs/bull";
import { Injectable } from "@nestjs/common";
import { Queue } from "bull";
import QRCode from "qrcode";

@Injectable()
export class QrCodeService {
  constructor(@InjectQueue("qrCode") private qrCodeQueue: Queue) {}

  async queueQrCodes(generateQrCodeDto: string[]) {
    await this.qrCodeQueue.resume();

    return await this.qrCodeQueue.addBulk(
      generateQrCodeDto.map((data) => ({
        data,
        opts: {
          attempts: 3,
          backoff: 3000,
        },
      }))
    );
  }

  async generateQrCode(qrCode: string) {
    try {
      const qrCodeData = await QRCode.toDataURL(qrCode);
      const fileName = qrCode;

      const dataUrlToBlob = (dataUrl: string) => {
        const arr = dataUrl.split(",");
        const match = arr[0]?.match(/:(.*?);/);

        if (!match || !match[1] || !arr[1]) {
          throw "Unable to extract MIME type from data URL";
        }

        const mime = match[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        return new Blob([u8arr], { type: mime });
      };

      const blob = dataUrlToBlob(qrCodeData);
      return new File([blob], fileName, { type: "image/png" });
    } catch (error) {}
  }
}
