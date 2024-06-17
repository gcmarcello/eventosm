import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { RequestWithSession } from "../auth.guard";

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: RequestWithSession =
      GqlExecutionContext.create(ctx).getContext().req;

    const user = request.user;

    return user?.id;
  }
);
