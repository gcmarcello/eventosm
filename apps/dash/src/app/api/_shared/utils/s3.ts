import { getServerEnv } from "@/app/api/env";
import { S3Client } from "@aws-sdk/client-s3";

const accessKeyId = getServerEnv("AWS_ACCESS_KEY_ID");
const secretAccessKey = getServerEnv("AWS_SECRET_ACCESS_KEY");

if (!accessKeyId || !secretAccessKey) {
  throw new Error("AWS credentials not found");
}

const s3Client = new S3Client({
  region: getServerEnv("AWS_REGION"),
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
});

export default s3Client;
