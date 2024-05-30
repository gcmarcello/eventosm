import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { PanelSidebarsLayout } from "./_shared/components/Sidebars/PanelSidebarsLayout";
import { cookies, headers } from "next/headers";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readOrganizations } from "@/app/api/orgs/service";
import { redirect } from "next/navigation";
import { PanelStore } from "./_shared/components/PanelStore";
import CreateOrgContainer from "./_shared/components/Org/CreateOrgContainer";
import SelectOrgContainer from "./_shared/components/Org/SelectOrgContainer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventoSM",
  description: "Painel de Controle",
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

  if (!organizations.length)
    return <CreateOrgContainer user={data.request.userSession} />;

  const activeOrg = cookies().get("activeOrg")?.value;

  const organization = organizations?.find((org) => org.id === activeOrg);

  if (!activeOrg || !organization)
    return <SelectOrgContainer organizations={organizations} />;

  return <>{children}</>;
}
