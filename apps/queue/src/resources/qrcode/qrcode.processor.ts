import { Processor, Process, OnQueueActive } from "@nestjs/bull";
import { Job } from "bull";
import { BackblazeService } from "./bb";
import { QrCodeService } from "./qrcode.service";

@Processor("qrCode")
export class QrCodeProcessor {
  constructor(
    private backBlaze: BackblazeService,
    private qrCodeService: QrCodeService
  ) {}

  @Process()
  async generateQrCode(job: Job<string>) {
    return await this.qrCodeService
      .generateQrCode(job.data)
      .then((file) =>
        this.backBlaze.uploadFile(file, `qr-codes/${job.data}.png`)
      );
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }
}
