"use server";
import { User } from "@prisma/client";
import { headers } from "next/headers";
import { MiddlewareArguments } from "../types/types";
import { UserWithoutPassword } from "prisma/types/User";
import prisma from "prisma/prisma";

export async function OptionalUserSessionMiddleware<P>({
  request,
}: MiddlewareArguments<P>) {
  const userId = headers().get("userId");

  if (!userId || userId === "false")
    return {
      request: {
        ...request,
        userSession: null,
      },
    };

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
