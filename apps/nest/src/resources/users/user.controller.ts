import { UserService } from "./user.service";

import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UsePipes,
} from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UserPipe } from "./user.pipe";
import { ReadUserDto, CreateUserDto } from "shared-types";

@UseGuards(AuthGuard)
@Controller("user")
export class UserController {
  constructor(private userService: UserService) {}

  @Get("id")
  public async getUser(@Param("id") id: string) {
    return await this.userService.findById(id);
  }

  @Get()
  public async getUsers(@Body() data: ReadUserDto) {
    return await this.userService.findMany(data);
  }

  @Post()
  @UsePipes(UserPipe)
  public async createUser(@Body() data: CreateUserDto) {
    return await this.userService.create(data);
  }
}
