import { Processor, Process, OnQueueActive, InjectQueue } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { BackblazeService } from "./bb";
import { QrCodeService } from "./qrcode.service";

@Processor("qrCode")
export class QrCodeProcessor {
  constructor(
    private backBlaze: BackblazeService,
    private qrCodeService: QrCodeService,
    @InjectQueue("qrCode") private qrCodeQueue: Queue
  ) {}

  @Process()
  async generateQrCode(job: Job<string>) {
    return await this.qrCodeService
      .generateQrCode(job.data)
      .then((file) =>
        this.backBlaze.uploadFile(file as any, `qr-codes/${job.data}.png`)
      )
      .catch(console.log);
  }

  @OnQueueActive()
  onActive(job: Job) {
    console.log(
      `Processing job ${job.id} of type ${job.name} with data ${job.data}...`
    );
  }
}
