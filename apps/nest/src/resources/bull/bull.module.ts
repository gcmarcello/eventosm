import { Module } from "@nestjs/common";
import { BullModule as _BullModule } from "@nestjs/bull";
import { SettingsService } from "../settings/settings.service";

@Module({
  imports: [
    _BullModule.forRootAsync({
      useFactory: (settings: SettingsService) => ({
        redis: {
          host: settings.get("REDIS_HOST"),
          port: settings.getNumber("REDIS_PORT"),
          password: settings.get("REDIS_PASSWORD"),
        },
      }),
      inject: [SettingsService],
    }),
  ],
  exports: [_BullModule],
})
export class BullModule extends _BullModule {}
