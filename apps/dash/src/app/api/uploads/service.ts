import { getEnv } from "@/utils/settings";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

const bucketName = getEnv("AWS_BUCKET_NAME") || "";
const region = getEnv("AWS_REGION") || "";

const s3 = new S3Client({
  endpoint: `https://s3.${region}.backblazeb2.com`,
  credentials: {
    accessKeyId: getEnv("AWS_ACCESS_KEY_ID") || "",
    secretAccessKey: getEnv("AWS_SECRET_ACCESS_KEY") || "",
  },
});

export async function uploadFile(file: File, key: string) {
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpeg",
  });

  try {
    await s3.send(command);
    return `https://${bucketName}.s3.${region}.backblazeb2.com/${key}`;
  } catch (error) {
    throw "Erro ao fazer upload do arquivo. " + error;
  }
}

export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: getEnv("AWS_BUCKET_NAME") || "",
    Key: key,
  });

  try {
    await s3.send(command);
  } catch (error) {
    throw "Erro ao deletar arquivo. " + error;
  }
}
