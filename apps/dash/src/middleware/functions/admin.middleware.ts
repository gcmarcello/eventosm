"use server";
import { User, UserInfo } from "@prisma/client";
import { headers } from "next/headers";
import { MiddlewareArguments } from "../types/types";
import prisma from "prisma/prisma";
import { UserWithoutPassword } from "prisma/types/User";
import { redirect } from "next/navigation";

export async function AdminMiddleware<P>({
  request,
  additionalArguments,
}: MiddlewareArguments<P>) {
  const userId = headers().get("userId")!;

  if (!userId || userId === "false") redirect("/");

  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: {
      info: additionalArguments?.includeInfo,
    },
  });

  if (!user) throw "Usuário não encontrado.";
  if (user.role !== "admin") throw "Você não tem permissão para fazer isso.";

  return {
    request: {
      ...request,
    },
  };
}

export type UserSession = UserWithoutPassword & { info?: UserInfo };

export type AdminMiddlewareReturnType<T> = Awaited<
  ReturnType<typeof AdminMiddleware<T>>
>;
