import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RequestWithSession } from "../auth/auth.guard";
import { OrganizationService } from "./services/organization.service";
import { Reflector } from "@nestjs/core";
import { Permissions } from "./permissions.decorator";
import { Organization } from "./entities/organization.entity";
import { OrganizationRole } from "./entities/organizationRole.entity";
import { OrganizationPermissions } from "./entities/organizationPermission.entity";
import { EntityManager } from "@mikro-orm/postgresql";

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
    private organizationService: OrganizationService,
    private reflector: Reflector,
    private em: EntityManager
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const permissions = this.reflector.get(Permissions, ctx.getHandler());

    const context = GqlExecutionContext.create(ctx);

    const request: RequestWithSession = context.getContext().req;

    if (!permissions || !permissions.length) {
      return true;
    }

    const user = request.user;

    if (!user)
      throw new ForbiddenException(
        "Você não possui permissão para fazer isto."
      );

    const orgId = context.getArgs().data.id;

    if (!orgId) throw new NotFoundException("Organização não encontrada.");

    const organization = await this.organizationService.findOne(orgId);

    if (!organization)
      throw new NotFoundException("Organização não encontrada.");

    if (organization.owner.id === user?.id) return true;

    return await this.verifyOrganizationPermission(
      user.id,
      organization,
      permissions
    );
  }

  async verifyOrganizationPermission(
    userId: string,
    organization: Organization,
    permissions: OrganizationPermissions[]
  ) {
    const userRole = await this.em.findOne(
      OrganizationRole,
      {
        organization: organization.id,
        users: { id: userId },
      },
      { populate: ["permissions"] }
    );

    const userPermissions = userRole?.permissions?.map((p) => p.permission);

    if (!userPermissions)
      throw new ForbiddenException("Você não tem permissão para fazer isto.");

    if (!permissions.every((p) => userPermissions.includes(p)))
      throw new ForbiddenException("Você não tem permissão para fazer isto.");

    return true;
  }
}
