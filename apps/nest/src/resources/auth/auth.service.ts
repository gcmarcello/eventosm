import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserService } from "../users/user.service";
import { isEmail } from "class-validator";
import { compareHash } from "@/utils/bCrypt";
import { JwtService } from "@nestjs/jwt";
import { SignupDto, LoginDto } from "shared-types";
import { OrganizationService } from "../organizations/services/organization.service";
import { OrganizationRoleService } from "../organizations/services/role.service";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private organizationService: OrganizationService,
    private organizationRoleService: OrganizationRoleService
  ) {}

  async signup(data: SignupDto) {
    return await this.userService.create(data);
  }

  async login(data: LoginDto) {
    const { identifier, password } = data;
    const isIdentifierEmail = isEmail(identifier);

    const user = await this.userService.findOne({
      [isIdentifierEmail ? "email" : "document"]: identifier,
    });

    if (!user || !(await compareHash(password, user.password)))
      throw new UnauthorizedException("Usuário ou senha incorretos");

    return await this.createToken({
      id: user.id,
      role: user.role,
      name: user.firstName,
    });
  }

  async createToken(payload: any) {
    return await this.jwtService.signAsync(payload);
  }

  async updateActiveOrganization(organizationId: string, token?: string) {
    if (!token) throw new UnauthorizedException("Token não encontrado.");

    const payload = await this.jwtService.decode(token);
    const organization = await this.organizationService.findOne(organizationId);

    if (!organization)
      throw new NotFoundException("Organização não encontrada.");

    const role = await this.organizationRoleService.findOne(
      organizationId,
      payload.id
    );

    if (!role && organization.owner.id !== payload.id)
      throw new UnauthorizedException(
        "Você não faz parte da equipe desta organização."
      );

    const expiresIn = dayjs(payload.exp, "X").diff(dayjs(), "second");

    return this.jwtService.signAsync(
      {
        id: payload.id,
        name: payload.name,
        role: payload.role,
        activeOrg: organizationId,
      },
      { expiresIn }
    );
  }
}
