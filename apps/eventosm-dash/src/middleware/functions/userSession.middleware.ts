"use server";
import { User } from "@prisma/client";
import { headers } from "next/headers";
import { MiddlewareArguments } from "../types/types";
import { prisma } from "prisma/prisma";
import { UserWithoutPassword } from "prisma/types/User";
import { redirect } from "next/navigation";

export async function UserSessionMiddleware<P>({
  request,
}: MiddlewareArguments<P>) {
  const userId = headers().get("userId")!;

  if (!userId || userId === "false") redirect("/login");

  const user = await prisma.user
    .findFirst({
      where: {
        id: userId,
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

export type UserSession = UserWithoutPassword;

export type UserSessionMiddlewareReturnType<T> = Awaited<
  ReturnType<typeof UserSessionMiddleware<T>>
>;
