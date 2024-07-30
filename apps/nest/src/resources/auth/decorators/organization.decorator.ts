import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { RequestWithSession } from "../auth.guard";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: RequestWithSession = ctx.switchToHttp().getRequest();

    const user = request.user;

    return user?.id;
  }
);
