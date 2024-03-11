import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class SettingsService {
  constructor(private readonly configService: ConfigService) {}

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (!value) {
      throw new Error(key + " environment variable does not set");
    }

    return value;
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + " environment variable is not a number");
    }
  }

  get databaseUrl(): string {
    return this.get("DATABASE_URL");
  }

  get nodeEnv(): string {
    return this.get("NODE_ENV");
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  // REDIS
  get redisHost(): string {
    return this.get("REDIS_HOST");
  }

  get redisPort(): number {
    return this.getNumber("REDIS_PORT");
  }

  get redisPassword(): string {
    return this.get("REDIS_PASSWORD");
  }

  // SG
  get sendgridApiKey(): string {
    return this.get("SENDGRID_API_KEY");
  }

  // AWS
  get awsRegion(): string {
    return this.get("AWS_REGION");
  }

  get awsAccessKeyId(): string {
    return this.get("AWS_ACCESS_KEY_ID");
  }

  get awsSecretAccessKey(): string {
    return this.get("AWS_SECRET_ACCESS_KEY");
  }

  get awsBucketName(): string {
    return this.get("AWS_BUCKET_NAME");
  }
}
