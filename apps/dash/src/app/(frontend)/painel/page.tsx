"use client";
import { Avatar, Divider, For, Heading, Strong, Text, TextLink } from "odinkit";
import { DashboardLayout } from "./_shared/components/DashboardLayout";
import { useContext } from "react";
import { PanelContext } from "./context/Panel.ctx";
import { Button as HeadlessButton } from "@headlessui/react";
import { updateActiveOrganization } from "@/app/api/auth/action";
import useSWRMutation from "swr/mutation";
import { useAction } from "odinkit/client";

export default function PanelPage() {
  const { organizations, activeOrg } = useContext(PanelContext);

  const { trigger } = useAction({ action: updateActiveOrganization });

  return (
    <DashboardLayout grow={!!activeOrg}>
      <Heading>
        {activeOrg ? "Painel da Organização" : "Escolha a Organização"}
      </Heading>
      {!activeOrg && (
        <Text>
          Para acessar o painel, você precisa ter uma organização ativa.
        </Text>
      )}
      <Divider className="my-6" />
      {!activeOrg && (
        <div className="mt-4 space-y-4">
          <For each={organizations}>
            {(org) => (
              <div className="flex items-center gap-3">
                <Avatar
                  className="size-16 bg-zinc-900 text-white dark:bg-white dark:text-black"
                  src={org.options?.images?.logo}
                  initials={org.name
                    .split(" ")
                    .splice(0, 2)
                    .map((n) => n[0]?.toUpperCase())
                    .join("")}
                />
                <div>
                  <HeadlessButton onClick={() => trigger(org.id)}>
                    <Strong className="max-w-72 text-center hover:underline lg:max-w-full">
                      {org.name}
                    </Strong>
                  </HeadlessButton>
                  {org.options?.abbreviation && (
                    <Text className="hidden lg:block">
                      {org.options?.abbreviation}
                    </Text>
                  )}
                </div>
              </div>
            )}
          </For>
        </div>
      )}
    </DashboardLayout>
  );
}
