"use server";
import { cookies } from "next/headers";
import { prisma } from "prisma/prisma";
import { UserSessionMiddlewareReturnType } from "./userSession.middleware";
import { OrganizationPermission } from "@prisma/client";

export async function OrganizationMiddleware<T>({
  request,
  permission,
}: UserSessionMiddlewareReturnType<T> & {
  permission?: OrganizationPermission;
}) {
  const activeOrg = cookies().get("activeOrg")?.value;

  if (!activeOrg) throw "Você não está em uma organização.";

  const organization = await prisma.organization.findFirst({
    where: {
      id: activeOrg,
    },
    include: {
      OrganizationRole: { include: { OrganizationRolePermission: true } },
    },
  });

  const userRole = await prisma.user.findFirst({
    where: { id: request.userSession.id },
    select: {
      OrganizationRole: {
        where: { organizationId: activeOrg },
        include: { OrganizationRolePermission: true },
      },
    },
  });

  if (organization?.ownerId !== request.userSession.id)
    throw "Você não tem permissão para acessar os dados dessa organização.";

  return {
    request: {
      ...request,
      organization,
    },
  };
}

export type SupporterSessionMiddlewareReturnType = Awaited<
  ReturnType<typeof OrganizationMiddleware>
>;
