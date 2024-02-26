"use client";
import { UserCircleIcon, UsersIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Organization } from "@prisma/client";
import { For, formatPhone } from "odinkit";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import Image from "next/image";
import { useMemo, useState } from "react";
import { FieldGroup, Form, Input, useForm } from "odinkit/client";
import { updateUserDto } from "@/app/api/users/dto";

const navigation = [
  { name: "Home", href: "#" },
  { name: "Invoices", href: "#" },
  { name: "Clients", href: "#" },
  { name: "Expenses", href: "#" },
];
const secondaryNavigation = [
  { name: "Geral", href: "#", icon: UserCircleIcon, current: true },
  { name: "Times", href: "#", icon: UsersIcon, current: false },
];

export default function ProfileContainer({
  connectedOrgs,
  userSession,
  orgSlug,
}: {
  connectedOrgs: Organization[];
  userSession: UserSession;
  orgSlug: string;
}) {
  const [organization, setOrganization] = useState(
    connectedOrgs.find((org) => org.slug === orgSlug)
  );
  const fields = useMemo(() => {
    [
      { field: "fullName", display: "Nome Completo" },
      { field: "email", display: "Email" },
      { field: "phone", display: "Telefone" },
      { field: "document", display: "Documento" },
    ];
  }, []);

  const form = useForm({
    schema: updateUserDto,
    mode: "onChange",
    defaultValues: {
      fullName: userSession.fullName,
      email: userSession.email,
      phone: userSession.phone || "",
    },
  });

  const Field = useMemo(() => form.createField(), []);

  return (
    <>
      <div className="mx-auto max-w-7xl  lg:flex lg:gap-x-8 lg:px-8">
        <h1 className="sr-only">General Settings</h1>

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
          <div className="mx-auto max-w-2xl space-y-16 sm:space-y-20 lg:mx-0 lg:max-w-none">
            <Form hform={form}>
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Meu Perfil
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Essas informações são compartilhadas entre todas as
                  organizações que você está conectado.
                </p>

                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Nome Completo
                    </dt>
                    <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">
                        {editField.fullName ? (
                          <Field name={"fullName"}>
                            <Input />
                          </Field>
                        ) : (
                          form.getValues("fullName")
                        )}
                      </div>
                      <button
                        type="button"
                        className="font-semibold"
                        style={{
                          color: organization?.options.colors.primaryColor.hex,
                        }}
                      >
                        Atualizar
                      </button>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Email
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">{userSession.email}</div>
                      <button type="button" className="font-semibold">
                        Atualizar
                      </button>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Telefone
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">
                        {formatPhone(userSession.phone!)}
                      </div>
                      <button type="button" className="font-semibold ">
                        Atualizar
                      </button>
                    </dd>
                  </div>
                  <div className="pt-6 sm:flex">
                    <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                      Documento
                    </dt>
                    <dd className="mt-1 flex justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                      <div className="text-gray-900">
                        {userSession.document}
                      </div>
                      <button type="button" className="font-semibold">
                        Atualizar
                      </button>
                    </dd>
                  </div>
                </dl>
              </div>
            </Form>

            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Organizações Conectadas
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-500">
                Gerencie as organizações que você está conectado e tem acesso
                aos seus dados.
              </p>

              <ul
                role="list"
                className="mt-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6"
              >
                <For each={connectedOrgs}>
                  {(org: Organization) => (
                    <li className="flex justify-between gap-x-6 py-6">
                      <Image
                        alt="logo"
                        height={64}
                        width={64}
                        src={org.options.images?.logo ?? ""}
                      />
                      <div className="font-medium text-gray-900">
                        {org.name}
                      </div>
                      <button
                        type="button"
                        className="font-semibold text-red-600 hover:text-red-500"
                      >
                        Remover
                      </button>
                    </li>
                  )}
                </For>
              </ul>

              {/* <div className="flex border-t border-gray-100 pt-6">
                <button
                  type="button"
                  className="text-sm font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
                >
                  <span aria-hidden="true">+</span> Add another application
                </button>
              </div> */}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
