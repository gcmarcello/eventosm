import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";

import { OrganizationService } from "./services/organization.service";
import { OrganizationGuard } from "./organization.guard";
import { Permissions } from "./permissions.decorator";
import { User } from "../auth/decorators/user.decorator";
import {
  CreateOrganizationDto,
  OrganizationPermissions,
  ReadOrganizationDto,
  UpdateOrganizationDto,
} from "shared-types";

@UseGuards(AuthGuard)
@Controller("organization")
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  public async findOrganizations(@Query() data: ReadOrganizationDto) {
    return await this.organizationService.findMany(data);
  }

  @Get(":id")
  public async findOrganization(@Param("id") id: string) {
    return await this.organizationService.findOne(id);
  }

  @Post()
  @UseGuards(OrganizationGuard)
  public async createOrganization(
    @Body() body: CreateOrganizationDto,
    @User() userId: string
  ) {
    return await this.organizationService.create(userId, body);
  }

  @Put()
  @Permissions([OrganizationPermissions.UpdateOrganization])
  @UseGuards(OrganizationGuard)
  public async updateOrganization(@Body() body: UpdateOrganizationDto) {
    return await this.organizationService.update(body);
  }
}
