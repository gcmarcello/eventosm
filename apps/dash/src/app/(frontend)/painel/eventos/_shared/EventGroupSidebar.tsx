"use client";

import {
  ChevronDownIcon,
  HomeIcon,
  TicketIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ClipboardDocumentIcon,
  AdjustmentsHorizontalIcon,
  BanknotesIcon,
  CurrencyDollarIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarItem,
  Avatar,
  SidebarLabel,
  SidebarSection,
  SidebarBody,
  SidebarHeading,
  SidebarSpacer,
  SidebarFooter,
  For,
  SidebarDivider,
  MobileSidebar,
  NavbarItem,
  NavbarLabel,
  Alertbox,
  Text,
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "odinkit/client";
import { EventGroupWithEvents, EventGroupWithInfo } from "prisma/types/Events";
import { useEffect, useMemo, useRef, useState } from "react";
import EventGroupPublishingDropdown from "../grupos/[id]/_shared/components/EventGroupPublishingDropdown";
import XIcon from "node_modules/odinkit/src/icons/TwitterIcon";
import { EventGroupPublishingChecklist } from "../grupos/[id]/_shared/components/EventGroupPublishingChecklist";

export function EventGroupSidebar({
  eventGroup,
}: {
  eventGroup: EventGroupWithInfo;
}) {
  const pathname = usePathname();
  const currentPage = useMemo(() => pathname.split("/").pop(), [pathname]);
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebar = useMemo(
    () => (
      <Sidebar>
        <SidebarHeader>
          <SidebarSection className="max-lg:hidden">
            <SidebarItem>
              <div className="max-w-[250px]">{eventGroup.name}</div>
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarHeading>Configurações Gerais</SidebarHeading>
            <SidebarItem
              current={currentPage === "geral"}
              href={`/painel/eventos/grupos/${eventGroup.id}/geral`}
            >
              <HomeIcon />
              <SidebarLabel>Informações do Evento</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "pagamento"}
              href={`/painel/eventos/grupos/${eventGroup.id}/pagamento`}
            >
              <CurrencyDollarIcon />
              <SidebarLabel>Pagamento</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "etapas"}
              href={`/painel/eventos/etapas/${eventGroup.id}`}
            >
              <CalendarDaysIcon />
              <SidebarLabel>Etapas</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
          <SidebarSection>
            <SidebarHeading>Realização</SidebarHeading>
            <SidebarItem
              current={currentPage === "modalidades"}
              href={`/painel/eventos/grupos/${eventGroup.id}/modalidades`}
            >
              <UserGroupIcon />
              <SidebarLabel>Modalidades e Categorias</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "kits"}
              href={`/painel/eventos/grupos/${eventGroup.id}/kits`}
            >
              <ShoppingBagIcon />
              <SidebarLabel>Kits</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "lotes"}
              href={`/painel/eventos/grupos/${eventGroup.id}/lotes`}
            >
              <TicketIcon />
              <SidebarLabel>Lotes de Inscrição</SidebarLabel>
            </SidebarItem>
            <SidebarItem
              current={currentPage === "inscritos"}
              href={`/painel/eventos/grupos/${eventGroup.id}/inscritos`}
            >
              <ClipboardDocumentIcon />
              <SidebarLabel>Inscrições</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarBody>
        <SidebarFooter>
          <SidebarSection>
            <SidebarHeading>Status do Campeonato</SidebarHeading>
            <EventGroupPublishingDropdown eventGroup={eventGroup} />
            <EventGroupPublishingChecklist eventGroup={eventGroup} />
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    ),
    [pathname, eventGroup]
  );

  return (
    <>
      <div className="sticky top-0 z-10 lg:hidden">
        <header className="flex items-center justify-end bg-zinc-200 px-4 py-2.5 lg:hidden dark:bg-zinc-500">
          <NavbarItem
            onClick={() => setShowSidebar(true)}
            aria-label="Open navigation"
          >
            <div className="flex w-full items-center gap-2">
              <NavbarLabel>Configurações do Evento</NavbarLabel>
              <span className="">
                <AdjustmentsHorizontalIcon className="size-5 text-zinc-500 dark:text-white" />
              </span>
            </div>
          </NavbarItem>
        </header>
      </div>
      <div className="sticky top-0 hidden lg:block">{sidebar}</div>{" "}
      <MobileSidebar
        open={showSidebar}
        close={() => setShowSidebar(false)}
        direction="right"
      >
        {sidebar}
      </MobileSidebar>
    </>
  );
}
