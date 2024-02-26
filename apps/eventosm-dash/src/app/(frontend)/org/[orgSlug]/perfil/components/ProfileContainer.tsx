"use client";
import { UserCircleIcon, UsersIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { Organization } from "@prisma/client";
import { Badge, For, formatCPF, formatPhone } from "odinkit";
import { UserSession } from "@/middleware/functions/userSession.middleware";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  ErrorMessage,
  FieldGroup,
  Form,
  Input,
  showToast,
  useAction,
  useForm,
} from "odinkit/client";
import { updateUserDto } from "@/app/api/users/dto";
import { get } from "lodash";
import { updateUser } from "@/app/api/users/action";

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

  const form = useForm({
    schema: updateUserDto,
    mode: "onChange",
    defaultValues: {
      fullName: userSession.fullName,
      email: userSession.email,
      phone: formatPhone(userSession.phone || ""),
      document: formatCPF(userSession.document),
    },
  });

  const [fields, setFields] = useState<
    {
      name: any;
      display: string;
      edit: boolean;
    }[]
  >([
    { name: "fullName", display: "Nome Completo", edit: false },
    { name: "email", display: "Email", edit: false },
    {
      name: "phone",
      display: "Telefone",
      edit: false,
    },
    { name: "document", display: "Documento", edit: false },
  ]);

  function handleEdit(field?: string) {
    if (!field)
      return setFields(
        fields.map((f) => {
          return { ...f, edit: false };
        })
      );

    setFields(
      fields.map((f) => {
        if (f.name === field) {
          return { ...f, edit: !f.edit };
        }
        return f;
      })
    );
  }

  function handleMask(field: string) {
    switch (field) {
      case "phone":
        return form.watch("phone").length < 14
          ? "(99) 9999-99999"
          : "(99) 99999-9999";

      case "document":
        return "999.999.999-99";

      default:
        return "";
    }
  }

  const { data, trigger } = useAction({
    action: updateUser,
    onSuccess: (data) => {
      handleEdit();
      showToast({
        message: "Dados atualizados com sucesso.",
        variant: "success",
        title: "Sucesso",
      });
    },
    onError: (error) =>
      showToast({
        message: error,
        variant: "error",
        title: "Erro!",
      }),
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
            <Form hform={form} onSubmit={(data) => trigger(data)}>
              <div>
                <h2 className="text-base font-semibold leading-7 text-gray-900">
                  Meu Perfil
                </h2>
                <p className="mt-1 text-sm leading-6 text-gray-500">
                  Essas informações são compartilhadas entre todas as
                  organizações que você está conectado.
                </p>

                <dl className="mt-6 space-y-6 divide-y divide-gray-100 border-t border-gray-200 text-sm leading-6">
                  <For each={fields}>
                    {(field) => (
                      <div className="items-center pt-6 sm:flex">
                        <dt className="font-medium text-gray-900 sm:w-64 sm:flex-none sm:pr-6">
                          {field.display}
                        </dt>
                        <dd className="mt-1 flex items-center justify-between gap-x-6 sm:mt-0 sm:flex-auto">
                          {field.edit ? (
                            <>
                              <Field name={field.name}>
                                <Input mask={handleMask(field.name)} />
                                <ErrorMessage />
                              </Field>
                              <div className="flex items-center gap-2">
                                <button
                                  type="button"
                                  className="rounded-md p-2 font-semibold hover:bg-gray-50"
                                  onClick={() => handleEdit(field.name)}
                                  style={{
                                    color:
                                      organization?.options.colors
                                        .secondaryColor.hex,
                                  }}
                                >
                                  Cancelar
                                </button>
                                <button
                                  type="button"
                                  className="rounded-md p-2 font-semibold hover:bg-gray-50"
                                  onClick={() => {
                                    trigger(form.getValues());
                                  }}
                                  style={{
                                    color:
                                      organization?.options.colors.primaryColor
                                        .hex,
                                  }}
                                >
                                  Salvar
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <div>{form.getValues(field.name)}</div>
                              <button
                                type="button"
                                className="font-semibold"
                                onClick={() => handleEdit(field.name)}
                                style={{
                                  color:
                                    organization?.options.colors.primaryColor
                                      .hex,
                                }}
                              >
                                Atualizar
                              </button>
                            </>
                          )}
                        </dd>
                      </div>
                    )}
                  </For>
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
                      {org.slug === orgSlug ? (
                        <Badge>Atual</Badge>
                      ) : (
                        <button
                          type="button"
                          className="font-semibold text-red-600 hover:text-red-500"
                        >
                          Remover
                        </button>
                      )}
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
