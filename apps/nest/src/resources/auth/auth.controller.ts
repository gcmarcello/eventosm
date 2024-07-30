import { Body, Controller, Param, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginPipe } from "./pipes/login.pipe";
import { UserPipe } from "../users/user.pipe";
import { UserService } from "../users/user.service";
import { CreateUserDto, LoginDto } from "shared-types";
import { AuthGuard } from "./auth.guard";
import { Request } from "express";

@Controller("auth")
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  @Post("login")
  async login(@Body("", LoginPipe) body: LoginDto) {
    return await this.authService.login(body);
  }

  @Post("signup")
  async signup(@Body("", UserPipe) body: CreateUserDto) {
    return await this.authService.signup(body);
  }

  @Post("active-organization/:organizationId")
  @UseGuards(AuthGuard)
  async updateActiveOrganization(
    @Param("organizationId") organizationId: string,
    @Req() req: Request
  ) {
    return await this.authService.updateActiveOrganization(
      organizationId,
      req.headers.authorization
    );
  }
}
