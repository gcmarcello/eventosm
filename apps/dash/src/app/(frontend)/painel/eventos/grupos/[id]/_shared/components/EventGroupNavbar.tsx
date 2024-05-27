import { TabNavigation } from "@/app/(frontend)/painel/_shared/components/TabNavigation";
import { EventGroup, Organization } from "@prisma/client";
import { useMemo } from "react";

export function EventGroupNavbar({
  organization,
  eventGroup,
}: {
  organization: Organization;
  eventGroup: EventGroup;
}) {
  const tabs = useMemo(
    () => [
      {
        name: "geral",
        title: "Geral",
        disabled: false,
        href: `/painel/eventos/grupos/${eventGroup.id}/geral`,
      },
      {
        name: "etapas",
        title: "Etapas",
        disabled: false,
        href: `/painel/eventos/grupos/${eventGroup.id}/etapas`,
      },
      {
        name: "modalidades",
        title: "Modalidades",
        disabled: false,
        href: `/painel/eventos/grupos/${eventGroup.id}/modalidades`,
      },
      {
        name: "kits",
        title: "Kits",
        disabled: false,
        href: `/painel/eventos/grupos/${eventGroup.id}/kits`,
      },
      {
        name: "lotes",
        title: "Lotes",
        disabled: false,
        href: `/painel/eventos/grupos/${eventGroup.id}/lotes`,
      },
      {
        name: "inscritos",
        title: "Inscritos",
        disabled: false,
        href: `/painel/eventos/grupos/${eventGroup.id}/inscritos`,
      },
    ],
    []
  );

  return (
    <>
      <TabNavigation
        tabs={tabs}
        organization={organization}
        title={eventGroup.name}
      />
    </>
  );
}
