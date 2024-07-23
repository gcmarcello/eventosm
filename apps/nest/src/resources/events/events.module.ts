import { Module } from "@nestjs/common";
import { EventsService } from "./events.service";
import { EventsController } from "./events.controller";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { OrganizationModule } from "../organizations/organization.module";
import { OrganizationService } from "../organizations/services/organization.service";

@Module({
  imports: [DatabaseModule, OrganizationModule],
  controllers: [EventsController],
  providers: [EventsService, OrganizationService],
})
export class EventsModule {}
