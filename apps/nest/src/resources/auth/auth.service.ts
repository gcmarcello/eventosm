import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { LoginDto } from "./dto/login.dto";
import { UserService } from "../users/user.service";
import { isEmail } from "class-validator";
import { compareHash } from "@/utils/bCrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async login(data: LoginDto) {
    const { identifier, password } = data;
    const isIdentifierEmail = isEmail(identifier);

    const user = await this.userService.findOne({
      [isIdentifierEmail ? "email" : "document"]: identifier,
    });

    if (!user) throw new NotFoundException("User not found");

    if (!(await compareHash(password, user.password)))
      throw new UnauthorizedException("Invalid password");

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
