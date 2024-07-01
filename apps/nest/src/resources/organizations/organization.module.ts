import { Module } from "@nestjs/common";
import { OrganizationService } from "./services/organization.service";
import { OrganizationResolver } from "./organization.resolver";
import { DatabaseModule } from "@/database/database.module";
import { OrganizationRoleService } from "./services/role.service";

@Module({
  imports: [DatabaseModule],
  providers: [
    OrganizationService,
    OrganizationRoleService,
    OrganizationResolver,
  ],
})
export class OrganizationModule {}
