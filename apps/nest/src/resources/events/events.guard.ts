import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { RequestWithSession } from "../auth/auth.guard";
import { EntityManager } from "@mikro-orm/postgresql";
import { Event } from "shared-types";

@Injectable()
export class EventGuard implements CanActivate {
  constructor(private em: EntityManager) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const request: RequestWithSession = ctx.switchToHttp().getRequest();

    if (!request.user?.activeOrg)
      throw new UnauthorizedException(
        "Você não possui permissão para fazer isto."
      );

    const event = await this.em.findOne(Event, {
      organization: request.user.activeOrg,
      id: request.params.id,
    });

    if (!event) throw new NotFoundException("Evento não encontrado.");

    return true;
  }
}
