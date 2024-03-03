import type { Metadata } from "next";
import { Inter } from "next/font/google";
import clsx from "clsx";
import { PanelSidebarsLayout } from "./_shared/components/Sidebars/PanelSidebarsLayout";
import { cookies, headers } from "next/headers";
import { UseMiddlewares } from "@/middleware/functions/useMiddlewares";
import { UserSessionMiddleware } from "@/middleware/functions/userSession.middleware";
import { readOrganizations } from "@/app/api/orgs/service";
import { Organization } from "@prisma/client";
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

  return (
    <>
      <PanelSidebarsLayout user={data?.request.userSession} />
      <PanelStore
        value={{
          colors: {
            primaryColor: {
              hex: "#4f46e5",
              id: "indigo_600",
              tw: { id: "indigo-600", color: "indigo", shade: "-600" },
              rgb: null,
            },
            secondaryColor: {
              hex: "#ffffff",
              id: "white",
              tw: { id: "white", color: "white", shade: "" },
              rgb: null,
            },
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
