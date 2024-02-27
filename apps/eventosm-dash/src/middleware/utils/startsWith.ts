import { NextRequest } from "next/server";

export function startsWith({
  arg,
  request,
}: {
  arg: (string | RegExp)[];
  request: NextRequest;
}) {
  const testArray = [];
  for (const a of arg) {
    if (typeof a === "string") {
      testArray.push(request.nextUrl.pathname.startsWith(a));
    } else {
      testArray.push(a.test(request.nextUrl.pathname));
    }
    return testArray.some((a) => a);
  }
}
