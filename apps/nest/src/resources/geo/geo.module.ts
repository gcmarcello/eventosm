import { Module } from "@nestjs/common";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { GeoService } from "./geo.service";

@Module({
  imports: [DatabaseModule],
  providers: [GeoService],
})
export class GeoModule {}
