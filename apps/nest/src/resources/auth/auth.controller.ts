import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LoginPipe } from "./pipes/login.pipe";
import { UserPipe } from "../users/user.pipe";
import { CreateUserDto } from "../users/dto/user.dto";
import { UserService } from "../users/user.service";

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
    return await this.userService.create(body);
  }
}
