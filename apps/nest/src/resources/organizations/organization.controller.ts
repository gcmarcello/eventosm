import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import {
  CreateOrganizationDto,
  ReadOrganizationDto,
  UpdateOrganizationDto,
} from "./dto/organization.dto";
import { OrganizationService } from "./services/organization.service";
import { OrganizationGuard } from "./organization.guard";
import { Permissions } from "./permissions.decorator";
import { User } from "../auth/decorators/user.decorator";
import { OrganizationPermissions } from "./entities/organizationPermission.entity";

@UseGuards(AuthGuard)
@Controller("organization")
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Post()
  public async findOrganizations(@Body() data: ReadOrganizationDto) {
    return await this.organizationService.findMany(data);
  }

  @Get(":id")
  public async findOrganization(@Param("id") id: string) {
    return await this.organizationService.findOne(id);
  }

  @UseGuards(OrganizationGuard)
  public async createOrganization(
    @Body() body: CreateOrganizationDto,
    @User() userId: string
  ) {
    return await this.organizationService.create(userId, body);
  }

  @Permissions([OrganizationPermissions.UpdateOrganization])
  @UseGuards(OrganizationGuard)
  public async updateOrganization(@Body() body: UpdateOrganizationDto) {
    return await this.organizationService.update(body);
  }
}
