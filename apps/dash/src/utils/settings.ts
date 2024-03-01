export const compareEnv = (key: string, value: string) =>
  process.env[key] === value;

export const isProd = compareEnv("NODE_ENV", "production");
export const isDev = !isProd;
