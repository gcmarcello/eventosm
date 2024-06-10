import { Module } from "@nestjs/common";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { AuthService } from "../auth/auth.service";
import { AuthGuard } from "../auth/auth.guard";

@Module({
  providers: [UserResolver, UserService, AuthService, AuthGuard],
})
export class UsersModule {}
