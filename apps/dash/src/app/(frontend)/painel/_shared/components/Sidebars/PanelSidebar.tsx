"use client";
import { Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  Cog6ToothIcon,
  HomeIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { useSidebar } from "./lib/useSidebar";
import Link from "next/link";
import {
  CalendarDaysIcon,
  DocumentIcon,
  NewspaperIcon,
  PhotoIcon,
} from "@heroicons/react/24/solid";
import { chooseTextColor } from "@/utils/colors";
import { For, Logo } from "odinkit";
import { usePanel } from "../PanelStore";
import { isDev, isProd } from "@/app/api/env";
import WhatsappIcon from "node_modules/odinkit/src/icons/WhatsappIcon";

export default function PanelSideBar() {
  const { organization, visibility, setVisibility } = useSidebar();
  const pathname = usePathname();

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
    /* {
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
    }, */
  ];

  return (
    <>
      <div className="absolute w-64 overflow-clip shadow-lg">
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
              <div className="fixed inset-0 bg-zinc-900/80" />
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
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div
                    style={{
                      backgroundColor:
                        organization.options?.colors.primaryColor.hex || "#FFF",
                    }}
                    className={clsx(
                      "fixed flex h-full w-64 grow flex-col gap-y-5 overflow-y-auto px-6 py-4 pb-4"
                    )}
                  >
                    <div className="relative my-2 flex min-h-20 w-full shrink-0 items-center">
                      <Logo
                        className="rounded-lg"
                        url={organization.options?.images?.logo || ""}
                      />
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
                                    style={{
                                      color: chooseTextColor(
                                        organization.options?.colors
                                          .primaryColor.hex || "#FFF"
                                      ),
                                    }}
                                    className={clsx(
                                      item.current
                                        ? `bg-zinc-600 bg-opacity-25`
                                        : ` hover:bg-zinc-800 hover:bg-opacity-25 `,
                                      "group flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 group-hover:text-white "
                                    )}
                                  >
                                    <item.icon
                                      className={clsx(
                                        item.current
                                          ? ``
                                          : ` group-hover:text-white`,
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

                        <li
                          className="group mt-auto"
                          style={{
                            color: chooseTextColor(
                              organization.options?.colors.primaryColor.hex
                            ),
                          }}
                        >
                          <Link
                            href="/painel/configuracoes"
                            className={clsx(
                              "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",

                              ` hover:bg-zinc-800 hover:bg-opacity-25  group-hover:text-white`
                            )}
                          >
                            <Cog6ToothIcon
                              className={clsx(
                                "h-6 w-6 shrink-0",
                                ` hover:bg-zinc-800 hover:bg-opacity-25  group-hover:text-white`
                              )}
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
              `fixed flex h-full w-64  grow flex-col gap-y-1 overflow-y-hidden px-6 py-4 pb-4`
            )}
            style={{
              backgroundColor:
                organization.options?.colors.primaryColor.hex || "#FFF",
            }}
          >
            <div className="relative my-2 min-h-20 w-auto shrink-0 items-center">
              <Logo
                className="rounded-lg"
                url={organization.options?.images?.logo}
              />
            </div>

            <nav className="mt-2 flex flex-1 flex-col">
              <ul
                role="list"
                className="flex flex-1 flex-col gap-y-3 xl:gap-y-7"
              >
                <li>
                  <ul role="list" className="-mx-2 space-y-1.5">
                    {navigation.map((item) => (
                      <li className="group" key={item.name}>
                        <a
                          href={item.href}
                          style={{
                            color: chooseTextColor(
                              organization.options?.colors.primaryColor.hex ||
                                "#FFF"
                            ),
                          }}
                          className={clsx(
                            item.current
                              ? `bg-zinc-600 bg-opacity-25 `
                              : ` hover:bg-zinc-800 hover:bg-opacity-25`,
                            "leading-6, group flex gap-x-3 rounded-md p-2 text-sm font-semibold"
                          )}
                        >
                          <item.icon
                            className={clsx(
                              item.current ? `` : ` `,
                              item.icon === WhatsappIcon &&
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

                <li className="group mt-auto">
                  <Link
                    style={{
                      color: chooseTextColor(
                        organization.options?.colors.primaryColor.hex || "#FFF"
                      ),
                    }}
                    href="/painel/configuracoes"
                    className={clsx(
                      "group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6",

                      ` hover:bg-zinc-800 hover:bg-opacity-25 group-hover:text-white`
                    )}
                  >
                    <Cog6ToothIcon
                      className={clsx(
                        "h-6 w-6 shrink-0",
                        ` hover:bg-zinc-800 hover:bg-opacity-25  group-hover:text-white`
                      )}
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
