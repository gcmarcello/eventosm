import { EntityManager } from "@mikro-orm/postgresql";
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { User, UserInfo } from "shared-types";
import { GeoService } from "../geo/geo.service";
import {
  CreateUserDto,
  ReadUserDto,
  Role,
} from "shared-types/dist/resources/user/user.dto";

@Injectable()
export class UserService {
  constructor(
    private em: EntityManager,
    private geoService: GeoService
  ) {}

  async findOne(data: ReadUserDto) {
    const user = await this.em.findOne(User, data);
    return user;
  }

  async findMany(data: ReadUserDto): Promise<User[]> {
    const users = await this.em.find(User, data);
    return users;
  }

  async findById(id: string) {
    const user = await this.em.findOne(User, { id });
    return user;
  }

  async create(data: CreateUserDto) {
    const city = await this.geoService.findCityById(data.info.city);

    if (!city) {
      throw new NotFoundException("Cidade não encontrada");
    }

    const existingUser = await this.em.findOne(User, {
      $or: [{ email: data.email }, { document: data.document }],
    });

    if (existingUser) {
      if (existingUser.email === data.email) {
        throw new ConflictException({
          message: "Email já utilizado por outro usuário.",
          property: "email",
        });
      }
      if (existingUser.document === data.document) {
        throw new ConflictException({
          message: "Documento já utilizado por outro usuário.",
          property: "document",
        });
      }
    }

    const { info, ...general } = data;

    const userInfo = this.em.create(UserInfo, info);

    const user = this.em.create(User, {
      ...general,
      info: userInfo,
      confirmed: false,
      role: Role.user,
    });

    await this.em.flush();
    return { email: user.email, id: user.id, firstName: user.firstName };
  }
}
