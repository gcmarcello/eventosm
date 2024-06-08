import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { UserService } from "./resources/users/user.service";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService
  ) {}

  @Get()
  async getHello() {
    return console.log(await this.userService.findAll());
  }
}
