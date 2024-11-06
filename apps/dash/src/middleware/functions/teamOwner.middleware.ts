import prisma from "prisma/prisma";
import { UserSessionMiddlewareReturnType } from "./userSession.middleware";

interface TeamOwnerMiddlewareRequestType<T>
  extends UserSessionMiddlewareReturnType<T> {
  request: UserSessionMiddlewareReturnType<T>["request"] & {
    teamId: string;
  };
}

export async function TeamOwnerMiddleware<T>({
  request,
}: TeamOwnerMiddlewareRequestType<T>) {
  const { teamId } = request;

  if (!teamId) {
    throw "Você não tem permissão para acessar os dados dessa organização.";
  }

  const team = await prisma.team.findFirst({
    where: {
      id: teamId, // Assuming you have the correct access to teamId here
      ownerId: request.userSession.id,
    },
  });

  if (!team) {
    throw "Equipe não encontrada ou você não tem permissão para acessá-la.";
  }

  // Continue with your logic, knowing that teamId is now part of the request object
  return {
    request: {
      ...request,
    },
  };
}

export type SupporterSessionMiddlewareReturnType = Awaited<
  ReturnType<typeof TeamOwnerMiddleware>
>;
