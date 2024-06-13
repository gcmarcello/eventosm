import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request =
      GqlExecutionContext.create(context).getContext().req;

    if (!request.headers.authorization) throw new UnauthorizedException();

    try {
      const decodedToken = await this.jwtService.verifyAsync(
        request.headers.authorization,
        { secret: process.env.JWT_SECRET }
      );
      return decodedToken;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
