"use client";
import clsx from "clsx";
import { Form, Select, useForm } from "odinkit/client";
import { useMemo } from "react";
import { z } from "zod";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { For } from "odinkit";
import { Organization } from "@prisma/client";

export type Tab = {
  name: string;
  icon?: JSX.Element;
  content?: React.ReactNode;
  disabled?: boolean;
};

interface IndexedTab extends Tab {
  id: string;
}

export default function TabNavigation({
  tabs,
  organization,
}: {
  tabs: Tab[];
  organization: Organization;
}) {
  const form = useForm({
    schema: z.object({
      currentTab: z.string(),
    }),
    defaultValues: {
      currentTab: "0",
    },
  });

  const Field = useMemo(() => form.createField(), [form]);
  const indexedTabs: IndexedTab[] = useMemo(
    () => tabs.map((tab, index) => ({ ...tab, id: String(index) })),
    []
  );

  return (
    <div>
      <div>
        <div>
          <TabGroup
            selectedIndex={Number(form.watch("currentTab"))}
            onChange={(value): void =>
              form.setValue("currentTab", String(value))
            }
          >
            <Form hform={form}>
              <div className="sm:hidden">
                <label htmlFor="tabs" className="sr-only">
                  Selecione uma aba
                </label>
                {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
                <Field name="currentTab">
                  <Select data={indexedTabs} displayValueKey="name" />
                </Field>
              </div>
              <TabList className="hidden sm:block">
                <For each={indexedTabs}>
                  {(tab) => (
                    <Tab
                      disabled={tab.disabled}
                      style={{
                        cursor: tab.disabled ? "not-allowed" : "pointer",
                        backgroundColor: tab.disabled
                          ? "#f9fafb"
                          : "transparent",
                        color:
                          tab.id === form.watch("currentTab")
                            ? organization.options.colors.primaryColor.hex
                            : undefined,
                        borderColor:
                          tab.id === form.watch("currentTab")
                            ? organization.options.colors.primaryColor.hex
                            : undefined,
                      }}
                      className={clsx(
                        tab.id === form.watch("currentTab")
                          ? "border-indigo-500 text-indigo-600"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                        "whitespace-nowrap border-b-2 px-3 py-4 text-sm font-medium"
                      )}
                    >
                      {tab.name}
                    </Tab>
                  )}
                </For>
              </TabList>
            </Form>
            <TabPanels>
              <For each={indexedTabs}>
                {(tab) => <TabPanel>{tab.content}</TabPanel>}
              </For>
            </TabPanels>
          </TabGroup>
        </div>
      </div>
    </div>
  );
}
