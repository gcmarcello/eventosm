import { getServerEnv } from "@/app/api/env";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";

const bucketName = getServerEnv("AWS_BUCKET_NAME") || "";
const privateBucketName = getServerEnv("AWS_PRIVATE_BUCKET_NAME") || "";
const region = getServerEnv("AWS_REGION") || "";

const s3 = new S3Client({
  endpoint: `https://s3.${region}.backblazeb2.com`,
  credentials: {
    accessKeyId: getServerEnv("AWS_ACCESS_KEY_ID") || "",
    secretAccessKey: getServerEnv("AWS_SECRET_ACCESS_KEY") || "",
  },
});

const s3Private = new S3Client({
  endpoint: `https://s3.${region}.backblazeb2.com`,
  credentials: {
    accessKeyId: getServerEnv("AWS_PRIVATE_ACCESS_KEY_ID") || "",
    secretAccessKey: getServerEnv("AWS_PRIVATE_SECRET_ACCESS_KEY") || "",
  },
});

export async function uploadFile(file: File, key: string) {
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: getMimeTypeFromFileName(file.name),
  });

  try {
    await s3.send(command);
    return `https://${bucketName}.s3.${region}.backblazeb2.com/${key}`;
  } catch (error) {
    throw "Erro ao fazer upload do arquivo. " + error;
  }
}

export async function uploadPrivateFile(file: File, key: string) {
  const bytes = await file.arrayBuffer();
  const fileBuffer = Buffer.from(bytes);
  const command = new PutObjectCommand({
    Bucket: privateBucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: getMimeTypeFromFileName(file.name),
    ACL: "private",
  });

  try {
    await s3Private.send(command);
    return `${key}`;
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

export async function deletePrivateFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: getServerEnv("AWS_PRIVATE_BUCKET_NAME") || "",
    Key: key,
  });

  try {
    await s3Private.send(command);
  } catch (error) {
    throw "Erro ao deletar arquivo. " + error;
  }
}

export async function getPreSignedURL(data: { key: string }) {
  const command = new GetObjectCommand({
    Bucket: privateBucketName,
    Key: data.key,
  });

  return await getSignedUrl(s3, command, { expiresIn: 60 });
}

function getMimeTypeFromFileName(fileName: string): string | undefined {
  const extensionToMimeType: { [key: string]: string } = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
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
