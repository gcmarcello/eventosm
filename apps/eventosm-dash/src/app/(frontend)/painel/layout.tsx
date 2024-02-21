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
import { PanelStore } from "./_shared/components/PanelStore";

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

  if (!organizations.length) return <CreateOrgContainer />;

  const activeOrg = cookies().get("activeOrg")?.value;

  const organization = organizations?.find((org) => org.id === activeOrg);

  if (!activeOrg || !organization)
    return <SelectOrgContainer organizations={organizations} />;

  return (
    <>
      <PanelSidebarsLayout
        user={data?.request.userSession}
        organization={organization}
      />
      <PanelStore
        value={{
          colors: {
            primaryColor: organization?.options?.colors.primaryColor,
            secondaryColor: organization?.options?.colors.secondaryColor,
          },
        }}
      />
      <div
        className={clsx(
          "h-[calc(100vh-80px-30px)] px-3 py-4 lg:ml-64 lg:p-8 lg:pt-5"
        )}
      >
        {children}
      </div>
    </>
  );
}
