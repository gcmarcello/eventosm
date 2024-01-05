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
  const { organization, visibility, setVisibility } = useSidebar();
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
        <Transition.Root show={visibility.panelSidebar} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-50 lg:hidden"
            onClose={() =>
              setVisibility((prev) => ({
                ...prev,
                panelSidebar: false,
              }))
            }
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>

            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="sm:left-13/16 absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() =>
                          setVisibility((prev) => ({
                            ...prev,
                            panelSidebar: false,
                          }))
                        }
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                      </button>
                    </div>
                  </Transition.Child>
                  <div
                    className={clsx(
                      "bg-indigo-600",
                      "fixed  flex h-full w-64 grow flex-col gap-y-5 overflow-y-auto  px-6 pb-4"
                    )}
                  >
                    <div className="my-2 flex h-16 shrink-0 items-center">
                      <Logo />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            <For each={navigation}>
                              {(item) => (
                                <li>
                                  <a
                                    href={item.href}
                                    className={clsx(
                                      item.current
                                        ? `bg-indigo-700 text-white`
                                        : "text-indigo-200 hover:bg-indigo-700 hover:text-white",
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6"
                                    )}
                                  >
                                    <item.icon
                                      className={clsx(
                                        item.current
                                          ? "text-white"
                                          : "text-indigo-200 group-hover:text-white",
                                        item.icon === WhatsAppIcon &&
                                          "me-1 h-[1.3rem] w-[1.3rem] fill-indigo-200",

                                        "h-6 w-6 shrink-0"
                                      )}
                                      aria-hidden="true"
                                    />
                                    {item.name}
                                  </a>
                                </li>
                              )}
                            </For>
                          </ul>
                        </li>

                        <li className="mt-auto">
                          <Link
                            href="/painel/configuracoes"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                          >
                            <Cog6ToothIcon
                              className="h-6 w-6 shrink-0 text-indigo-200 group-hover:text-white"
                              aria-hidden="true"
                            />
                            Configurações
                          </Link>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>
        <div className="hidden lg:flex lg:h-screen lg:w-64 lg:flex-col">
          <div
            className={clsx(
              "bg-zinc-700",
              `fixed flex h-full w-64  grow flex-col gap-y-1 overflow-y-hidden px-6 pb-4`
            )}
          >
            <div className="my-2 flex h-16 shrink-0 items-center">
              <Logo url={organization.options?.logo} />
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
