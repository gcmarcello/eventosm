import { NextRequest, NextResponse, userAgent } from "next/server";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
import { customDomainMiddleware } from "./customDomainMiddleware";
import { getServerEnv } from "./app/api/env";

export async function middleware(request: NextRequest) {
  const maintenanceMode = getServerEnv("MAINTENANCE_MODE") ?? "false";

  if (maintenanceMode === "true") {
    return NextResponse.json("Site em Manutenção");
  }

  const startsWith = (arg: (string | RegExp)[]) => {
    const testArray = [];
    for (const a of arg) {
      if (typeof a === "string") {
        testArray.push(request.nextUrl.pathname.startsWith(a));
      } else {
        testArray.push(a.test(request.nextUrl.pathname));
      }
    }
    return testArray.some((a) => a);
  };

  function authRedirect({ url, redirect }: { url: string; redirect?: string }) {
    return NextResponse.redirect(
      new URL(redirect ?? url, request.nextUrl).href
    );
  }

  const token = request.cookies.get("token")?.value;
  const host = request.headers.get("host");
  const redirect = request.nextUrl.searchParams.get("redirect") || "/";
  if (!host) throw "Host não encontrado.";

  if (host !== getServerEnv("HOST")) {
    return await customDomainMiddleware({ request, host, token, redirect });
  }

  const isLoggedIn = await fetch("http://localhost:5000/auth/", {
    headers: { Authorization: token || "" },
    method: "GET",
  })
    .then(async (res) => res.ok)
    .catch(() => false);

  if (startsWith(["/login", "/registrar"]) && isLoggedIn)
    return authRedirect({ url: redirect });

  if (startsWith(["/admin"]))
    if (!isLoggedIn) return authRedirect({ url: "/login?redirect=/admin" });

  if (startsWith(["/painel"]) && !isLoggedIn)
    return authRedirect({ url: "/login?redirect=/painel" });

  const requestHeaders = new Headers(request.headers);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
