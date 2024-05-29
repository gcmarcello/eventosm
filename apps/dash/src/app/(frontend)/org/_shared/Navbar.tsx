"use client";
import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { For } from "odinkit";
import { Logo } from "odinkit";
import { chooseTextColor } from "@/utils/colors";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import Image from "next/image";
import { UserCircleIcon } from "@heroicons/react/24/outline";

import { logout } from "@/app/api/auth/action";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Organization } from "@prisma/client";
import { Button } from "odinkit/client";

const navigation = [
  { name: "Home", href: "/", current: true },
  { name: "Eventos", href: "/eventos", current: false },
  { name: "Notícias", href: "/noticias", current: false },
  {
    name: "Institucional",
    href: "/institucional",
    current: false,
  },
  /*   { name: "Transparência", href: "/transparencia", current: false },
  { name: "Contato", href: "/contato", current: false }, */
];

export function CompanyNavbar({
  user,
  organization,
}: {
  organization: Organization;
  user?: UserSession | null;
}) {
  const pathName = usePathname();

  const userNavigation = [
    { name: "Meu Perfil", href: "/perfil" },
    { name: "Minhas Inscrições", href: "/perfil" },
    { name: "Configurações", href: "/perfil/configurações" },
    { name: "Sair", onClick: () => logout(pathName) },
  ];
  if (user?.role === "admin")
    userNavigation.splice(3, 0, {
      name: "Administrativo",
      href: process.env.NEXT_PUBLIC_SITE_URL + "/painel",
    });

  const colors = organization.options.colors;

  return (
    <>
      <div className="sticky top-0 z-10 min-h-full w-full ring-1 ring-gray-700/25">
        <Disclosure
          as="nav"
          style={{ backgroundColor: colors.primaryColor.hex || "" }}
          className={clsx(`py-1 shadow-md`)}
        >
          {({ open }) => (
            <>
              <div className="mx-auto max-h-24 max-w-7xl px-4 sm:px-6 lg:p-0 lg:px-8">
                <div className="flex h-20 justify-between ">
                  <div className="flex">
                    <Link href={"/"} className="flex items-center">
                      <div className="relative min-h-20 w-48 ">
                        <Logo url={organization.options?.images?.logo} />
                      </div>
                    </Link>
                    <div className="hidden sm:-my-px sm:ml-6 sm:space-x-4 md:flex">
                      <For each={navigation} key="navigation">
                        {(item) => {
                          if (
                            item.name === "Institucional" &&
                            !organization.options.pages?.documents
                          )
                            return <></>;
                          return (
                            <a
                              key={item.name}
                              href={item.href}
                              style={{
                                color: chooseTextColor(
                                  organization?.options?.colors.primaryColor.hex
                                ),
                              }}
                              className={clsx(
                                "my-4 text-lg font-semibold ",
                                "inline-flex items-center px-2 font-medium ",
                                "hover:rounded-md hover:bg-zinc-600 hover:bg-opacity-10"
                              )}
                              aria-current={item.current ? "page" : undefined}
                            >
                              {item.name}
                            </a>
                          );
                        }}
                      </For>
                    </div>
                  </div>

                  {/* Profile Dropdown */}
                  {user ? (
                    <div className="hidden sm:ml-6 sm:items-center md:flex">
                      {/* <button
                        type="button"
                        className={clsx(
                          "relative rounded-full p-1  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
                          `bg-${colors?.primary}`,
                          `text-${chooseTextColor(colors?.primary || "white")}`,
                          "hover:rounded-md hover:bg-zinc-600 hover:bg-opacity-10"
                        )}
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon
                          className={clsx("h-6 w-6")}
                          aria-hidden="true"
                        />
                      </button> */}

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div
                          className="p-2 hover:rounded-md hover:bg-zinc-600 hover:bg-opacity-10"
                          style={{
                            color: chooseTextColor(
                              organization?.options?.colors.primaryColor.hex
                            ),
                          }}
                        >
                          <Menu.Button className="relative flex rounded-full text-sm">
                            <span className="absolute -inset-1.5" />
                            <span className="sr-only">Open user menu</span>
                            {(user as any).imageUrl ? (
                              <Image
                                className="rounded-full"
                                width={32}
                                height={32}
                                src={(user as any).imageUrl}
                                alt="Foto de Usuario"
                              />
                            ) : (
                              <div className="flex items-center gap-2">
                                <UserCircleIcon
                                  className={clsx(
                                    "h-8 w-8",
                                    "hover:rounded-md hover:bg-zinc-600 hover:bg-opacity-10",
                                    "focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  )}
                                  aria-hidden="true"
                                />
                                <span className={clsx("font-semibold")}>
                                  {user.fullName.split(" ")[0]}
                                </span>
                              </div>
                            )}
                          </Menu.Button>
                        </div>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-200"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items
                            anchor={{ to: "top end" }}
                            className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                          >
                            {userNavigation.map((item) => (
                              <div key={item.name}>
                                {item.name === "Sair" && (
                                  <Menu.Separator className="my-2 border-t border-gray-200" />
                                )}
                                <Menu.Item>
                                  {({ active }) => (
                                    <>
                                      <a
                                        onClick={item.onClick}
                                        href={item.href}
                                        className={clsx(
                                          active ? "bg-gray-100" : "",
                                          "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                                          item.name === "Sair" &&
                                            "cursor-pointer font-medium text-red-500"
                                        )}
                                      >
                                        {item.name}
                                      </a>
                                    </>
                                  )}
                                </Menu.Item>
                              </div>
                            ))}
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    </div>
                  ) : (
                    <div className="hidden gap-2 md:flex ">
                      <Button
                        className="my-auto"
                        color={colors?.secondaryColor.tw.color}
                        href="/login"
                      >
                        Entrar
                      </Button>
                      <Button
                        className="my-auto"
                        color={colors?.tertiaryColor.tw.color}
                        href={`/cadastro`}
                      >
                        Cadastrar
                      </Button>
                    </div>
                  )}

                  {/* Hamburguer */}
                  <div className="-mr-2 flex items-center md:hidden">
                    <Disclosure.Button
                      className={clsx(
                        "relative inline-flex items-center justify-center rounded-md  p-2  hover:bg-zinc-600 hover:bg-opacity-10  focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      )}
                    >
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              {/* Mobile menu */}
              <Disclosure.Panel className="bg-white text-gray-800 md:hidden">
                {({ close }) => (
                  <>
                    <div className="space-y-1 pb-3 pt-2">
                      <For each={navigation}>
                        {(item) => (
                          <Disclosure.Button
                            key={item.name}
                            as="a"
                            href={item.href}
                            style={{ borderColor: colors?.primaryColor.hex }}
                            className={clsx(
                              "block border-l-4 py-2 pl-3  pr-4 text-base font-medium hover:bg-gray-100 hover:text-gray-800"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Disclosure.Button>
                        )}
                      </For>
                    </div>
                    {user ? (
                      <div className="border-t border-gray-200 pb-3 pt-4">
                        <div
                          style={{ borderColor: colors?.primaryColor.hex }}
                          className="flex items-center border-l-8 px-4"
                        >
                          <div className="flex-shrink-0">
                            {/* <img
                        className="h-10 w-10 rounded-full"
                        src={user.imageUrl}
                        alt=""
                      /> */}
                          </div>
                          <UserCircleIcon className="size-8" />
                          <div className="ml-3">
                            <div
                              className={clsx(
                                "text-base font-medium text-gray-800"
                              )}
                            >
                              {user.fullName.split(" ")[0]}
                            </div>
                            <div
                              className={clsx(
                                "text-sm font-medium text-gray-500"
                              )}
                            >
                              {user.email}
                            </div>
                          </div>
                          {/* <button
                        type="button"
                        className="relative ml-auto flex-shrink-0 rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        <span className="absolute -inset-1.5" />
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button> */}
                        </div>
                        <div className="mt-3 space-y-1">
                          {userNavigation.map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as="a"
                              href={item.href || undefined}
                              style={{ borderColor: colors?.primaryColor.hex }}
                              onClick={item.onClick}
                              className={clsx(
                                "block px-4 py-2 text-base font-medium  hover:bg-gray-100 hover:text-gray-800"
                              )}
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3 p-3 pt-1">
                        <Button
                          className="my-auto"
                          color={colors?.secondaryColor.tw.color}
                          href="/login"
                          onClick={() => close()}
                        >
                          Entrar
                        </Button>
                        <Button
                          className="my-auto"
                          color={colors?.tertiaryColor.tw.color}
                          href="/cadastro"
                          onClick={() => close()}
                        >
                          Cadastrar
                        </Button>
                      </div>
                    )}
                  </>
                )}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      </div>
    </>
  );
}
