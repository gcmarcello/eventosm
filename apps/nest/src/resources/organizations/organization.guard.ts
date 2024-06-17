import { Injectable, CanActivate, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { JwtService } from "@nestjs/jwt";
import { RequestWithSession } from "../auth/auth.guard";
import { OrganizationService } from "./organization.service";
import { Reflector } from "@nestjs/core";
import { Permissions } from "./permissions.decorator";

export type JwtUserPayload = {
  id: string;
  role: string;
  name: string;
  iat: number;
  exp: number;
};

@Injectable()
export class OrganizationGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private organizationService: OrganizationService,
    private reflector: Reflector
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, context.getHandler());

    if (!permissions || !permissions.length) {
      return true;
    }

    const request: RequestWithSession =
      GqlExecutionContext.create(context).getContext().req;

    console.log(request.user);

    console.log(permissions);

    return true;
  }
}
