"use client";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import {
  ChevronDownIcon,
  Cog8ToothIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  InboxIcon,
  HomeIcon,
  Square2StackIcon,
  TicketIcon,
  Cog6ToothIcon,
  MegaphoneIcon,
  QuestionMarkCircleIcon,
  SparklesIcon,
  ChevronUpIcon,
  UserIcon,
  ShieldCheckIcon,
  LightBulbIcon,
  ArrowRightStartOnRectangleIcon,
  CalendarDaysIcon,
  UserGroupIcon,
  ShoppingBagIcon,
  ClipboardDocumentIcon,
} from "@heroicons/react/20/solid";
import { AnimatePresence, easeOut, motion } from "framer-motion";
import { useParams, usePathname } from "next/navigation";
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
} from "odinkit";
import {
  Dropdown,
  DropdownButton,
  DropdownMenu,
  DropdownItem,
  DropdownLabel,
  DropdownDivider,
} from "odinkit/client";
import { EventGroupWithEvents, EventWithInfo } from "prisma/types/Events";
import { useEffect, useMemo, useRef, useState } from "react";

export function SubeventSidebar({
  eventGroup,
}: {
  eventGroup: EventGroupWithEvents;
}) {
  const params = useParams();
  const pathname = usePathname();
  const currentPage = useMemo(() => pathname.split("/").pop(), [pathname]);
  return (
    <div className="sticky top-0 hidden lg:block">
      <Sidebar>
        <SidebarHeader>
          <SidebarSection className="max-lg:hidden">
            <SidebarItem>
              <SidebarLabel>{eventGroup.name}</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarHeader>
        <SidebarBody>
          <SidebarSection>
            <SidebarItem
              current={currentPage === "geral"}
              href={`/painel/eventos/grupos/${eventGroup.id}/geral`}
            >
              <HomeIcon />
              <SidebarLabel>Voltar ao Campeonato</SidebarLabel>
            </SidebarItem>
            <SidebarDivider />
            <SidebarHeading>Etapas</SidebarHeading>

            <For each={eventGroup.Event}>
              {(event) => (
                <>
                  <SidebarItem
                    key={event.id}
                    current={params.eventId === event.id}
                    href={`/painel/eventos/etapas/${eventGroup.id}/${event.id}/editar`}
                  >
                    <SidebarLabel>{event.name}</SidebarLabel>
                  </SidebarItem>
                  {params.eventId === event.id && (
                    <>
                      <SidebarItem
                        key={event.id}
                        className="ms-2"
                        href={`/painel/eventos/etapas/${eventGroup.id}/${event.id}/checkins`}
                      >
                        <SidebarLabel>Check-ins</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem
                        key={event.id}
                        className="ms-2"
                        href={`/painel/eventos/etapas/${eventGroup.id}/${event.id}/faltas`}
                      >
                        <SidebarLabel>Faltas</SidebarLabel>
                      </SidebarItem>
                      <SidebarItem
                        key={event.id}
                        className="ms-2"
                        href={`/painel/eventos/etapas/${eventGroup.id}/${event.id}/resultados`}
                      >
                        <SidebarLabel>Resultados</SidebarLabel>
                      </SidebarItem>
                    </>
                  )}
                </>
              )}
            </For>
          </SidebarSection>

          <SidebarSpacer />
        </SidebarBody>
        <SidebarFooter className="max-lg:hidden">
          <SidebarSection>
            <SidebarItem href="/support">
              <QuestionMarkCircleIcon />
              <SidebarLabel>Suporte</SidebarLabel>
            </SidebarItem>
            <SidebarItem href="/changelog">
              <SparklesIcon />
              <SidebarLabel>Changelog</SidebarLabel>
            </SidebarItem>
          </SidebarSection>
        </SidebarFooter>
      </Sidebar>
    </div>
  );
}
