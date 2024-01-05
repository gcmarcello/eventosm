import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { PanelSidebarsLayout } from "./_shared/components/Sidebars/PanelSidebarsLayout";
import { cookies, headers } from "next/headers";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readOrganizations } from "@/app/api/orgs/service";
import { Organization } from "@prisma/client";
import CreateOrgContainer from "../novaorg/components/CreateOrgContainer";
import SelectOrgContainer from "./components/SelectOrgContainer";
import { redirect } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EventoSM",
  description: "Painel de Controle",
};

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  let organizations = null;
  let data;

  try {
    data = await UseMiddlewares().then(UserSessionMiddleware);
    organizations = await readOrganizations({
      where: { ownerId: data.request.userSession.id },
    });
  } catch (error) {
    console.log(error);
  }

  const activeOrg = cookies().get("activeOrg")?.value;
  const organization = organizations?.find((org) => org.id === activeOrg);

  if (!organizations) return <CreateOrgContainer />;

  if (!activeOrg || !organizations.find((org) => org.id === activeOrg))
    return <SelectOrgContainer organizations={organizations} />;

  if (!data?.request.userSession) redirect("/");

  return (
    <>
      {organization && (
        <PanelSidebarsLayout
          user={data?.request.userSession}
          organization={organization}
        />
      )}
      <div className={clsx(inter.className)}>{children}</div>
    </>
  );
}
