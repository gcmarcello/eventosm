"use client";
import {
  ClipboardDocumentCheckIcon,
  DocumentTextIcon,
  UserCircleIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { Organization } from "@prisma/client";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { scrollToElementX } from "odinkit";
import path from "path";
import { useEffect, useRef } from "react";

export default function Sidebar({
  organization,
}: {
  organization: Organization;
}) {
  const pathName = usePathname();
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  const secondaryNavigation = [
    {
      name: "Inscrições",
      id: "inscricoes",
      href: "/perfil",
      icon: ClipboardDocumentCheckIcon,
      current: pathName === "/perfil",
    },
    {
      name: "Configurações",
      id: "configuracoes",
      href: "/perfil/configuracoes",
      icon: UserCircleIcon,
      current: pathName === "/perfil/configuracoes",
    },
    {
      name: "Equipes",
      id: "equipes",
      href: "/perfil/equipes",
      icon: UsersIcon,
      current: pathName === "/perfil/equipes",
    },
    {
      name: "Documentação",
      id: "documentos",
      href: "/perfil/documentos",
      icon: DocumentTextIcon,
      current: pathName === "/perfil/documentos",
    },
  ];

  useEffect(() => {
    const index = secondaryNavigation.findIndex((item) => item.current);
    if (index !== -1 && itemsRef.current[index]) {
      const element = itemsRef.current[index];

      if (element instanceof HTMLElement) {
        scrollToElementX(element);
      }
    }
  }, []);
  return (
    <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0 lg:py-10">
      <nav className="flex-none px-4 sm:px-6 lg:px-0">
        <ul
          role="list"
          className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col"
        >
          {secondaryNavigation.map((item, index) => (
            <li
              key={item.name}
              ref={(el) => (itemsRef.current[index] = el)}
              id={item.id}
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
  );
}
