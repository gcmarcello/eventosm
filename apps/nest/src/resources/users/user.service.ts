import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Role, User } from "./entities/user.entity";
import { CreateUserDto, ReadUserDto } from "./dto/user.dto";
import { UserInfo } from "./entities/userInfo.entity";

@Injectable()
export class UserService {
  constructor(private em: EntityManager) {}

  async findOne(id: string) {
    const user = await this.em.findOne(User, { id });
    return user;
  }

  async findMany(data: ReadUserDto): Promise<User[]> {
    const users = await this.em.find(User, data);
    return users;
  }

  async create(dto: CreateUserDto) {
    const { info, ...general } = dto;

    const userInfo = this.em.create(UserInfo, info);

    const user = this.em.create(User, {
      ...general,
      info: userInfo,
      confirmed: false,
      role: Role.user,
    });

    await this.em.flush();
    return user;
  }
}
