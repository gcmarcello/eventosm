import { EntityManager } from "@mikro-orm/postgresql";
import { Injectable } from "@nestjs/common";
import { Role, User } from "./entities/user.entity";
import { CreateUserDto, ReadUserDto } from "./dto/user.dto";
import { UserInfo } from "./entities/userInfo.entity";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { hashInfo } from "@/utils/bCrypt";

dayjs.extend(customParseFormat);

@Injectable()
export class UserService {
  constructor(private em: EntityManager) {}

  async findOne(data: ReadUserDto) {
    const user = await this.em.findOne(User, data);
    return user;
  }

  async findMany(data: ReadUserDto): Promise<User[]> {
    const users = await this.em.find(User, data);
    return users;
  }

  async create(dto: CreateUserDto) {
    const { info, ...general } = dto;

    const userInfo = this.em.create(UserInfo, {
      ...info,
      birthDate: dayjs(info.birthDate, "DD/MM/YYYY").toDate(),
    });

    const user = this.em.create(User, {
      ...general,
      password: await hashInfo(general.password),
      info: userInfo,
      confirmed: false,
      role: Role.user,
    });

    await this.em.flush();
    return user;
  }
}
