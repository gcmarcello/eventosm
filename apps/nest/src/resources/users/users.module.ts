import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { AuthGuard } from "../auth/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { UserController } from "./user.controller";
import { GeoService } from "../geo/geo.service";
import { GeoModule } from "../geo/geo.module";

@Module({
  imports: [GeoModule],
  providers: [
    UserController,
    UserService,
    AuthService,
    AuthGuard,
    JwtService,
    GeoService,
  ],
})
export class UsersModule {}
