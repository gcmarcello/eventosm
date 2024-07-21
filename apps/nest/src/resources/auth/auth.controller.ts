import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginPipe } from "./pipes/login.pipe";
import { UserPipe } from "../users/user.pipe";
import { UserService } from "../users/user.service";
import { CreateUserDto, LoginDto } from "shared-types";

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
}
