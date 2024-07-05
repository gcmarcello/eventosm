import { Module } from "@nestjs/common";
import { BullModule as _BullModule } from "@nestjs/bull";
import { SettingsService } from "../../settings/settings.service";

@Module({
  imports: [
    _BullModule.forRootAsync({
      useFactory: (settings: SettingsService) => ({
        redis: {
          host: settings.redisHost,
          port: settings.redisPort,
          password: settings.redisPassword,
        },
      }),
      inject: [SettingsService],
    }),
  ],
  exports: [_BullModule],
})
export class BullModule extends _BullModule {}
