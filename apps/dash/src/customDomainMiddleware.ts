import { NextRequest, NextResponse, userAgent } from "next/server";
import { CustomDomainMiddleware } from "./middleware/functions/customDomain.middleware";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
import authRedirect from "./middleware/utils/authRedirect";
import rewrite from "./middleware/utils/rewrite";

export async function customDomainMiddleware({
  request,
  host,
  token,
  redirect,
}: {
  request: NextRequest;
  host: string;
  token: string | undefined;
  redirect?: string;
}) {
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

  function authRedirect({ url }: { url: string }) {
    const newUrl = new URL(url, request.nextUrl);
    return NextResponse.redirect(newUrl.href);
  }
  const customDomain = await CustomDomainMiddleware({ host });
  const isAuthenticated = await AuthMiddleware({
    request: { token },
    additionalArguments: { roles: ["user"] },
  });

  const { device } = userAgent(request);

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("userId", isAuthenticated);
  requestHeaders.set("x-url", request.url);
  requestHeaders.set("deviceType", device.type || "");

  if (
    startsWith([
      /^\/org\/[^\/]+\/inscricoes/,
      /^\/org\/[^\/]+\/equipes/,
      /^\/org\/[^\/]+\/perfil/,
      "/inscricoes",
      "/equipes",
      "/perfil",
      "/checkin",
    ]) &&
    !isAuthenticated
  ) {
    return authRedirect({
      url: `/login?&redirect=${request.nextUrl.pathname + request.nextUrl.search}`,
    });
  }

  if (startsWith(["/login", "/painel"]) && isAuthenticated) {
    return authRedirect({
      url: "/",
    });
  }

  return rewrite({ customDomain, request, headers: requestHeaders });
}
