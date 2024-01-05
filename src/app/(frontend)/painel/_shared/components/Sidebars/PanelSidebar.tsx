"use client";
import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  MapIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  PlusCircleIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
  CalendarIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { User } from "@prisma/client";
import { useSidebar } from "./lib/useSidebar";
import Link from "next/link";
import WhatsAppIcon from "@/app/(frontend)/_shared/components/icons/WhatsAppIcon";
import Image from "next/image";
import { Logo } from "@/app/(frontend)/_shared/components/Logo";
import { For } from "@/app/(frontend)/_shared/components/For";
import {
  CalendarDaysIcon,
  DocumentIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";

export default function PanelSideBar() {
  const { user } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  const navigation = [
    {
      name: "Início",
      href: `/painel/`,
      icon: HomeIcon,
      current: !pathname.includes("painel/"),
    },
    {
      name: "Eventos",
      href: `/painel/eventos`,
      icon: CalendarDaysIcon,
      current: pathname.includes("/eventos"),
    },
    {
      name: "Notícias",
      href: `/painel/noticias`,
      icon: NewspaperIcon,
      current: pathname.includes("/noticias"),
    },
    {
      name: "Documentos",
      href: `/painel/documentos`,
      icon: DocumentIcon,
      current: pathname.includes("/documentos"),
    },
    {
      name: "Galerias",
      href: `/painel/galerias`,
      icon: PhotoIcon,
      current: pathname.includes("/tmidiasme"),
    },
  ];

  return (
    <>
      <div className="absolute w-64 overflow-clip">
        <div className="hidden lg:flex lg:h-screen lg:w-64 lg:flex-col">
          <div
            className={clsx(
              "bg-zinc-700",
              `fixed flex h-full w-64  grow flex-col gap-y-1 overflow-y-hidden px-6 pb-4`
            )}
          >
            <div className="my-2 flex h-16 shrink-0 items-center">
              <Logo />
            </div>

            <nav className="mt-2 flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-3 xl:gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          href={item.href}
                          className={clsx(
                            item.current
                              ? "bg-zinc-800 text-white"
                              : "text-gray-200 hover:bg-zinc-800 hover:text-white",
                            "leading-6, group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                          )}
                        >
                          <item.icon
                            className={clsx(
                              item.current
                                ? "text-white"
                                : "text-gray-200 group-hover:text-white",
                              item.icon === WhatsAppIcon &&
                                "me-1 h-[1.3rem] w-[1.3rem] fill-indigo-200",

                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>

                <li className="mt-auto">
                  <Link
                    href="/painel/configuracoes"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-200 hover:bg-zinc-700 hover:text-white"
                  >
                    <Cog6ToothIcon
                      className="h-6 w-6 shrink-0 text-gray-200 group-hover:text-white"
                      aria-hidden="true"
                    />
                    Configurações
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </>
  );
}
