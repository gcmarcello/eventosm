import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { DashboardNavbar } from "./_shared/components/DashboardNavbar";
import { Suspense } from "react";
import Loading from "./loading";
import { readUserOrganizations } from "@/app/api/orgs/service";
import { cookies } from "next/headers";
import { decodeJwt } from "jose";
import { redirect } from "next/navigation";
import { JwtUserPayload } from "shared-types";
import { PanelProvider } from "./context/PanelProvider";

export const metadata: Metadata = {
  title: "EventoSM",
  description: "Painel de Controle",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "#18181b" },
  ],
};

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizations = await readUserOrganizations();
  if (!organizations?.length) return "No orgs";
  const cookie = cookies().get("token")?.value;
  let decodedCookie: JwtUserPayload;

  let activeOrg;

  if (!cookie) return redirect("/login");

  try {
    decodedCookie = decodeJwt(cookie);
    activeOrg = decodedCookie?.activeOrg;
  } catch (error) {
    redirect("/login");
  }

  /* const data = await UseMiddlewares().then(UserSessionMiddleware);

  if (!data?.request.userSession) redirect("/");

  const organizations = await readOrganizations({
    where: { ownerId: data.request.userSession.id },
  });

  if (!organizations.length) return redirect("/orgs/nova");

  const activeOrg = cookies().get("activeOrg")?.value;

  const organization = organizations?.find((org) => org.id === activeOrg);

  if (!organization) return redirect("/orgs/nova");*/

  return (
    <>
      <PanelProvider organizations={organizations} session={decodedCookie}>
        <div className="px-4 lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
          <DashboardNavbar />
        </div>

        <Suspense fallback={<Loading />}>{children}</Suspense>
      </PanelProvider>
    </>
  );
}
