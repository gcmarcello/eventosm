import { NextRequest } from "next/server";
import { CustomDomainMiddleware } from "./middleware/functions/customDomain.middleware";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
import { startsWith } from "./middleware/utils/startsWith";
import authRedirect from "./middleware/utils/authRedirect";
import rewrite from "./middleware/utils/rewrite";

export async function customDomainMiddleware({
  request,
  host,
  token,
}: {
  request: NextRequest;
  host: string;
  token: string | undefined;
}) {
  const customDomain = await CustomDomainMiddleware({ host });
  const isAuthenticated = await AuthMiddleware({
    request: { token },
    additionalArguments: { roles: ["user"] },
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("userId", isAuthenticated);
  requestHeaders.set("x-url", request.url);
  const redirect = request.nextUrl.searchParams.get("redirect") || "/";

  if (
    startsWith({ arg: ["/inscricoes", /^\/org\/[^\/]+\/inscricoes/], request })
  ) {
    if (!isAuthenticated)
      return authRedirect({
        url: `/login?&redirect=${request.nextUrl.pathname}`,
        request,
      });
  }

  if (startsWith({ arg: ["/login", "/painel"], request })) {
    isAuthenticated &&
      authRedirect({
        url: new URL(redirect, request.nextUrl).href,
        request,
      });
  }

  return rewrite({ customDomain, request, headers: requestHeaders });
}
