import { NextRequest, NextResponse } from "next/server";
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
      return testArray.some((a) => a);
    }
  };

  function authRedirect({ url }: { url: string }) {
    return NextResponse.redirect(
      new URL(redirect ?? url, request.nextUrl).href
    );
  }
  const customDomain = await CustomDomainMiddleware({ host });
  const isAuthenticated = await AuthMiddleware({
    request: { token },
    additionalArguments: { roles: ["user"] },
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("userId", isAuthenticated);
  requestHeaders.set("x-url", request.url);

  if (
    startsWith(["/inscricoes", /^\/org\/[^\/]+\/inscricoes/]) &&
    !isAuthenticated
  )
    return authRedirect({
      url: `/login?&redirect=${request.nextUrl.pathname}`,
    });

  if (startsWith(["/login", "/painel"]) && isAuthenticated) {
    return authRedirect({
      url: "/",
    });
  }

  return rewrite({ customDomain, request, headers: requestHeaders });
}
