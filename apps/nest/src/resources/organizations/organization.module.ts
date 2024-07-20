import { Module } from "@nestjs/common";
import { OrganizationService } from "./services/organization.service";
import { DatabaseModule } from "@/database/database.module";
import { OrganizationRoleService } from "./services/role.service";
import { OrganizationController } from "./organization.controller";

@Module({
  imports: [DatabaseModule],
  providers: [
    OrganizationService,
    OrganizationRoleService,
    OrganizationController,
  ],
})
export class OrganizationModule {}
