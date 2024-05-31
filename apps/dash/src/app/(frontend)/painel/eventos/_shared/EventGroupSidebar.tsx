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
import { EventGroupWithEvents } from "prisma/types/Events";
import { useEffect, useMemo, useRef, useState } from "react";

export function EventGroupSidebar({
  eventGroup,
}: {
  eventGroup: EventGroupWithEvents;
}) {
  const params = useParams();
  const pathname = usePathname();
  const currentPage = useMemo(() => pathname.split("/").pop(), [pathname]);
  return (
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
            <HomeIcon />
            <SidebarLabel>Pagamento</SidebarLabel>
          </SidebarItem>
          <Disclosure
            defaultOpen={currentPage === "etapas"}
            as="div"
            className="w-full max-w-md"
          >
            {({ open }) => (
              <>
                <DisclosureButton as={"div"} className="w-full pb-1 text-left">
                  <SidebarItem current={currentPage === "etapas"}>
                    <CalendarDaysIcon />
                    <SidebarLabel>Etapas</SidebarLabel>
                    <ChevronDownIcon />
                  </SidebarItem>
                </DisclosureButton>
                <div className="overflow-hidden py-1 ps-2">
                  <AnimatePresence>
                    {open && (
                      <DisclosurePanel
                        static
                        as={motion.div}
                        initial={{ opacity: 0, y: -24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -24 }}
                        transition={{ duration: 0.2, ease: easeOut }}
                        className="origin-top dark:text-white"
                      >
                        <SidebarItem
                          href={`/painel/eventos/grupos/${eventGroup.id}/etapas`}
                        >
                          <SidebarLabel>Ver Todas</SidebarLabel>
                        </SidebarItem>
                        <For each={eventGroup.Event}>
                          {(event) => (
                            <SidebarItem
                              key={event.id}
                              href={`/painel/eventos/grupos/${eventGroup.id}/etapas/${event.id}/editar`}
                            >
                              <SidebarLabel>{event.name}</SidebarLabel>
                            </SidebarItem>
                          )}
                        </For>
                      </DisclosurePanel>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}
          </Disclosure>
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

        <SidebarSpacer />
        <SidebarSection>
          <SidebarItem href="/support">
            <QuestionMarkCircleIcon />
            <SidebarLabel>Suporte</SidebarLabel>
          </SidebarItem>
          {/* <SidebarItem href="/changelog">
            <SparklesIcon />
            <SidebarLabel>Changelog</SidebarLabel>
          </SidebarItem> */}
        </SidebarSection>
      </SidebarBody>
      <SidebarFooter className="max-lg:hidden">
        <Dropdown>
          <DropdownButton as={SidebarItem}>
            <span className="flex min-w-0 items-center gap-3">
              <Avatar
                src="/profile-photo.jpg"
                className="size-10"
                square
                alt=""
              />
              <span className="min-w-0">
                <span className="block truncate text-sm/5 font-medium text-zinc-950 dark:text-white">
                  Erica
                </span>
                <span className="block truncate text-xs/5 font-normal text-zinc-500 dark:text-zinc-400">
                  erica@example.com
                </span>
              </span>
            </span>
            <ChevronUpIcon />
          </DropdownButton>
          <DropdownMenu className="min-w-64" anchor="top start">
            <DropdownItem href="/my-profile">
              <UserIcon />
              <DropdownLabel>My profile</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/settings">
              <Cog8ToothIcon />
              <DropdownLabel>Settings</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/privacy-policy">
              <ShieldCheckIcon />
              <DropdownLabel>Privacy policy</DropdownLabel>
            </DropdownItem>
            <DropdownItem href="/share-feedback">
              <LightBulbIcon />
              <DropdownLabel>Share feedback</DropdownLabel>
            </DropdownItem>
            <DropdownDivider />
            <DropdownItem href="/logout">
              <ArrowRightStartOnRectangleIcon />
              <DropdownLabel>Sign out</DropdownLabel>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </SidebarFooter>
    </Sidebar>
  );
}
