import { getServerEnv } from "@/app/api/env";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  ObjectCannedACL,
} from "@aws-sdk/client-s3";

const bucketName = getServerEnv("AWS_BUCKET_NAME") || "";
const region = getServerEnv("AWS_REGION") || "";

const s3 = new S3Client({
  endpoint: `https://s3.${region}.backblazeb2.com`,
  credentials: {
    accessKeyId: getServerEnv("AWS_ACCESS_KEY_ID") || "",
    secretAccessKey: getServerEnv("AWS_SECRET_ACCESS_KEY") || "",
  },
});

export async function uploadFile(
  file: File,
  key: string,
  ACL: ObjectCannedACL = "public-read"
) {
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: "image/jpeg",
    ACL,
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
    Bucket: getServerEnv("AWS_BUCKET_NAME") || "",
    Key: key,
  });

  try {
    await s3.send(command);
  } catch (error) {
    throw "Erro ao deletar arquivo. " + error;
  }
}
