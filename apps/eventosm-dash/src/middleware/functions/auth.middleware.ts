import { getEnv } from "@/utils/settings";
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
      new TextEncoder().encode(getEnv("JWT_KEY"))
    );

    const roles: string[] = additionalArguments.roles;

    const url = getEnv("NEXT_PUBLIC_SITE_URL");

    if (!url) return false;
    if (!payload.id) return false;

    console.log(`${url}/api/auth/verify`);
    const user = await fetch(`${url}/api/auth/verify`, {
      headers: { Authorization: payload.id as string },
    })
      .then((res) => res.json())
      .catch((error) => error);

    if (!user) return false;

    const isAuthenticated = [...roles, "admin"].includes(user.role);

    if (!isAuthenticated) return false;

    return user.id;
  } catch (error) {
    return false;
  }
}
