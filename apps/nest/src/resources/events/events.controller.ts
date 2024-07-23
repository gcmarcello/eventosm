import { Controller, Post, Body, UseGuards } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto, OrganizationPermissions } from "shared-types";
import { Permissions } from "../organizations/permissions.decorator";
import { OrganizationGuard } from "../organizations/organization.guard";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  @Permissions([OrganizationPermissions.CreateEvent])
  @UseGuards(OrganizationGuard)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }
}
