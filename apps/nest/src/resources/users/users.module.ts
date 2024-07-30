import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { AuthGuard } from "../auth/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { GeoService } from "../geo/geo.service";
import { GeoModule } from "../geo/geo.module";
import { OrganizationService } from "../organizations/services/organization.service";
import { DatabaseModule } from "@/infrastructure/database/database.module";
import { OrganizationRoleService } from "../organizations/services/role.service";

@Module({
  imports: [GeoModule, DatabaseModule],
  providers: [
    UserController,
    UserService,
    AuthService,
    AuthGuard,
    JwtService,
    GeoService,
    OrganizationService,
    OrganizationRoleService,
  ],
})
export class UsersModule {}
