import { useHeaders } from "@/app/api/_shared/utils/useHeaders";
import { readOrganizations } from "@/app/api/orgs/service";
import {
  UserCircleIcon,
  UsersIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";

import clsx from "clsx";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Sidebar from "./components/Sidebar";
import { Alertbox } from "odinkit";
import OrgFooter from "../../_shared/OrgFooter";

export default async function OrgProfileLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgSlug: string; page: string };
}) {
  const { referer } = await useHeaders();
  const path = referer?.split("/").slice(3).join("/");

  const secondaryNavigation = [
    {
      name: "Inscrições",
      href: "/perfil",
      icon: ClipboardDocumentCheckIcon,
      current: path === "perfil",
    },
    {
      name: "Configurações",
      href: "/perfil/configuracoes",
      icon: UserCircleIcon,
      current: path === "perfil/configuracoes",
    },
    {
      name: "Equipes",
      href: "/perfil/equipes",
      icon: UsersIcon,
      current: path === "perfil/equipes",
    },
  ];

  const organization = (
    await readOrganizations({
      where: { slug: params.orgSlug },
    })
  )[0];

  if (!organization) return notFound();

  return (
    <>
      <div className="max-w-7xl grow lg:mx-32  lg:flex lg:gap-x-8 lg:px-8">
        <Sidebar organization={organization} />
        <main className="px-4 pb-8 pt-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-10">
          {children}
        </main>
      </div>
      <OrgFooter organization={organization} />
    </>
  );
}
