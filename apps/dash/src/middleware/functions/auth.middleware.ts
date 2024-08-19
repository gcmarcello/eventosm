import { getClientEnv } from "@/app/(frontend)/env";
import { getServerEnv } from "@/app/api/env";
import { jwtVerify } from "jose";

export async function AuthMiddleware({
  request,
  additionalArguments,
}: {
  request: { token: string | undefined };
  additionalArguments: { roles: string[] };
}) {
  try {
    if (!request.token) return false;

    const { payload } = await jwtVerify(
      request.token,
      new TextEncoder().encode(getServerEnv("JWT_KEY"))
    );

    const roles: string[] = additionalArguments.roles;

    const url = process.env.NEXT_PUBLIC_SITE_URL;

    if (!url) return false;
    if (!payload.id) return false;

    const user = await fetch(`/api/auth/verify`, {
      headers: { Authorization: payload.id as string },
    })
      .then((res) => res.json())
      .catch((error) => console.log(error));

    if (!user) return false;
  } catch (error) {
    return false;
  }
}
