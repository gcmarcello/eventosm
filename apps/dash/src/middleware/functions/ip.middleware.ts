"use server";
import { User } from "@prisma/client";
import { headers } from "next/headers";
import { MiddlewareArguments } from "../types/types";

export async function IpMiddleware<P>({ request }: MiddlewareArguments<P>) {
  const ip = headers().get("X-Forwarded-For")!;
  return {
    request: {
      ...request,
      ip,
    },
  };
}
