import { Args, Info, Resolver } from "@nestjs/graphql";
import { User } from "./entities/user.entity";
import { EntityManager } from "@mikro-orm/core";
import { SqlEntityRepository } from "@mikro-orm/postgresql";
import { GraphQLResolveInfo, Query } from "@/libs/graphQL/decorators";

@Resolver(() => User)
export class UserResolver {
  userRepo: SqlEntityRepository<User>;

  constructor(private em: EntityManager) {
    this.userRepo = this.em.getRepository(User);
  }

  @Query(() => User)
  public async getUser(
    @Args("id") id: string,
    @Info() info: GraphQLResolveInfo
  ) {
    const user = await this.userRepo.findOne(id, {
      populate: info.relations,
    });

    return user;
  }

  @Query(() => [User])
  public async getAllUsers(@Info() info: GraphQLResolveInfo) {
    const users = await this.userRepo.findAll({
      populate: info.relations,
    });

    return users;
  }
}
