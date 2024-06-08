import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { User } from "./entities/user.entity";

@Injectable()
export class UserService {
  constructor(private em: EntityManager) {}

  async findAll(): Promise<User[]> {
    const users = await this.em.findAll(User);
    return users;
  }

  async create(dto: User) {
    const user = this.em.create(User, dto);
    await this.em.persistAndFlush(user);
  }
}
