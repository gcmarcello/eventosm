"use server";
import { User, UserInfo } from "@prisma/client";
import { headers } from "next/headers";
import { MiddlewareArguments } from "../types/types";
import { prisma } from "prisma/prisma";
import { UserWithoutPassword } from "prisma/types/User";
import { redirect } from "next/navigation";

export async function UserSessionMiddleware<P>({
  request,
  additionalArguments,
}: MiddlewareArguments<P>) {
  const userId = headers().get("userId")!;

  if (!userId || userId === "false") redirect("/login");

  const user = await prisma.user
    .findFirst({
      where: {
        id: userId,
      },
      include: {
        info: additionalArguments?.includeInfo,
      },
    })
    .then((user) => user!);

  if (!user) throw "Usuário não encontrado";

  const { password, ...rest } = user;

  return {
    request: {
      ...request,
      userSession: rest,
    },
  };
}

export type UserSession = UserWithoutPassword & { info?: UserInfo };

export type UserSessionMiddlewareReturnType<T> = Awaited<
  ReturnType<typeof UserSessionMiddleware<T>>
>;
