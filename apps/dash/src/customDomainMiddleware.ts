import { NextRequest } from "next/server";
import { CustomDomainMiddleware } from "./middleware/functions/customDomain.middleware";
import { AuthMiddleware } from "./middleware/functions/auth.middleware";
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
  const startsWith = (arg: (string | RegExp)[]) => {
    const testArray = [];
    for (const a of arg) {
      if (typeof a === "string") {
        testArray.push(request.nextUrl.pathname.startsWith(a));
      } else {
        testArray.push(a.test(request.nextUrl.pathname));
      }
      return testArray.some((a) => a);
    }
  };
  const customDomain = await CustomDomainMiddleware({ host });
  const isAuthenticated = await AuthMiddleware({
    request: { token },
    additionalArguments: { roles: ["user"] },
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("userId", isAuthenticated);
  requestHeaders.set("x-url", request.url);
  const redirect = request.nextUrl.searchParams.get("redirect") || "/";

  if (startsWith(["/inscricoes", /^\/org\/[^\/]+\/inscricoes/])) {
    if (!isAuthenticated)
      return authRedirect({
        url: `/login?&redirect=${request.nextUrl.pathname}`,
        request,
      });
  }

  if (startsWith(["/login", "/painel"])) {
    isAuthenticated &&
      authRedirect({
        url: new URL(redirect, request.nextUrl).href,
        request,
      });
  }

  return rewrite({ customDomain, request, headers: requestHeaders });
}
