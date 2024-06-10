import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { GqlExecutionContext } from "@nestjs/graphql";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}
  canActivate(
    context: ExecutionContext
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request =
      GqlExecutionContext.create(context).getContext().req;

    throw new UnauthorizedException();
  }
}
