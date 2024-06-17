import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
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
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, ctx.getHandler());

    const context = GqlExecutionContext.create(ctx);

    const request: RequestWithSession = context.getContext().req;

    if (!permissions || !permissions.length) {
      return true;
    }

    const user = request.user;

    const orgId = context.getArgs().data.id;

    console.log(orgId);

    if (!orgId) throw new NotFoundException("Organização não encontrada.");

    const organization = await this.organizationService.findOne(orgId);

    if (!organization)
      throw new NotFoundException("Organização não encontrada.");

    if (organization.owner.id === user?.id) return true;

    throw new ForbiddenException("Você não possui permissão para fazer isto.");
  }
}
