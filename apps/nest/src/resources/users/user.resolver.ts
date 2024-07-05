import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { Query } from "@/infrastructure/graphQL/decorators";
import { UserService } from "./user.service";
import { CreateUserDto, ReadUserDto } from "./dto/user.dto";
import { UseGuards, UsePipes } from "@nestjs/common";
import { AuthGuard } from "../auth/auth.guard";
import { UserPipe } from "./user.pipe";

@UseGuards(AuthGuard)
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}

  @Query(() => User, { nullable: true })
  public async getUser(@Args("data") data: ReadUserDto) {
    return await this.userService.findOne(data);
  }

  @Query(() => [User], { nullable: true })
  public async getUsers(@Args("data") data: ReadUserDto) {
    return await this.userService.findMany(data);
  }

  @Mutation(() => User)
  @UsePipes(UserPipe)
  public async createUser(@Args("data") data: CreateUserDto) {
    return await this.userService.create(data);
  }
}
