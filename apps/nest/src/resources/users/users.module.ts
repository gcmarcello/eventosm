import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { AuthGuard } from "../auth/auth.guard";
import { JwtService } from "@nestjs/jwt";
import { UserController } from "./user.controller";

@Module({
  providers: [UserController, UserService, AuthService, AuthGuard, JwtService],
})
export class UsersModule {}
