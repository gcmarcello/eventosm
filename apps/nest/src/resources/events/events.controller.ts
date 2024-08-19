import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Put,
} from "@nestjs/common";
import { EventsService } from "./events.service";
import {
  CreateEventDto,
  JwtUserPayload,
  OrganizationPermissions,
  UpdateEventDto,
} from "shared-types";
import { Permissions } from "../organizations/permissions.decorator";
import { OrganizationGuard } from "../organizations/organization.guard";
import { AuthGuard } from "../auth/auth.guard";
import { User } from "../auth/decorators/user.decorator";
import { EventGuard } from "./events.guard";

@Controller("events")
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get("/admin")
  findAllAdmin() {
    return this.eventsService.findAll(true);
  }

  @Get(":identifier")
  findOne(@Param("identifier") identifier: string) {
    return this.eventsService.findOne(identifier);
  }

  @Get("/admin/:identifier")
  @Permissions([OrganizationPermissions.ReadPrivateEvents])
  @UseGuards(AuthGuard, OrganizationGuard)
  findOneAdmin(@Param("identifier") identifier: string) {
    return this.eventsService.findOne(identifier, true);
  }

  @Post()
  @Permissions([OrganizationPermissions.CreateEvent])
  @UseGuards(AuthGuard, OrganizationGuard)
  create(@Body() createEventDto: CreateEventDto, @User() user: JwtUserPayload) {
    return this.eventsService.create(createEventDto, user.activeOrg);
  }

  @Put(":id")
  @Permissions([OrganizationPermissions.UpdateEvent])
  @UseGuards(AuthGuard, OrganizationGuard, EventGuard)
  update(@Body() body: UpdateEventDto, @Param("id") id: string) {
    return this.eventsService.update(body, id);
  }
}
