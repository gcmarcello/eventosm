import { Controller, Post, Body, UseGuards, Get, Param } from "@nestjs/common";
import { EventsService } from "./events.service";
import { CreateEventDto, OrganizationPermissions } from "shared-types";
import { Permissions } from "../organizations/permissions.decorator";
import { OrganizationGuard } from "../organizations/organization.guard";
import { AuthGuard } from "../auth/auth.guard";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(":identifier")
  findOne(@Param("identifier") identifier: string) {
    return this.eventsService.findOne(identifier);
  }

  @Get("/admin/:identifier")
  @Permissions([OrganizationPermissions.ReadPrivateEvents])
  @UseGuards(AuthGuard, OrganizationGuard)
  findOneAdmin(@Param("identifier") identifier: string) {
    return this.eventsService.findOne(identifier);
  }

  @Post()
  @Permissions([OrganizationPermissions.CreateEvent])
  @UseGuards(AuthGuard, OrganizationGuard)
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }
}
