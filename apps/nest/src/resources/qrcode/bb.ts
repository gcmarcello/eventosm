import { Injectable } from "@nestjs/common";
import { SettingsService } from "../settings/settings.service";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

@Injectable()
export class BackblazeService extends S3Client {
  private bucketRegion: string;
  private bucketName: string;

  constructor(private settingsService: SettingsService) {
    super({
      endpoint: `https://s3.${settingsService.get("AWS_REGION")}.backblazeb2.com`,
      credentials: {
        accessKeyId: settingsService.get("AWS_ACCESS_KEY_ID") || "",
        secretAccessKey: settingsService.get("AWS_SECRET_ACCESS_KEY") || "",
      },
    });

    this.bucketRegion = settingsService.get("AWS_REGION");
    this.bucketName = settingsService.get("AWS_BUCKET_NAME");
  }

  async uploadFile(file: File, key: string) {
    const bytes = await file.arrayBuffer();
    const fileBuffer = Buffer.from(bytes);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: fileBuffer,
      ContentType: "image/png",
    });

    try {
      await this.send(command);
      return `https://${this.bucketName}.s3.${this.bucketRegion}.backblazeb2.com/${key}`;
    } catch (error) {
      throw "Erro ao fazer upload do arquivo. " + error;
    }
  }
}
