"use server";
import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";
import { UserSessionMiddlewareReturnType } from "./userSession.middleware";

export async function OrganizationMiddleware<T>({
  request,
}: UserSessionMiddlewareReturnType<T>) {
  const activeOrg = cookies().get("activeOrg")?.value;

  if (!activeOrg) throw "Você não está em uma organização.";

  const organization = await prisma.organization.findFirst({
    where: {
      ownerId: request.userSession.id,
      id: activeOrg,
    },
  });

  if (!organization)
    throw "Você não tem permissão para acessar os dados dessa organização.";

  return {
    request: {
      ...request,
      id: activeOrg,
    },
  };
}

export type SupporterSessionMiddlewareReturnType = Awaited<
  ReturnType<typeof OrganizationMiddleware>
>;
