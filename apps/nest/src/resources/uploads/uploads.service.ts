import { Injectable } from "@nestjs/common";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class UploadsService {
  private s3: S3Client;
  private s3Private: S3Client;
  private bucketName: string;
  private privateBucketName: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.bucketName = this.configService.get("AWS_BUCKET_NAME") || "";
    this.privateBucketName =
      this.configService.get("AWS_PRIVATE_BUCKET_NAME") || "";
    this.region = this.configService.get("AWS_REGION");

    this.s3 = new S3Client({
      endpoint: `https://s3.${this.region}.backblazeb2.com`,
      credentials: {
        accessKeyId: this.configService.get("AWS_ACCESS_KEY_ID"),
        secretAccessKey: this.configService.get("AWS_SECRET_ACCESS_KEY"),
      },
    });
    this.s3Private = new S3Client({
      endpoint: `https://s3.${this.region}.backblazeb2.com`,
      credentials: {
        accessKeyId: this.configService.get("AWS_PRIVATE_ACCESS_KEY_ID") || "",
        secretAccessKey:
          this.configService.get("AWS_PRIVATE_SECRET_ACCESS_KEY") || "",
      },
    });
  }

  async uploadFile(file: Express.Multer.File, folder?: string | null) {
    const bytes = file.buffer;
    const format = file.originalname.split(".").pop();
    const randomKey = crypto.randomUUID();
    const constructedKey = folder
      ? `${folder}${randomKey}.${format}`
      : `${randomKey}.${format}`;
    const fileBuffer = Buffer.from(bytes);
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: constructedKey,
      Body: fileBuffer,
      ContentType: this.getMimeTypeFromFileName(file.originalname),
    });

    try {
      await this.s3.send(command);
      return {
        key: `${randomKey}.${format}`,
      };
    } catch (error) {
      throw "Erro ao fazer upload do arquivo. " + error;
    }
  }

  getMimeTypeFromFileName(fileName: string): string | undefined {
    const extensionToMimeType: { [key: string]: string } = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".xls": "application/vnd.ms-excel",
      ".xlsx":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
      ".txt": "text/plain",
      ".html": "text/html",
      ".css": "text/css",
      ".js": "application/javascript",
      ".json": "application/json",
      ".xml": "application/xml",
      // Add more MIME types and extensions as needed
    };

    const extension = fileName.slice(fileName.lastIndexOf(".")).toLowerCase();

    return extensionToMimeType[extension];
  }
}
