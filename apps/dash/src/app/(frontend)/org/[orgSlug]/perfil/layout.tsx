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
    <div className="mx-auto max-w-7xl  lg:flex lg:gap-x-8 lg:px-8">
      <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-10">
        <nav className="flex-none px-4 sm:px-6 lg:px-0">
          <ul
            role="list"
            className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
          >
            {secondaryNavigation.map((item) => (
              <li
                key={item.name}
                style={{
                  color: organization?.options.colors.primaryColor.hex,
                }}
              >
                <a
                  href={item.href}
                  className={clsx(
                    item.current
                      ? "bg-gray-50 "
                      : "text-gray-700 hover:bg-gray-50 ",
                    "group flex gap-x-3 rounded-md py-2 pl-2 pr-3 text-sm font-semibold leading-6"
                  )}
                >
                  <item.icon
                    className={clsx(
                      item.current ? "" : "text-gray-400 ",
                      "h-6 w-6 shrink-0"
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <main className="px-4 pb-8 pt-4 sm:px-6 lg:flex-auto lg:px-0 lg:py-10">
        {children}
      </main>
    </div>
  );
}
