import { z } from "zod";

const env = z.object({
  NEXT_PUBLIC_SITE_URL: z.string(),
});

export const getClientEnv = (key: keyof typeof env.shape) => {
  const value = process.env[key];

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};
