"use client";
import { Event, Organization } from "@prisma/client";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { For, Link } from "odinkit";
import { Form, Label, Select, useForm } from "odinkit/client";
import { useMemo } from "react";
import { tabControl } from "../types/formTab";

type Tab = {
  name: string;
  title: string;
  disabled?: boolean;
  href: string;
};

export function TabNavigation({
  tabs,
  organization,
  title,
}: {
  tabs: Tab[];
  organization: Organization;
  title?: string;
}) {
  const pathname = usePathname().split("/");
  const router = useRouter();
  const color = organization.options.colors.primaryColor.hex;
  const form = useForm({
    schema: tabControl,
    defaultValues: { currentTab: "geral" },
  });
  const Field = useMemo(() => form.createField(), []);
  return (
    <>
      <div className="hidden w-full lg:flex">
        <For each={tabs}>
          {(tab, index) => {
            const selected = pathname.includes(tab.name ?? "");
            return (
              <Link
                href={tab.href}
                style={{
                  borderColor: selected ? color : "gray",
                  color: selected ? color : "gray",
                }}
                className={clsx(
                  "grow cursor-pointer border-t-4 px-3 py-4 text-sm font-medium duration-200 *:ring-0 hover:bg-zinc-50 focus:ring-0",
                  tab.disabled && "cursor-not-allowed opacity-50",
                  index === 0
                    ? "me-2 ms-1 lg:ms-0"
                    : index === tabs.length - 1
                      ? "me-1 ms-2 lg:me-0"
                      : "mx-2"
                )}
              >
                <div className="flex flex-col items-start">
                  <div className="whitespace-nowrap text-nowrap">
                    Passo {index + 1}
                  </div>
                  <div className="whitespace-nowrap text-nowrap text-sm font-medium text-black">
                    {tab.title}
                  </div>
                </div>
              </Link>
            );
          }}
        </For>
      </div>
      <div className="mb-2 grow border-b pb-2 lg:hidden">
        <Form hform={form}>
          <Field enableAsterisk={false} name="currentTab">
            <Label>Menu - {title}</Label>
            <Select
              data={tabs.map((tab) => ({ id: tab.name, name: tab.title }))}
              displayValueKey="name"
              onChange={(e) => {
                if (e && "target" in e) {
                  return router.push(
                    tabs.find((tab) => tab.name === e.target.value)?.href ?? ""
                  );
                }
              }}
            />
          </Field>
        </Form>
      </div>
    </>
  );
}
