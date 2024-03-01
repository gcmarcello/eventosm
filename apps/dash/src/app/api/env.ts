import { z } from "zod";

const env = z.object({
  HOST: z.string(),
  DATABASE_URL: z.string(),
  SECOND_HOST: z.string(),
  DIRECT_URL: z.string(),
  QUEUE_URL: z.string(),
  AWS_ACCESS_KEY_ID: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_BUCKET_NAME: z.string(),
  JWT_KEY: z.string(),
  SENDGRID_EMAIL: z.string(),
});

export const getServerEnv = (key: keyof typeof env.shape) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

export const isDev = process.env.NODE_ENV === "development";

export const isProd = !isDev;
