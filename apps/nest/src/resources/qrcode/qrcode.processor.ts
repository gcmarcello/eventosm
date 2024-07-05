import { Processor, Process, OnQueueActive, InjectQueue } from "@nestjs/bull";
import { Job, Queue } from "bull";
import { QrCodeService } from "./qrcode.service";
import { UploadsService } from "@/infrastructure/uploads/uploads.service";

@Processor("qrCode")
export class QrCodeProcessor {
  constructor(
    private uploadService: UploadsService,
    private qrCodeService: QrCodeService,
    @InjectQueue("qrCode") private qrCodeQueue: Queue
  ) {}

  @Process()
  async generateQrCode(job: Job<string>) {
    return await this.qrCodeService
      .generateQrCode(job.data)
      .then((file) =>
        this.uploadService.uploadFile(file as any, `qr-codes/${job.data}.png`)
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
