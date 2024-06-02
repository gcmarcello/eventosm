import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { PanelSidebarsLayout } from "./_shared/components/Sidebars/PanelSidebarsLayout";
import { cookies, headers } from "next/headers";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readOrganizations } from "@/app/api/orgs/service";
import { redirect } from "next/navigation";
import { PanelStore } from "./_shared/components/PanelStore";
import { DashboardNavbar } from "./_shared/components/DashboardNavbar";
import { Suspense } from "react";
import Loading from "./loading";

const inter = Inter({ subsets: ["latin"] });

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
  const data = await UseMiddlewares().then(UserSessionMiddleware);

  if (!data?.request.userSession) redirect("/");

  const organizations = await readOrganizations({
    where: { ownerId: data.request.userSession.id },
  });

  if (!organizations.length) return redirect("/orgs/nova");

  const activeOrg = cookies().get("activeOrg")?.value;

  const organization = organizations?.find((org) => org.id === activeOrg);

  if (!organization) return redirect("/orgs/nova");

  return (
    <>
      <PanelStore
        value={{
          colors: {
            primaryColor: organization?.options?.colors.primaryColor,
            secondaryColor: organization?.options?.colors.secondaryColor,
          },
        }}
      />
      <div className="px-4 lg:bg-zinc-100 dark:bg-zinc-900 dark:lg:bg-zinc-950">
        <DashboardNavbar
          user={data.request.userSession}
          organizations={organizations}
          activeOrgId={organization?.id}
        />
      </div>

      <Suspense fallback={<Loading />}>{children}</Suspense>
    </>
  );
}
