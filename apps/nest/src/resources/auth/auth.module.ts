import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserService } from "../users/user.service";
import { AuthController } from "./auth.controller";
import { JwtModule } from "@nestjs/jwt";
import { GeoModule } from "../geo/geo.module";
import { GeoService } from "../geo/geo.service";

@Module({
  imports: [
    GeoModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.NODE_ENV === "production" ? "1d" : "7d",
      },
    }),
  ],
  providers: [AuthService, UserService, GeoService],
  controllers: [AuthController],
})
export class AuthModule {}
