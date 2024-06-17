import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Organization } from "./entities/organization.entity";
import {
  CreateOrganizationDto,
  ReadOrganizationDto,
  UpdateOrganizationDto,
} from "./dto/organization.dto";
import { OrganizationService } from "./organization.service";
import { OrganizationGuard } from "./organization.guard";
import { OrganizationPermissions, Permissions } from "./permissions.decorator";
import { User } from "../auth/decorators/user.decorator";

@UseGuards(AuthGuard)
@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private organizationService: OrganizationService) {}

  @Query(() => [Organization], { nullable: true })
  public async findAllOrganizations() {
    return await this.organizationService.findAll();
  }

  @Query(() => [Organization], { nullable: true })
  public async findOrganizations(@Args("data") data: ReadOrganizationDto) {
    return await this.organizationService.findMany(data);
  }

  @Query(() => Organization, { nullable: true })
  public async findOrganization(@Args("id") id: string) {
    return await this.organizationService.findOne(id);
  }

  @UseGuards(OrganizationGuard)
  @Mutation(() => Organization)
  public async createOrganization(
    @Args("data") data: CreateOrganizationDto,
    @User() user: string
  ) {
    return await this.organizationService.create(user, data);
  }

  @Permissions([OrganizationPermissions.UpdateOrganization])
  @UseGuards(OrganizationGuard)
  @Mutation(() => Organization)
  public async updateOrganization(@Args("data") data: UpdateOrganizationDto) {
    return await this.organizationService.update(data);
  }
}
