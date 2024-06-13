import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { AuthGuard } from "../auth/auth.guard";
import { JwtService } from "@nestjs/jwt";

@Module({
  providers: [UserResolver, UserService, AuthService, AuthGuard, JwtService],
})
export class UsersModule {}
