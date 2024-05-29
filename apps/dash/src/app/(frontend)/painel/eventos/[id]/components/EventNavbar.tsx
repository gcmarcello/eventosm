"use client";
import { Event, Organization } from "@prisma/client";
import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import { For } from "odinkit";
import { Form, Label, Select, useForm } from "odinkit/client";
import { tabControl } from "../../../_shared/types/formTab";
import { useMemo } from "react";
import { TabNavigation } from "../../../_shared/components/TabNavigation";

export function EventNavbar({
  organization,
  event,
}: {
  organization: Organization;
  event: Event;
}) {
  const tabs = useMemo(
    () => [
      {
        name: "geral",
        title: "Geral",
        disabled: false,
        href: `/painel/eventos/${event.id}/geral`,
      },
      {
        name: "modalidades",
        title: "Modalidades",
        disabled: false,
        href: `/painel/eventos/${event.id}/modalidades`,
      },
      {
        name: "kits",
        title: "Kits",
        disabled: false,
        href: `/painel/eventos/${event.id}/kits`,
      },
      {
        name: "lotes",
        title: "Lotes",
        disabled: false,
        href: `/painel/eventos/${event.id}/lotes`,
      },
      {
        name: "inscritos",
        title: "Inscritos",
        disabled: false,
        href: `/painel/eventos/${event.id}/inscritos`,
      },
    ],
    []
  );

  return (
    <>
      <TabNavigation
        tabs={tabs}
        organization={organization}
        title={event.name}
      />
    </>
  );
}
