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
import { AuthGuard, JwtUserPayload } from "../auth/auth.guard";
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
import { OrganizationPipe } from "./organization.pipe";

@Controller("organization")
export class OrganizationController {
  constructor(private organizationService: OrganizationService) {}

  @Get()
  public async findOrganizations(@Query() data: ReadOrganizationDto) {
    return await this.organizationService.findMany(data);
  }

  @Get()
  public async findOrganization(@Param("id") id: string) {
    return await this.organizationService.findOne(id);
  }

  @Post()
  @UseGuards(AuthGuard, OrganizationGuard)
  public async createOrganization(
    @Body("", OrganizationPipe) body: CreateOrganizationDto,
    @User() user: JwtUserPayload
  ) {
    return await this.organizationService.create(user.id, body);
  }

  @Put()
  @Permissions([OrganizationPermissions.UpdateOrganization])
  @UseGuards(AuthGuard, OrganizationGuard)
  public async updateOrganization(
    @Body("", OrganizationPipe) body: UpdateOrganizationDto,
    @User() user: JwtUserPayload
  ) {
    return await this.organizationService.update(body, user.activeOrg);
  }
}
