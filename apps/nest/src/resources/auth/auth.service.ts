import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../users/user.service";
import { isEmail } from "class-validator";
import { compareHash } from "@/utils/bCrypt";
import { JwtService } from "@nestjs/jwt";
import { SignupDto, LoginDto } from "shared-types";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
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
}
