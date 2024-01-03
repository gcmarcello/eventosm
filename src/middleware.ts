import { NextRequest, NextResponse } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";

export async function middleware(request: NextRequest) {
  const startsWith = (arg: string | RegExp) => {
    if (typeof arg === "string") return request.nextUrl.pathname.startsWith(arg);
    return arg.test(request.nextUrl.pathname);
  };

  const token = request.cookies.get("token")?.value;

  if (startsWith("/login")) {
    const isAuthenticated = await AuthMiddleware({
      request: { token },
      additionalArguments: { roles: ["user"] },
    });

    if (isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }

  if (startsWith("/admin")) {
    const isAuthenticated = await AuthMiddleware({
      request: { token },
      additionalArguments: { roles: ["admin"] },
    });

    if (!isAuthenticated)
      return NextResponse.redirect(new URL("/painel", request.nextUrl).href);
  }
}
