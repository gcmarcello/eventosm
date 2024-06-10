import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { Query } from "@/libs/graphQL/decorators";
import { UserService } from "./user.service";
import { CreateUserDto, ReadUserDto } from "./dto/user.dto";
import { UseGuards } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @UseGuards(AuthGuard)
  @Query(() => User, { nullable: true })
  public async getUser(@Args("data") data: ReadUserDto) {
    return await this.userService.findOne(data);
  }

  @UseGuards(AuthGuard)
  @Query(() => [User], { nullable: true })
  public async getUsers(@Args("data") data: ReadUserDto) {
    return await this.userService.findMany(data);
  }

  @Mutation(() => User)
  public async createUser(@Args("data") data: CreateUserDto) {
    return await this.userService.create(data);
  }
}
