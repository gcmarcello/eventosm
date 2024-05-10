import { getServerEnv } from "@/app/api/env";
import { headers } from "next/headers";
import { Button } from "odinkit/client";

export default async function NotFoundOrg() {
  const headersList = headers();
  const domain = headersList.get("host")!;
  const slug = headersList.get("x-url")?.split("/").splice(4, 1).join("/");
  let org;
  if (domain === getServerEnv("HOST")) {
    org = await prisma.organization.findUnique({
      where: { slug },
    });
  } else {
    const info = await prisma.orgCustomDomain.findUnique({
      where: { domain },
      select: { Organization: true },
    });
    org = info?.Organization;
  }

  return (
    <>
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p
            className="text-base font-semibold "
            style={{
              color: org ? org?.options.colors.primaryColor.hex : "black",
            }}
          >
            404
          </p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Página não encontrada
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Desculpe, nós não conseguimos encontrar a página que você está
            procurando.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              href="/"
              color={org ? org?.options.colors.primaryColor.tw.color : "indigo"}
              className="rounded-md  px-3.5 py-2.5 text-sm font-semibold  shadow-sm  focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Voltar à página inicial
            </Button>
            <a href="#" className="text-sm font-semibold text-gray-900">
              Entre em contato com o suporte{" "}
              <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </main>
    </>
  );
}
