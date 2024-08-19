import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";
import { JwtUserPayload } from "shared-types";

export type RequestWithSession = Request & { user?: JwtUserPayload };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: RequestWithSession = ctx.switchToHttp().getRequest();

    if (!request.headers.authorization) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(
        request.headers.authorization,
        {
          secret: process.env.JWT_SECRET,
        }
      );

      request.user = payload;

      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
